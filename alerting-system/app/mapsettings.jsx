// mapsettings.jsx — Xarita (operational schematic) + Sozlama (settings)
const { useState: useStateM } = React;

// ── MAP: schematic operational view of an object ──────────────
function MapScreen({ obj, people }) {
  const [sel, setSel] = useStateM(null);
  const mine = people.filter(p => p.objectId === obj.id);
  // zone layout positions on the schematic (x%, y%)
  const layout = {
    down:   { x: 50, y: 30 },
    river:  { x: 30, y: 50 },
    falls:  { x: 70, y: 52 },
    bridge: { x: 38, y: 70 },
    center: { x: 62, y: 82 },
  };
  const riskColor = r => r === 'crit' ? T.red : r === 'warn' ? T.amber : T.green;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 18px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontFamily: T.sans, fontSize: 26, fontWeight: 700, color: T.text }}>Xarita</div>
          <div style={{ fontFamily: T.mono, fontSize: 11, color: T.dim2, marginTop: 1 }}>{obj.name.split(' ')[0]} · sxematik koʻrinish</div>
        </div>
        <StatusTag kind={obj.status === 'warn' ? 'warn' : 'ok'}>{obj.status === 'warn' ? 'KUZATUVDA' : 'BARQAROR'}</StatusTag>
      </div>

      {/* schematic */}
      <div style={{ flex: 1, position: 'relative', margin: '8px 14px', borderRadius: 16, overflow: 'hidden',
        background: `${T.bg2} ${HATCH}`, border: `1px solid ${T.line2}` }}>
        {/* grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${T.line2} 1px, transparent 1px), linear-gradient(90deg, ${T.line2} 1px, transparent 1px)`, backgroundSize: '34px 34px', opacity: 0.5 }} />
        {/* river */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="riv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1d6fa5" stopOpacity="0.55"/>
              <stop offset="1" stopColor="#15171C" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          <path d="M44 14 C 40 35, 26 48, 30 66 C 33 82, 50 88, 56 100 L 70 100 C 64 86, 52 80, 50 64 C 48 46, 60 34, 56 14 Z" fill="url(#riv)" />
          <path d="M50 14 C 46 36, 32 48, 36 68 C 39 84, 54 90, 60 100" fill="none" stroke="#3da0d8" strokeOpacity="0.5" strokeWidth="0.6" strokeDasharray="2 2"/>
        </svg>
        {/* dam */}
        <div style={{ position: 'absolute', top: '7%', left: '50%', transform: 'translateX(-50%)', width: '52%' }}>
          <div style={{ height: 16, background: `repeating-linear-gradient(90deg, ${T.raise} 0 7px, ${T.panel} 7px 14px)`, borderRadius: 3, border: `1px solid ${T.line}` }} />
          <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: 1, color: T.dim2, textAlign: 'center', marginTop: 4 }}>TOʻGʻON · {obj.level}%</div>
        </div>
        {/* zone pins */}
        {ZONES.map(z => {
          const pos = layout[z.id]; if (!pos) return null;
          const cnt = mine.filter(p => p.zone === z.id).length;
          const act = mine.filter(p => p.zone === z.id && p.active).length;
          const c = riskColor(z.risk);
          const isSel = sel === z.id;
          const r = 18 + Math.min(cnt, 8) * 2;
          return (
            <button key={z.id} onClick={() => setSel(isSel ? null : z.id)} style={{ position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`,
              transform: 'translate(-50%,-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: r * 2.4, height: r * 2.4,
                borderRadius: '50%', background: c, opacity: isSel ? 0.16 : 0.08 }} />
              <span style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                width: r * 2, height: r * 2, borderRadius: '50%', background: T.panel, border: `2px solid ${c}`, boxShadow: isSel ? `0 0 18px ${c}88` : 'none' }}>
                <span style={{ fontFamily: T.mono, fontSize: 13, fontWeight: 700, color: T.text, lineHeight: 1 }}>{act}</span>
                <span style={{ fontFamily: T.mono, fontSize: 7, color: T.dim2, letterSpacing: 0.3 }}>{z.short.toUpperCase()}</span>
              </span>
            </button>
          );
        })}
        {/* selected zone callout */}
        {sel && (() => {
          const z = ZONE(sel); const cnt = mine.filter(p => p.zone === sel).length; const act = mine.filter(p => p.zone === sel && p.active).length;
          return (
            <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12, background: T.panel, border: `1px solid ${T.line}`, borderRadius: 12, padding: 13,
              display: 'flex', alignItems: 'center', gap: 11, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              <Dot color={riskColor(z.risk)} size={9} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: T.sans, fontSize: 14.5, fontWeight: 600, color: T.text }}>{z.name}</div>
                <div style={{ fontFamily: T.mono, fontSize: 10.5, color: T.dim2 }}>{z.desc}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 700, color: T.text }}>{act}<span style={{ color: T.dim2, fontSize: 11 }}>/{cnt}</span></div>
                <div style={{ fontFamily: T.mono, fontSize: 8.5, color: T.dim2, letterSpacing: 0.5 }}>FAOL</div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* legend */}
      <div style={{ display: 'flex', gap: 16, padding: '4px 20px 14px', fontFamily: T.mono, fontSize: 10, color: T.dim2 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Dot color={T.red} size={7} /> Yuqori xavf</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Dot color={T.amber} size={7} /> Oʻrta</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Dot color={T.green} size={7} /> Past</span>
      </div>
    </div>
  );
}

// ── Message template editor ───────────────────────────────────
function MsgEditor({ value, onSave, onClose }) {
  const [txt, setTxt] = useStateM(value);
  const segs = Math.max(1, Math.ceil(txt.length / 153));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 18px 12px' }}>
        <div style={{ fontFamily: T.sans, fontSize: 18, fontWeight: 700, color: T.text }}>SMS shabloni</div>
        <button onClick={onClose} style={{ background: T.panel2, border: 'none', borderRadius: 9, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="x" size={17} color={T.dim} /></button>
      </div>
      <div style={{ padding: '0 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <textarea value={txt} onChange={e => setTxt(e.target.value)} rows={6}
          style={{ width: '100%', boxSizing: 'border-box', background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 12, padding: 14,
            color: T.text, fontFamily: T.sans, fontSize: 14, lineHeight: 1.5, outline: 'none', resize: 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: T.mono, fontSize: 10.5, color: T.dim2, marginTop: 8 }}>
          <span>{txt.length} belgi</span><span>{segs} SMS</span>
        </div>
        <div style={{ fontFamily: T.mono, fontSize: 10.5, color: T.dim2, marginTop: 14, lineHeight: 1.6 }}>
          Bu matn QIZIL daraja ogohlantirishida barcha faol abonentlarga yuboriladi.
        </div>
      </div>
      <div style={{ padding: '12px 18px 4px', borderTop: `1px solid ${T.line}` }}>
        <Btn full variant="solid" onClick={() => onSave(txt)}>Saqlash</Btn>
      </div>
    </div>
  );
}

function Row({ icon, title, sub, right, onClick, danger }) {
  return (
    <button onClick={onClick} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px',
      background: 'none', border: 'none', cursor: onClick ? 'pointer' : 'default' }}>
      {icon && <span style={{ width: 34, height: 34, borderRadius: 9, background: T.bg2, border: `1px solid ${T.line2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={icon} size={18} color={danger ? T.red : T.dim} /></span>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.sans, fontSize: 14.5, fontWeight: 500, color: danger ? T.red : T.text }}>{title}</div>
        {sub && <div style={{ fontFamily: T.mono, fontSize: 10.5, color: T.dim2, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>}
      </div>
      {right}
    </button>
  );
}

function Group({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <Kicker style={{ padding: '0 8px 8px' }}>{title}</Kicker>
      <div style={{ background: T.panel, borderRadius: 14, border: `1px solid ${T.line2}`, overflow: 'hidden' }}>
        {React.Children.toArray(children).map((c, i, arr) => (
          <div key={i} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${T.line2}` : 'none' }}>{c}</div>
        ))}
      </div>
    </div>
  );
}

function SettingsScreen({ message, onMessage, objects, people, lang, onLang }) {
  const [editMsg, setEditMsg] = useStateM(false);
  const [pickLang, setPickLang] = useStateM(false);
  const chev = <Icon name="chev" size={16} color={T.dim2} />;
  const langs = [['lotin', 'Oʻzbekcha (Lotin)'], ['kirill', 'Ўзбекча (Кирилл)'], ['rus', 'Русский']];
  const langLabel = langs.find(l => l[0] === lang)?.[1] || langs[0][1];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 18px 8px' }}>
        <div style={{ fontFamily: T.sans, fontSize: 26, fontWeight: 700, color: T.text }}>Sozlamalar</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 14px 16px' }}>
        <Group title="OGOHLANTIRISH">
          <Row icon="msg" title="SMS shabloni" sub={message} right={chev} onClick={() => setEditMsg(true)} />
          <Row icon="bolt" title="Daraja: QIZIL" sub="Favqulodda — barcha faol abonentlar" right={<StatusTag kind="crit">ASOSIY</StatusTag>} />
          <Row icon="bell" title="Daraja: SARIQ" sub="Ogohlantiruv — sinov va kuzatuv" right={<StatusTag kind="warn">IXTIYORIY</StatusTag>} />
        </Group>

        <Group title={`OBYEKTLAR · ${objects.length}`}>
          {objects.map(o => {
            const cnt = people.filter(p => p.objectId === o.id && p.active).length;
            return <Row key={o.id} icon="water" title={o.name} sub={`${o.region} · ${cnt} faol abonent`}
              right={<StatusTag kind={o.status === 'warn' ? 'warn' : 'ok'}>{o.level}%</StatusTag>} />;
          })}
          <Row icon="plus" title="Obyekt qoʻshish" sub="Yangi suv ombori / toʻgʻon" right={chev} onClick={() => {}} />
        </Group>

        <Group title="TIZIM">
          <Row icon="globe" title="Til / Language" sub={langLabel} right={chev} onClick={() => setPickLang(true)} />
          <Row icon="phone" title="SMS-shlyuz" sub="Operator API · ulangan" right={<StatusTag kind="ok">FAOL</StatusTag>} />
          <Row icon="gear" title="Operator" sub="A. Karimov · Toshkent FVB" right={chev} />
        </Group>

        <div style={{ textAlign: 'center', fontFamily: T.mono, fontSize: 10, color: T.dim2, padding: '8px 0 4px', lineHeight: 1.7 }}>
          OGOH · Suv toʻsiq ogohlantirish tizimi<br/>v1.0 · Favqulodda vaziyatlar boshqarmasi
        </div>
      </div>

      <Sheet open={editMsg} onClose={() => setEditMsg(false)} height="64%">
        {editMsg && <MsgEditor value={message} onSave={(t) => { onMessage(t); setEditMsg(false); }} onClose={() => setEditMsg(false)} />}
      </Sheet>

      <Sheet open={pickLang} onClose={() => setPickLang(false)}>
        <div style={{ padding: '6px 18px 4px' }}>
          <div style={{ fontFamily: T.sans, fontSize: 17, fontWeight: 700, color: T.text, marginBottom: 6, padding: '0 4px' }}>Til / Language</div>
          {langs.map(([id, lbl]) => (
            <button key={id} onClick={() => { onLang(id); setPickLang(false); }} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', padding: '13px 12px', borderRadius: 12, marginTop: 6, cursor: 'pointer',
              background: lang === id ? T.panel2 : 'transparent', border: `1px solid ${lang === id ? T.line : 'transparent'}` }}>
              <span style={{ fontFamily: T.sans, fontSize: 15, color: T.text }}>{lbl}</span>
              {lang === id && <Icon name="check" size={18} color={T.green} sw={2.4} />}
            </button>
          ))}
          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.dim2, padding: '12px 4px 4px', lineHeight: 1.6 }}>
            Interfeys tili. SMS matnini istalgan tilda yozish mumkin.
          </div>
        </div>
      </Sheet>
    </div>
  );
}

Object.assign(window, { MapScreen, SettingsScreen });
