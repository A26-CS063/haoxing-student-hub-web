const dateFmt = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" });
const numberFmt = new Intl.NumberFormat("id-ID");

/** "2026-09-09" → "9 Sep 2026" (dibaca sebagai tanggal lokal, bukan UTC) */
export function formatDate(isoDate: string): string {
  const [y, m, d] = isoDate.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  return dateFmt.format(new Date(y, m - 1, d));
}

/** "081295822412" → "0812-9582-2412" */
export function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length < 10) return phone;
  return `${d.slice(0, 4)}-${d.slice(4, 8)}-${d.slice(8)}`;
}

export const formatNumber = (n: number) => numberFmt.format(n);
