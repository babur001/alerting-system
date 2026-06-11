// OGOH seed data (realistic Uzbek) — ported from the Claude Design rebuild.

export type Risk = "ok" | "warn" | "crit";

/** 1 = safe, 2 = medium, 3 = highest danger */
export type DangerLevel = 1 | 2 | 3;

export type LevelInfo = {
  level: DangerLevel;
  risk: Risk;
  name: string; // "3-daraja"
  label: string; // "Yuqori xavf"
  desc: string;
};

export type WaterObject = {
  id: string;
  name: string;
  region: string;
  level: number; // reservoir fill %
  status: Risk;
};

export type Person = {
  id: string;
  name: string;
  phone: string;
  level: DangerLevel;
  objectId: string;
  active: boolean;
};

export type DeliveryStatus = "queued" | "sent" | "delivered" | "failed";

export type AlertRecipient = {
  id?: string;
  name: string;
  phone: string;
  level: DangerLevel;
  status: DeliveryStatus;
};

export type AlertRecord = {
  id: string;
  objectId: string;
  objectName: string;
  ts: number;
  level: string; // "Qizil" | "Sariq" | "Sinov"
  kind: Risk;
  test?: boolean;
  total: number;
  delivered: number;
  failed: number;
  msg: string;
  operator: string;
  /** null = recipient detail archived */
  recipients: AlertRecipient[] | null;
};

export type Lang = "lotin" | "kirill" | "rus";

// ordered most-dangerous first (list grouping order)
export const LEVELS: LevelInfo[] = [
  {
    level: 3,
    risk: "crit",
    name: "3-daraja",
    label: "Yuqori xavf",
    desc: "Toʻgʻon va daryo oʻzaniga eng yaqin hudud — darhol evakuatsiya",
  },
  {
    level: 2,
    risk: "warn",
    name: "2-daraja",
    label: "Oʻrta xavf",
    desc: "Kuzatuv ostidagi oraliq hudud",
  },
  {
    level: 1,
    risk: "ok",
    name: "1-daraja",
    label: "Xavfsiz hudud",
    desc: "Suv toshqinidan uzoqdagi xavfsiz hudud",
  },
];

export const levelInfo = (l: DangerLevel) => LEVELS.find((x) => x.level === l)!;

export const OBJECTS: WaterObject[] = [
  { id: "chorvoq", name: "Chorvoq suv ombori", region: "Toshkent viloyati", level: 61, status: "ok" },
  { id: "tuyamoyin", name: "Tuyamoʻyin suv ombori", region: "Xorazm viloyati", level: 78, status: "warn" },
  { id: "andijon", name: "Andijon suv ombori", region: "Andijon viloyati", level: 54, status: "ok" },
];

export const DEFAULT_MSG =
  "DIQQAT! Suv toʻsigʻida favqulodda vaziyat. Iltimos, darhol xavfsiz balandlikka koʻching. Daryo va quyi oqimdan uzoqlashing. Rasmiy xabarni kuting. — Favqulodda vaziyatlar boshqarmasi";

let _pid = 0;
const P = (
  name: string,
  phone: string,
  level: DangerLevel,
  objectId: string,
  active = true
): Person => ({
  id: "p" + ++_pid,
  name,
  phone,
  level,
  objectId,
  active,
});

