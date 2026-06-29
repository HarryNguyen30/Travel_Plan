import { AppHeader } from "@/components/AppHeader";
import { CreatePlanForm } from "@/components/CreatePlanForm";
import { TravelPlanList } from "@/components/TravelPlanList";
import { getTravelPlans } from "@/app/actions/travel-plans";
import type { TravelPlan } from "@/types/travel-plan";
import { hasSupabaseEnv } from "@/utils/supabase/env";

function SetupNotice() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
      <h2 className="font-semibold">Cần cấu hình Supabase</h2>
      <p className="mt-2 text-sm leading-relaxed">
        Sao chép <code className="rounded bg-amber-100 px-1">.env.example</code> thành{" "}
        <code className="rounded bg-amber-100 px-1">.env.local</code>, điền URL và
        Anon/Publishable Key từ Supabase Dashboard, rồi chạy SQL trong{" "}
        <code className="rounded bg-amber-100 px-1">supabase/migrations/</code>.
      </p>
    </div>
  );
}

export default async function HomePage() {
  const hasSupabase = hasSupabaseEnv();

  let plans: TravelPlan[] = [];

  if (hasSupabase) {
    try {
      plans = await getTravelPlans();
    } catch {
      plans = [];
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50/80 to-background">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <header className="mb-6">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Travel Plan
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Lên kế hoạch du lịch
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            Tạo và quản lý các chuyến đi của bạn — điểm đến, thời gian và ghi chú
            tất cả ở một nơi.
          </p>
        </header>

        {!hasSupabase ? (
          <SetupNotice />
        ) : (
          <>
            <AppHeader />
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
              <CreatePlanForm />
              <section>
                <h2 className="mb-4 text-lg font-semibold">
                  Kế hoạch của bạn ({plans.length})
                </h2>
                <TravelPlanList plans={plans} />
              </section>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
