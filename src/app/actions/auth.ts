"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/utils/supabase/server";

export type AuthState = {
  error: string;
  success: string;
  redirectTo?: string;
};

const initialAuthState: AuthState = { error: "", success: "" };

async function getSiteUrl() {
  const headersList = await headers();
  const host =
    headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") ?? "http";

  return `${protocol}://${host}`;
}

async function getSupabaseClient(): Promise<
  { client: Awaited<ReturnType<typeof createServerSupabaseClient>> } | { error: string }
> {
  try {
    const client = await createServerSupabaseClient();
    return { client };
  } catch {
    return {
      error:
        "Supabase chưa được cấu hình. Thêm NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY trên Vercel.",
    };
  }
}

export async function signUp(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!email) {
    return { ...initialAuthState, error: "Vui lòng nhập email." };
  }

  if (password.length < 6) {
    return { ...initialAuthState, error: "Mật khẩu phải có ít nhất 6 ký tự." };
  }

  if (password !== confirmPassword) {
    return { ...initialAuthState, error: "Mật khẩu xác nhận không khớp." };
  }

  const supabaseResult = await getSupabaseClient();
  if ("error" in supabaseResult) {
    return { ...initialAuthState, error: supabaseResult.error };
  }

  const siteUrl = await getSiteUrl();
  const { data, error } = await supabaseResult.client.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    return { ...initialAuthState, error: error.message };
  }

  if (data.session) {
    revalidatePath("/");
    return { ...initialAuthState, redirectTo: "/" };
  }

  return {
    ...initialAuthState,
    success:
      "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản, sau đó đăng nhập.",
  };
}

export async function signIn(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ...initialAuthState, error: "Vui lòng nhập email và mật khẩu." };
  }

  const supabaseResult = await getSupabaseClient();
  if ("error" in supabaseResult) {
    return { ...initialAuthState, error: supabaseResult.error };
  }

  const { error } = await supabaseResult.client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { ...initialAuthState, error: "Email hoặc mật khẩu không đúng." };
  }

  revalidatePath("/");
  return { ...initialAuthState, redirectTo: "/" };
}

export async function signOut() {
  const supabaseResult = await getSupabaseClient();
  if ("client" in supabaseResult) {
    await supabaseResult.client.auth.signOut();
  }

  revalidatePath("/");
  redirect("/login");
}
