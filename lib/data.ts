// Mock data for the danger-alert operator app (UI prototype).

export type Zone = "Daryo bo'yi" | "Markaz";

export type Resident = {
  initials: string;
  name: string;
  phone: string;
  zone: Zone;
  active: boolean;
};

export const residents: Resident[] = [
  { initials: "KD", name: "Karimova Dilnoza", phone: "+998 90 123 45 67", zone: "Markaz", active: true },
  { initials: "TA", name: "Toshev Aziz", phone: "+998 91 234 56 78", zone: "Markaz", active: true },
  { initials: "YM", name: "Yusupova Malika", phone: "+998 93 345 67 89", zone: "Daryo bo'yi", active: true },
  { initials: "ES", name: "Ergashev Sardor", phone: "+998 97 587 12 34", zone: "Daryo bo'yi", active: true },
  { initials: "IO", name: "Ivanova Olga", phone: "+998 90 765 43 21", zone: "Markaz", active: true },
  { initials: "RX", name: "Rahimov Xurshid", phone: "+998 99 456 78 90", zone: "Daryo bo'yi", active: true },
  { initials: "SN", name: "Saidova Nigora", phone: "+998 93 111 22 33", zone: "Markaz", active: true },
  { initials: "QJ", name: "Qodirov Jasur", phone: "+998 94 222 33 44", zone: "Markaz", active: false },
];

export type AlertIcon = "waves" | "cloud-rain-wind" | "triangle-alert" | "flask-conical";

export type AlertRecord = {
  icon: AlertIcon;
  title: string;
  date: string;
  level: string;
  critical: boolean;
  percent: string;
  reach: string;
};

export const history: AlertRecord[] = [
  { icon: "waves", title: "Suv toshqini xavfi", date: "12-apr · 09:15", level: "Qizil", critical: true, percent: "98%", reach: "1 258 / 1 284 aholi" },
  { icon: "cloud-rain-wind", title: "Kuchli yomg'ir", date: "03-mar · 18:40", level: "To'q sariq", critical: false, percent: "65%", reach: "835 / 1 284 aholi" },
  { icon: "triangle-alert", title: "Yo'l cheklovi", date: "17-fev · 11:05", level: "Sariq", critical: false, percent: "85%", reach: "1 130 / 1 284 aholi" },
  { icon: "flask-conical", title: "Tizim sinovi", date: "28-yan · 14:30", level: "Sinov", critical: false, percent: "100%", reach: "1 284 / 1 284 aholi" },
];

export const settlement = {
  name: "Oqtepa qishlog'i",
  population: "1 284",
};

// ── Live alert campaign ────────────────────────────────────────────
// UI model that mirrors exactly what the backend will emit. Every number
// on /jonli is DERIVED from this, so swapping mock → real API is trivial.
// The backend source of truth is per-recipient Delivery rows; here we keep
// the per-channel rollup the screen actually renders.

export type Channel = "sms" | "voice";

export type ChannelStats = {
  channel: Channel;
  label: string;
  total: number; // recipients snapshotted for this channel
  delivered: number; // DLR-confirmed delivered
  failed: number; // permanently failed (→ voice escalation)
};

export type Campaign = {
  id: string;
  level: string; // "Qizil"
  title: string; // "Suv toshqini xavfi"
  instruction: string; // call-to-action shown to residents
  elapsed: string; // mock; backend derives from startedAt
  total: number; // recipient snapshot size
  batchSize: number; // chunk size per provider bulk request
  channels: ChannelStats[];
};

// in-flight = queued + sending + sent, i.e. not yet resolved
export const inFlight = (c: ChannelStats) => c.total - c.delivered - c.failed;

export type BatchStatus = "done" | "sending" | "queued";
export type Batch = { no: number; size: number; done: number; status: BatchStatus };

// Batches are a grouping over the ORDERED snapshot (not over raw ids):
// given how many recipients are resolved, derive each chunk's progress.
export function deriveBatches(total: number, size: number, resolved: number): Batch[] {
  const n = Math.ceil(total / size);
  return Array.from({ length: n }, (_, i) => {
    const start = i * size;
    const end = Math.min(start + size, total);
    const span = end - start;
    const done = Math.max(0, Math.min(end, resolved) - start);
    const status: BatchStatus =
      done >= span ? "done" : done > 0 ? "sending" : "queued";
    return { no: i + 1, size: span, done, status };
  });
}

// "1040" → "1 040"
export const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export const liveCampaign: Campaign = {
  id: "cmp_4821",
  level: "Qizil",
  title: "Suv toshqini xavfi",
  instruction: "12-maktab tomon evakuatsiya",
  elapsed: "01:23",
  total: 1284,
  batchSize: 100,
  channels: [
    { channel: "sms", label: "SMS xabar", total: 1284, delivered: 1040, failed: 44 },
  ],
};
