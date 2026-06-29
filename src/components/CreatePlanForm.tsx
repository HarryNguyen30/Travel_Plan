"use client";

import { useActionState } from "react";
import { createTravelPlan } from "@/app/actions/travel-plans";

const initialState = { error: "" };

export function CreatePlanForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await createTravelPlan({
        title: String(formData.get("title") ?? ""),
        destination: String(formData.get("destination") ?? ""),
        start_date: String(formData.get("start_date") ?? ""),
        end_date: String(formData.get("end_date") ?? ""),
        description: String(formData.get("description") ?? ""),
      });

      if (!result.success) {
        return { error: result.error };
      }

      const form = document.getElementById("create-plan-form") as HTMLFormElement;
      form?.reset();

      return { error: "" };
    },
    initialState
  );

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">
        Tạo kế hoạch mới
      </h2>
      <p className="mt-1 text-sm text-muted">
        Thêm chuyến đi tiếp theo của bạn
      </p>

      <form
        id="create-plan-form"
        action={formAction}
        className="mt-6 grid gap-4 sm:grid-cols-2"
      >
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-sm font-medium">Tên kế hoạch</span>
          <input
            name="title"
            type="text"
            placeholder="VD: Hè 2026 ở Đà Nẵng"
            required
            className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-sm font-medium">Điểm đến</span>
          <input
            name="destination"
            type="text"
            placeholder="VD: Đà Nẵng, Việt Nam"
            required
            className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Ngày bắt đầu</span>
          <input
            name="start_date"
            type="date"
            required
            className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Ngày kết thúc</span>
          <input
            name="end_date"
            type="date"
            required
            className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="text-sm font-medium">Mô tả (tuỳ chọn)</span>
          <textarea
            name="description"
            rows={3}
            placeholder="Ghi chú về chuyến đi..."
            className="resize-none rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

        {state.error && (
          <p className="text-sm text-red-600 sm:col-span-2">{state.error}</p>
        )}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Đang tạo..." : "Tạo kế hoạch"}
          </button>
        </div>
      </form>
    </section>
  );
}
