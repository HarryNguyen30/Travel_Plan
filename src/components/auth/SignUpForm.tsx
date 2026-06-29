"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp } from "@/app/actions/auth";
import {
  AuthCard,
  AuthField,
  AuthMessage,
} from "@/components/auth/AuthLayout";
import { useAuthRedirect } from "@/components/auth/useAuthRedirect";

const initialState = { error: "", success: "" };

export function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);
  useAuthRedirect(state);

  return (
    <AuthCard
      title="Tạo tài khoản"
      description="Đăng ký để bắt đầu lên kế hoạch du lịch"
      footer={
        <>
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Đăng nhập
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
          placeholder="Ít nhất 6 ký tự"
          autoComplete="new-password"
          minLength={6}
        />
        <AuthField
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          type="password"
          placeholder="Nhập lại mật khẩu"
          autoComplete="new-password"
          minLength={6}
        />

        <AuthMessage error={state.error} success={state.success} />

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Đang đăng ký..." : "Tạo tài khoản"}
        </button>
      </form>
    </AuthCard>
  );
}