export const PEOPLE: Person[] = [
  // Chorvoq
  P("Akmal Karimov", "+998 90 134 22 18", 3, "chorvoq"),
  P("Dilnoza Yusupova", "+998 91 220 54 09", 3, "chorvoq"),
  P("Bekzod Tursunov", "+998 93 415 67 30", 3, "chorvoq"),
  P("Gulnora Saidova", "+998 94 502 11 76", 3, "chorvoq"),
  P("Jasur Rahimov", "+998 97 661 38 24", 3, "chorvoq"),
  P("Madina Aliyeva", "+998 99 712 90 45", 3, "chorvoq", false),
  P("Sardor Toshmatov", "+998 90 805 19 62", 2, "chorvoq"),
  P("Nigora Qodirova", "+998 88 333 47 51", 2, "chorvoq"),
  P("Otabek Yoʻldoshev", "+998 91 144 78 03", 2, "chorvoq"),
  P("Kamola Ergasheva", "+998 93 256 60 17", 2, "chorvoq"),
  P("Rustam Ismoilov", "+998 94 489 25 88", 1, "chorvoq"),
  P("Feruza Nazarova", "+998 97 570 13 49", 1, "chorvoq"),
  P("Sherzod Abdullayev", "+998 99 618 04 72", 1, "chorvoq", false),
  P("Zulfiya Mirzayeva", "+998 90 927 56 31", 3, "chorvoq"),
  P("Davron Hakimov", "+998 88 401 88 20", 3, "chorvoq"),
  // Tuyamoyin
  P("Ulugʻbek Rashidov", "+998 91 330 12 64", 3, "tuyamoyin"),
  P("Sevara Tojiyeva", "+998 95 218 77 40", 3, "tuyamoyin"),
  P("Aziz Mahmudov", "+998 93 645 09 15", 3, "tuyamoyin"),
  P("Dildora Yusupova", "+998 90 512 36 88", 2, "tuyamoyin"),
  P("Farrux Ochilov", "+998 97 803 41 27", 2, "tuyamoyin"),
  P("Shoira Karimova", "+998 94 159 62 03", 1, "tuyamoyin", false),
  P("Bahodir Soliyev", "+998 99 274 50 19", 3, "tuyamoyin"),
  // Andijon
  P("Nodira Ahmedova", "+998 91 408 23 56", 3, "andijon"),
  P("Sanjar Komilov", "+998 93 517 88 02", 3, "andijon"),
  P("Lola Tashkentova", "+998 90 226 74 13", 2, "andijon"),
  P("Jamshid Begimqulov", "+998 97 391 05 48", 1, "andijon"),
];

// past alerts (history) — recipients summarised
export function seedAlerts(): AlertRecord[] {
  return [
    {
      id: "a3",
      objectId: "tuyamoyin",
      objectName: "Tuyamoʻyin suv ombori",
      ts: Date.now() - 1000 * 60 * 60 * 26,
      level: "Qizil",
      kind: "crit",
      total: 6,
      delivered: 5,
      failed: 1,
      msg: DEFAULT_MSG,
      operator: "N. Yusupova",
      recipients: [
        { name: "Ulugʻbek Rashidov", phone: "+998 91 330 12 64", level: 3, status: "delivered" },
        { name: "Sevara Tojiyeva", phone: "+998 95 218 77 40", level: 3, status: "delivered" },
        { name: "Aziz Mahmudov", phone: "+998 93 645 09 15", level: 3, status: "delivered" },
        { name: "Dildora Yusupova", phone: "+998 90 512 36 88", level: 2, status: "failed" },
        { name: "Farrux Ochilov", phone: "+998 97 803 41 27", level: 2, status: "delivered" },
        { name: "Bahodir Soliyev", phone: "+998 99 274 50 19", level: 3, status: "delivered" },
      ],
    },
    {
      id: "a2",
      objectId: "chorvoq",
      objectName: "Chorvoq suv ombori",
      ts: Date.now() - 1000 * 60 * 60 * 24 * 4,
      level: "Sariq",
      kind: "warn",
      test: true,
      total: 13,
      delivered: 13,
      failed: 0,
      msg: "Sinov xabari: tizim ishlamoqda. Hech qanday choʻra talab etilmaydi.",
      operator: "A. Karimov",
      recipients: null,
    },
    {
      id: "a1",
      objectId: "chorvoq",
      objectName: "Chorvoq suv ombori",
      ts: Date.now() - 1000 * 60 * 60 * 24 * 19,
      level: "Qizil",
      kind: "crit",
      total: 12,
      delivered: 11,
      failed: 1,
      msg: DEFAULT_MSG,
      operator: "A. Karimov",
      recipients: null,
    },
  ];
}

export function timeAgo(ts: number) {
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 1) return "hozir";
  if (m < 60) return m + " daqiqa oldin";
  const h = Math.round(m / 60);
  if (h < 24) return h + " soat oldin";
  return Math.round(h / 24) + " kun oldin";
}

export function fmtDateTime(ts: number) {
  const d = new Date(ts);
  const months = ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avg", "sen", "okt", "noy", "dek"];
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getDate()} ${months[d.getMonth()]}, ${p(d.getHours())}:${p(d.getMinutes())}`;
}
