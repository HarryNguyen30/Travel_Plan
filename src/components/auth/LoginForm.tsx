"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn } from "@/app/actions/auth";
import {
  AuthCard,
  AuthField,
  AuthMessage,
} from "@/components/auth/AuthLayout";
import { useAuthRedirect } from "@/components/auth/useAuthRedirect";

const initialState = { error: "", success: "" };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);
  useAuthRedirect(state);

  return (
    <AuthCard
      title="Đăng nhập"
      description="Đăng nhập để quản lý kế hoạch du lịch của bạn"
      footer={
        <>
          Chưa có tài khoản?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Đăng ký ngay
          </Link>
        </>
      }
    >
      <form action={formAction} className="space-y-4">
        <AuthField
          label="Email"
          name="email"
          type="email"
          placeholder="ban@email.com"
          autoComplete="email"
        />
        <AuthField
          label="Mật khẩu"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
        />

        <AuthMessage error={state.error} success={state.success} />

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </AuthCard>
  );
}
