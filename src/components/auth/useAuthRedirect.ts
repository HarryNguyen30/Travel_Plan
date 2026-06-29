"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { AuthState } from "@/app/actions/auth";

export function useAuthRedirect(state: AuthState) {
  const router = useRouter();

  useEffect(() => {
    if (state.redirectTo) {
      router.push(state.redirectTo);
      router.refresh();
    }
  }, [state.redirectTo, router]);
}
