// app.jsx — OGOH root: state, persistence, tab router, device shell
const { useState: useStateA, useEffect: useEffectA, useRef: useRefA } = React;

const LS_KEY = 'ogoh_state_v3';

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

const TABS = [
  { id: 'siren', label: 'Trevoga', icon: 'siren' },
  { id: 'people', label: 'Aholi', icon: 'people' },
  { id: 'history', label: 'Tarix', icon: 'history' },
  { id: 'map', label: 'Xarita', icon: 'map' },
  { id: 'settings', label: 'Sozlama', icon: 'gear' },
];

function BottomTabs({ tab, onTab }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', padding: '9px 6px 22px',
      background: T.bg2, borderTop: `1px solid ${T.line}`, flexShrink: 0 }}>
      {TABS.map(t => {
        const on = t.id === tab;
        return (
          <button key={t.id} onClick={() => onTab(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '2px 4px', flex: 1 }}>
            <Icon name={t.icon} size={22} color={on ? T.red : T.dim2} sw={on ? 2.1 : 1.8} />
            <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 0.4, color: on ? T.text : T.dim2, fontWeight: on ? 600 : 400 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function App() {
  const saved = useRefA(loadState()).current;
  const [people, setPeople] = useStateA(saved?.people || PEOPLE);
  const [alerts, setAlerts] = useStateA(saved?.alerts || seedAlerts());
  const [message, setMessage] = useStateA(saved?.message || DEFAULT_MSG);
  const [lang, setLang] = useStateA(saved?.lang || 'lotin');
  const [objId, setObjId] = useStateA(saved?.objId || OBJECTS[0].id);
  const [tab, setTab] = useStateA('siren');

  useEffectA(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify({ people, alerts, message, lang, objId })); } catch (e) {}
  }, [people, alerts, message, lang, objId]);

  const obj = OBJECTS.find(o => o.id === objId) || OBJECTS[0];

  // people CRUD
  let nid = useRefA(1000);
  const addPerson = (data) => setPeople(ps => [{ id: 'p' + (++nid.current), ...data }, ...ps]);
  const updatePerson = (id, data) => setPeople(ps => ps.map(p => p.id === id ? { ...p, ...data } : p));
  const deletePerson = (id) => setPeople(ps => ps.filter(p => p.id !== id));
  const toggleActive = (id, v) => setPeople(ps => ps.map(p => p.id === id ? { ...p, active: v } : p));
  const addAlert = (a) => { setAlerts(al => [a, ...al]); setTab('history'); };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: `${T.bg} ${HATCH}`, color: T.text, fontFamily: T.sans, overflow: 'hidden' }}>
      <div style={{ height: 50, flexShrink: 0 }} />
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {tab === 'siren' && <SirenScreen obj={obj} objects={OBJECTS} people={people} message={message}
          onSwitchObj={setObjId} onSend={addAlert} lastAlert={alerts[0]} />}
        {tab === 'people' && <PeopleScreen obj={obj} people={people}
          onAdd={addPerson} onUpdate={updatePerson} onDelete={deletePerson} onToggle={toggleActive} />}
        {tab === 'history' && <HistoryScreen alerts={alerts} />}
        {tab === 'map' && <MapScreen obj={obj} people={people} />}
        {tab === 'settings' && <SettingsScreen message={message} onMessage={setMessage} objects={OBJECTS} people={people} lang={lang} onLang={setLang} />}
      </div>
      <BottomTabs tab={tab} onTab={setTab} />
    </div>
  );
}

// ── Device shell: scale 402×874 frame to viewport ─────────────
function Shell() {
  const [scale, setScale] = useStateA(1);
  const W = 402, H = 874;
  useEffectA(() => {
    const fit = () => {
      const s = Math.min((window.innerWidth - 24) / W, (window.innerHeight - 24) / H, 1.15);
      setScale(s);
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(120% 90% at 50% 0%, #16181d 0%, #050608 70%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        <IOSDevice dark={true} width={W} height={H}><App /></IOSDevice>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Shell />);
