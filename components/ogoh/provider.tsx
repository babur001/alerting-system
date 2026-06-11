"use client";

// OGOH app state — shared across the tab routes, persisted to localStorage.
// Ported from the Claude Design rebuild's root (app.jsx), where screens were
// state-switched tabs; here each tab is a route so state lives in context.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DEFAULT_MSG,
  OBJECTS,
  PEOPLE,
  seedAlerts,
  type AlertRecord,
  type DangerLevel,
  type Lang,
  type Person,
  type WaterObject,
} from "@/lib/ogoh/data";

const LS_KEY = "ogoh_state_v4";
const LEGACY_LS_KEY = "ogoh_state_v3"; // zone-based people (river/down/falls/bridge/center)

const ZONE_TO_LEVEL: Record<string, DangerLevel> = {
  river: 3,
  down: 3,
  falls: 2,
  bridge: 2,
  center: 1,
};

type PersonInput = Omit<Person, "id">;
type ObjectInput = Omit<WaterObject, "id">;

type OgohContextValue = {
  people: Person[];
  alerts: AlertRecord[];
  message: string;
  lang: Lang;
  obj: WaterObject;
  objects: WaterObject[];
  setMessage: (m: string) => void;
  setLang: (l: Lang) => void;
  setObjId: (id: string) => void;
  addPerson: (data: PersonInput) => void;
  updatePerson: (id: string, data: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  togglePerson: (id: string, active: boolean) => void;
  addAlert: (a: AlertRecord) => void;
  addObject: (data: ObjectInput) => void;
};

const OgohContext = createContext<OgohContextValue | null>(null);

type Persisted = {
  people?: Person[];
  alerts?: AlertRecord[];
  message?: string;
  lang?: Lang;
  objId?: string;
  objects?: WaterObject[];
};

export function OgohProvider({ children }: { children: React.ReactNode }) {
  const [people, setPeople] = useState<Person[]>(PEOPLE);
  const [alerts, setAlerts] = useState<AlertRecord[]>(seedAlerts);
  const [message, setMessage] = useState(DEFAULT_MSG);
  const [lang, setLang] = useState<Lang>("lotin");
  const [objects, setObjects] = useState<WaterObject[]>(OBJECTS);
  const [objId, setObjId] = useState(OBJECTS[0].id);
  const hydrated = useRef(false);

  // restore once on mount (server render uses the seeds)
  useEffect(() => {
    try {
      let raw = localStorage.getItem(LS_KEY);
      let legacy = false;
      if (!raw) {
        raw = localStorage.getItem(LEGACY_LS_KEY);
        legacy = !!raw;
      }
      if (raw) {
        const s: Persisted = JSON.parse(raw);
        if (legacy) {
          // map old zone ids onto danger levels
          type LegacyPerson = Omit<Person, "level"> & { zone?: string };
          s.people = (s.people as unknown as LegacyPerson[] | undefined)?.map(
            ({ zone, ...p }) => ({ ...p, level: ZONE_TO_LEVEL[zone ?? ""] ?? 1 })
          );
          s.alerts = s.alerts?.map((a) => ({
            ...a,
            recipients:
              a.recipients?.map((r) => {
                const { zone, ...rest } = r as typeof r & { zone?: string };
                return { ...rest, level: rest.level ?? ZONE_TO_LEVEL[zone ?? ""] ?? 1 };
              }) ?? null,
          }));
          localStorage.removeItem(LEGACY_LS_KEY);
        }
        if (s.people) setPeople(s.people);
        if (s.alerts) setAlerts(s.alerts);
        if (s.message) setMessage(s.message);
        if (s.lang) setLang(s.lang);
        if (s.objects) setObjects(s.objects);
        if (s.objId) setObjId(s.objId);
      }
    } catch {}
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({ people, alerts, message, lang, objId, objects })
      );
    } catch {}
  }, [people, alerts, message, lang, objId, objects]);

  const addPerson = useCallback((data: PersonInput) => {
    setPeople((ps) => [{ id: `p${Date.now()}`, ...data }, ...ps]);
  }, []);
  const updatePerson = useCallback((id: string, data: Partial<Person>) => {
    setPeople((ps) => ps.map((p) => (p.id === id ? { ...p, ...data } : p)));
  }, []);
  const deletePerson = useCallback((id: string) => {
    setPeople((ps) => ps.filter((p) => p.id !== id));
  }, []);
  const togglePerson = useCallback((id: string, active: boolean) => {
    setPeople((ps) => ps.map((p) => (p.id === id ? { ...p, active } : p)));
  }, []);
  const addAlert = useCallback((a: AlertRecord) => {
    setAlerts((al) => [a, ...al]);
  }, []);
  const addObject = useCallback((data: ObjectInput) => {
    const id = `o${Date.now()}`;
    setObjects((os) => [...os, { id, ...data }]);
    setObjId(id); // switch the app to the newly added object
  }, []);

  const value = useMemo<OgohContextValue>(() => {
    const obj = objects.find((o) => o.id === objId) ?? objects[0];
    return {
      people,
      alerts,
      message,
      lang,
      obj,
      objects,
      setMessage,
      setLang,
      setObjId,
      addPerson,
      updatePerson,
      deletePerson,
      togglePerson,
      addAlert,
      addObject,
    };
  }, [people, alerts, message, lang, objId, objects, addPerson, updatePerson, deletePerson, togglePerson, addAlert, addObject]);

  return <OgohContext.Provider value={value}>{children}</OgohContext.Provider>;
}

export function useOgoh() {
  const ctx = useContext(OgohContext);
  if (!ctx) throw new Error("useOgoh must be used within OgohProvider");
  return ctx;
}
