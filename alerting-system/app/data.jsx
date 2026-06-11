// data.jsx — OGOH seed data (realistic Uzbek). Loaded after shared.

const ZONES = [
  { id: 'river',  name: 'Daryo yaqinida',  short: 'Daryo', desc: 'Daryo oʻzaniga 200 m', risk: 'crit' },
  { id: 'down',   name: 'Quyi oqim',       short: 'Quyi oqim', desc: 'Toʻgʻon ostidagi hudud', risk: 'crit' },
  { id: 'falls',  name: 'Sharshara yaqin', short: 'Sharshara', desc: 'Sharshara zonasi', risk: 'warn' },
  { id: 'bridge', name: 'Koʻprik atrofi',  short: 'Koʻprik', desc: 'Koʻprik va yoʻl', risk: 'warn' },
  { id: 'center', name: 'Shahar markazi',  short: 'Markaz', desc: 'Aholi punkti markazi', risk: 'ok' },
];
const ZONE = id => ZONES.find(z => z.id === id);

const OBJECTS = [
  { id: 'chorvoq', name: 'Chorvoq suv ombori', region: 'Toshkent viloyati', level: 61, status: 'ok' },
  { id: 'tuyamoyin', name: 'Tuyamoʻyin suv ombori', region: 'Xorazm viloyati', level: 78, status: 'warn' },
  { id: 'andijon', name: 'Andijon suv ombori', region: 'Andijon viloyati', level: 54, status: 'ok' },
];

const DEFAULT_MSG = 'DIQQAT! Suv toʻsigʻida favqulodda vaziyat. Iltimos, darhol xavfsiz balandlikka koʻching. Daryo va quyi oqimdan uzoqlashing. Rasmiy xabarni kuting. — Favqulodda vaziyatlar boshqarmasi';

let _pid = 0;
const P = (name, phone, zone, objectId, active = true) => ({ id: 'p' + (++_pid), name, phone, zone, objectId, active });

const PEOPLE = [
  // Chorvoq
  P('Akmal Karimov', '+998 90 134 22 18', 'river', 'chorvoq'),
  P('Dilnoza Yusupova', '+998 91 220 54 09', 'river', 'chorvoq'),
  P('Bekzod Tursunov', '+998 93 415 67 30', 'river', 'chorvoq'),
  P('Gulnora Saidova', '+998 94 502 11 76', 'down', 'chorvoq'),
  P('Jasur Rahimov', '+998 97 661 38 24', 'down', 'chorvoq'),
  P('Madina Aliyeva', '+998 99 712 90 45', 'down', 'chorvoq', false),
  P('Sardor Toshmatov', '+998 90 805 19 62', 'falls', 'chorvoq'),
  P('Nigora Qodirova', '+998 88 333 47 51', 'falls', 'chorvoq'),
  P('Otabek Yoʻldoshev', '+998 91 144 78 03', 'bridge', 'chorvoq'),
  P('Kamola Ergasheva', '+998 93 256 60 17', 'bridge', 'chorvoq'),
  P('Rustam Ismoilov', '+998 94 489 25 88', 'center', 'chorvoq'),
  P('Feruza Nazarova', '+998 97 570 13 49', 'center', 'chorvoq'),
  P('Sherzod Abdullayev', '+998 99 618 04 72', 'center', 'chorvoq', false),
  P('Zulfiya Mirzayeva', '+998 90 927 56 31', 'river', 'chorvoq'),
  P('Davron Hakimov', '+998 88 401 88 20', 'down', 'chorvoq'),
  // Tuyamoyin
  P('Ulugʻbek Rashidov', '+998 91 330 12 64', 'river', 'tuyamoyin'),
  P('Sevara Tojiyeva', '+998 95 218 77 40', 'river', 'tuyamoyin'),
  P('Aziz Mahmudov', '+998 93 645 09 15', 'down', 'tuyamoyin'),
  P('Dildora Yusupova', '+998 90 512 36 88', 'falls', 'tuyamoyin'),
  P('Farrux Ochilov', '+998 97 803 41 27', 'bridge', 'tuyamoyin'),
  P('Shoira Karimova', '+998 94 159 62 03', 'center', 'tuyamoyin', false),
  P('Bahodir Soliyev', '+998 99 274 50 19', 'river', 'tuyamoyin'),
  // Andijon
  P('Nodira Ahmedova', '+998 91 408 23 56', 'river', 'andijon'),
  P('Sanjar Komilov', '+998 93 517 88 02', 'down', 'andijon'),
  P('Lola Tashkentova', '+998 90 226 74 13', 'bridge', 'andijon'),
  P('Jamshid Begimqulov', '+998 97 391 05 48', 'center', 'andijon'),
];

// past alerts (history) — recipients summarised
function seedAlerts() {
  return [
    {
      id: 'a3', objectId: 'tuyamoyin', objectName: 'Tuyamoʻyin suv ombori',
      ts: Date.now() - 1000 * 60 * 60 * 26, level: 'Qizil', kind: 'crit',
      total: 6, delivered: 5, failed: 1, msg: DEFAULT_MSG, operator: 'N. Yusupova',
      recipients: [
        { name: 'Ulugʻbek Rashidov', phone: '+998 91 330 12 64', zone: 'river', status: 'delivered' },
        { name: 'Sevara Tojiyeva', phone: '+998 95 218 77 40', zone: 'river', status: 'delivered' },
        { name: 'Aziz Mahmudov', phone: '+998 93 645 09 15', zone: 'down', status: 'delivered' },
        { name: 'Dildora Yusupova', phone: '+998 90 512 36 88', zone: 'falls', status: 'failed' },
        { name: 'Farrux Ochilov', phone: '+998 97 803 41 27', zone: 'bridge', status: 'delivered' },
        { name: 'Bahodir Soliyev', phone: '+998 99 274 50 19', zone: 'river', status: 'delivered' },
      ],
    },
    {
      id: 'a2', objectId: 'chorvoq', objectName: 'Chorvoq suv ombori',
      ts: Date.now() - 1000 * 60 * 60 * 24 * 4, level: 'Sariq', kind: 'warn',
      total: 13, delivered: 13, failed: 0, msg: 'Sinov xabari: tizim ishlamoqda. Hech qanday choʻra talab etilmaydi.', operator: 'A. Karimov', test: true,
      recipients: null,
    },
    {
      id: 'a1', objectId: 'chorvoq', objectName: 'Chorvoq suv ombori',
      ts: Date.now() - 1000 * 60 * 60 * 24 * 19, level: 'Qizil', kind: 'crit',
      total: 12, delivered: 11, failed: 1, msg: DEFAULT_MSG, operator: 'A. Karimov',
      recipients: null,
    },
  ];
}

Object.assign(window, { ZONES, ZONE, OBJECTS, PEOPLE, DEFAULT_MSG, seedAlerts });
