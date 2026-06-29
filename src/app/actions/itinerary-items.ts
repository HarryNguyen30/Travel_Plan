"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/utils/supabase/server";
import type {
  CreateItineraryItemInput,
  ItineraryItem,
  ItineraryItemUpdate,
  PlaceSearchResult,
} from "@/types/itinerary-item";

async function requireUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Bạn cần đăng nhập.");
  }

  return { supabase, user };
}

function revalidatePlan(planId: string) {
  revalidatePath(`/plans/${planId}`);
  revalidatePath("/");
}

export async function getItineraryItems(planId: string): Promise<ItineraryItem[]> {
  const { supabase } = await requireUser();

  const { data, error } = await supabase
    .from("itinerary_items")
    .select("*")
    .eq("plan_id", planId)
    .order("day_date", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function addItineraryItem(
  input: CreateItineraryItemInput
): Promise<{ success: true; item: ItineraryItem } | { success: false; error: string }> {
  const title = input.title.trim();
  const locationName = input.location_name?.trim() || null;
  const notes = input.notes?.trim() || null;

  if (!title) {
    return { success: false, error: "Vui lòng nhập tên địa điểm." };
  }

  if (!input.day_date) {
    return { success: false, error: "Vui lòng chọn ngày." };
  }

  try {
    const { supabase, user } = await requireUser();

    const { data: existing } = await supabase
      .from("itinerary_items")
      .select("sort_order")
      .eq("plan_id", input.plan_id)
      .eq("day_date", input.day_date)
      .order("sort_order", { ascending: false })
      .limit(1);

    const nextOrder = existing?.[0]?.sort_order != null ? existing[0].sort_order + 1 : 0;

    const { data, error } = await supabase
      .from("itinerary_items")
      .insert({
        plan_id: input.plan_id,
        user_id: user.id,
        day_date: input.day_date,
        sort_order: nextOrder,
        title,
        location_name: locationName,
        lat: input.lat ?? null,
        lng: input.lng ?? null,
        notes,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePlan(input.plan_id);
    return { success: true, item: data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Không thể thêm địa điểm.",
    };
  }
}

export async function deleteItineraryItem(
  id: string,
  planId: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const { supabase } = await requireUser();

    const { error } = await supabase
      .from("itinerary_items")
      .delete()
      .eq("id", id)
      .eq("plan_id", planId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePlan(planId);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Không thể xóa địa điểm.",
    };
  }
}

export async function reorderItineraryItems(
  planId: string,
  updates: ItineraryItemUpdate[]
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const { supabase } = await requireUser();

    for (const update of updates) {
      const { error } = await supabase
        .from("itinerary_items")
        .update({
          day_date: update.day_date,
          sort_order: update.sort_order,
        })
        .eq("id", update.id)
        .eq("plan_id", planId);

      if (error) {
        return { success: false, error: error.message };
      }
    }

    revalidatePlan(planId);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Không thể sắp xếp lại.",
    };
  }
}

export async function searchPlaces(
  query: string,
  near?: string
): Promise<PlaceSearchResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return [];
  }

  const searchQuery = near ? `${trimmed}, ${near}` : trimmed;
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", searchQuery);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "6");
  url.searchParams.set("addressdetails", "1");

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": "TravelPlanApp/1.0 (travel-plan-app)",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return [];
  }

  const results = (await response.json()) as Array<{
    display_name: string;
    lat: string;
    lon: string;
    name?: string;
  }>;

  return results.map((place) => ({
    title: place.name || place.display_name.split(",")[0],
    location_name: place.display_name,
    lat: Number(place.lat),
    lng: Number(place.lon),
  }));
}
