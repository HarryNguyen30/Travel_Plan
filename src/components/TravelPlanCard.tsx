"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deleteTravelPlan } from "@/app/actions/travel-plans";
import type { TravelPlan } from "@/types/travel-plan";

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDurationDays(start: string, end: string) {
  const startDate = new Date(start + "T00:00:00");
  const endDate = new Date(end + "T00:00:00");
  const diff = endDate.getTime() - startDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

type TravelPlanCardProps = {
  plan: TravelPlan;
};

export function TravelPlanCard({ plan }: TravelPlanCardProps) {
  const [isPending, startTransition] = useTransition();
  const days = getDurationDays(plan.start_date, plan.end_date);

  function handleDelete(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!confirm(`Xóa kế hoạch "${plan.title}"?`)) return;

    startTransition(async () => {
      await deleteTravelPlan(plan.id);
    });
  }

  return (
    <Link href={`/plans/${plan.id}`} className="block">
      <article className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/30 hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{plan.title}</h3>
            <p className="mt-1 text-sm text-primary">{plan.destination}</p>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-md px-2 py-1 text-xs text-muted transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            aria-label={`Xóa ${plan.title}`}
          >
            {isPending ? "..." : "Xóa"}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted">
          <span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-700">
            {formatDate(plan.start_date)} → {formatDate(plan.end_date)}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1">
            {days} ngày
          </span>
        </div>

        {plan.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
            {plan.description}
          </p>
        )}

        <p className="mt-4 text-sm font-medium text-primary">Mở lịch trình →</p>
      </article>
    </Link>
  );
}
