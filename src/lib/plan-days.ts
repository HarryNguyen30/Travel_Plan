export function getPlanDayDates(startDate: string, endDate: string): string[] {
  const days: string[] = [];
  const current = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");

  while (current <= end) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const day = String(current.getDate()).padStart(2, "0");
    days.push(`${year}-${month}-${day}`);
    current.setDate(current.getDate() + 1);
  }

  return days;
}

export function formatPlanDayLabel(dateStr: string, index: number) {
  const date = new Date(dateStr + "T00:00:00");
  const weekday = date.toLocaleDateString("vi-VN", { weekday: "short" });
  const formatted = date.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "short",
  });

  return `Ngày ${index + 1} · ${weekday}, ${formatted}`;
}
