import { signOut } from "@/app/actions/auth";
import { createServerSupabaseClient } from "@/utils/supabase/server";

export async function AppHeader() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
      <div>
        <p className="text-sm text-muted">Xin chào</p>
        <p className="font-medium text-foreground">{user.email}</p>
      </div>
      <form action={signOut}>
        <button
          type="submit"
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-slate-50"
        >
          Đăng xuất
        </button>
      </form>
    </header>
  );
}
