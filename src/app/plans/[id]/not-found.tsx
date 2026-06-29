import Link from "next/link";

export default function PlanNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Không tìm thấy kế hoạch</h1>
        <p className="mt-2 text-muted">Kế hoạch này không tồn tại hoặc bạn không có quyền xem.</p>
        <Link href="/" className="mt-6 inline-block text-primary hover:underline">
          Về trang chủ
        </Link>
      </div>
    </main>
  );
}
