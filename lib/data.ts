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
