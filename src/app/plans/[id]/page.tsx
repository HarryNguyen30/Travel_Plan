import Link from "next/link";
import { notFound } from "next/navigation";
import { ItineraryPlanner } from "@/components/itinerary/ItineraryPlanner";
import { getItineraryItems } from "@/app/actions/itinerary-items";
import { getTravelPlan } from "@/app/actions/travel-plans";
import { getPlanDayDates } from "@/lib/plan-days";

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type PlanDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PlanDetailPage({ params }: PlanDetailPageProps) {
  const { id } = await params;
  const plan = await getTravelPlan(id);

  if (!plan) {
    notFound();
  }

  const items = await getItineraryItems(id);
  const dayDates = getPlanDayDates(plan.start_date, plan.end_date);

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50/80 to-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Link
          href="/"
          className="text-sm font-medium text-primary transition hover:underline"
        >
          ← Quay lại danh sách
        </Link>

        <header className="mt-6 mb-8">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            {plan.destination}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {plan.title}
          </h1>
          <p className="mt-3 text-muted">
            {formatDate(plan.start_date)} → {formatDate(plan.end_date)} · {dayDates.length} ngày
          </p>
          {plan.description && (
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
              {plan.description}
            </p>
          )}
        </header>

        <ItineraryPlanner plan={plan} initialItems={items} dayDates={dayDates} />
      </div>
    </main>
  );
}
