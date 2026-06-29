"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import type { CreateTravelPlanInput, TravelPlan } from "@/types/travel-plan";

export async function getTravelPlans(): Promise<TravelPlan[]> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("travel_plans")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getTravelPlan(id: string): Promise<TravelPlan | null> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("travel_plans")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createTravelPlan(
  input: CreateTravelPlanInput
): Promise<{ success: true } | { success: false; error: string }> {
  const title = input.title.trim();
  const destination = input.destination.trim();
  const description = input.description?.trim() || null;

  if (!title) {
    return { success: false, error: "Vui lòng nhập tên kế hoạch." };
  }

  if (!destination) {
    return { success: false, error: "Vui lòng nhập điểm đến." };
  }

  if (!input.start_date || !input.end_date) {
    return { success: false, error: "Vui lòng chọn ngày bắt đầu và kết thúc." };
  }

  if (input.end_date < input.start_date) {
    return { success: false, error: "Ngày kết thúc phải sau ngày bắt đầu." };
  }

  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Bạn cần đăng nhập để tạo kế hoạch." };
  }

  const { error } = await supabase.from("travel_plans").insert({
    user_id: user.id,
    title,
    destination,
    start_date: input.start_date,
    end_date: input.end_date,
    description,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function deleteTravelPlan(
  id: string
): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Bạn cần đăng nhập để xóa kế hoạch." };
  }

  const { error } = await supabase.from("travel_plans").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}
