"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  error: string;
  success: string;
};

const initialAuthState: AuthState = { error: "", success: "" };

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

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { ...initialAuthState, error: error.message };
  }

  if (data.session) {
    revalidatePath("/");
    redirect("/");
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

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ...initialAuthState, error: "Email hoặc mật khẩu không đúng." };
  }

  revalidatePath("/");
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/login");
}
