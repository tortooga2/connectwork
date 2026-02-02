/**
 * Format a date for display with conditional relative formatting:
 * - Today: "Today 7:06pm"
 * - Within past week: "Tue 9th, 7:06pm"
 * - Older: "Jan 28, 2026 7:06pm"
 */
export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";

  const now = new Date();
  const timeStr = d.toLocaleString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).replace(/\s*(AM|PM)$/i, (_, period) => period.toLowerCase());

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfD = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const daysDiff = Math.floor((startOfToday.getTime() - startOfD.getTime()) / (24 * 60 * 60 * 1000));

  if (daysDiff === 0) {
    return `Today ${timeStr}`;
  }

  if (daysDiff > 0 && daysDiff < 7) {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeek = dayNames[d.getDay()];
    const day = d.getDate();
    const ordinal =
      day === 11 || day === 12 || day === 13
        ? "th"
        : { 1: "st", 2: "nd", 3: "rd" }[day % 10] ?? "th";
    return `${dayOfWeek} ${day}${ordinal}, ${timeStr}`;
  }

  const shortDate = d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${shortDate} ${timeStr}`;
}
