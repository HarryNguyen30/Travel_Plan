import { TravelPlanCard } from "@/components/TravelPlanCard";
import type { TravelPlan } from "@/types/travel-plan";

type TravelPlanListProps = {
  plans: TravelPlan[];
};

export function TravelPlanList({ plans }: TravelPlanListProps) {
  if (plans.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
        <p className="text-base font-medium text-foreground">
          Chưa có kế hoạch nào
        </p>
        <p className="mt-2 text-sm text-muted">
          Tạo kế hoạch đầu tiên để bắt đầu lên lịch chuyến đi của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {plans.map((plan) => (
        <TravelPlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}
