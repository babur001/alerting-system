// shared.jsx — OGOH design tokens, icons, siren visual, UI primitives
// Direction B: dark tactical control room. Loaded first.

const T = {
  bg:    '#0C0D10',
  bg2:   '#08090C',
  panel: '#15171C',
  panel2:'#1B1E25',
  raise: '#22262E',
  line:  'rgba(255,255,255,0.10)',
  line2: 'rgba(255,255,255,0.055)',
  text:  '#E7E9EC',
  dim:   '#9AA1AB',
  dim2:  '#6E7580',
  red:   '#FF4632',
  redDeep:'#C41D10',
  redSoft:'rgba(255,70,50,0.14)',
  green: '#1FCB84',
  greenSoft:'rgba(31,203,132,0.14)',
  amber: '#F4A724',
  amberSoft:'rgba(244,167,36,0.14)',
  mono:  "'IBM Plex Mono', ui-monospace, monospace",
  sans:  "'IBM Plex Sans', system-ui, sans-serif",
};
const HATCH = 'repeating-linear-gradient(135deg, rgba(255,255,255,0.016) 0 2px, transparent 2px 9px)';

// ── Icon set (simple line UI icons) ───────────────────────────
function Icon({ name, size = 22, color = 'currentColor', sw = 1.9 }) {
  const p = { fill: 'none', stroke: color, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    siren: <><path d="M5 18v-2a7 7 0 0 1 14 0v2" {...p}/><rect x="3.5" y="18" width="17" height="3.2" rx="1.6" {...p}/><line x1="12" y1="5.5" x2="12" y2="2.5" {...p}/><line x1="19" y1="8.5" x2="21.2" y2="6.6" {...p}/><line x1="5" y1="8.5" x2="2.8" y2="6.6" {...p}/></>,
    people: <><circle cx="9" cy="8" r="3.3" {...p}/><path d="M3.5 20v-1.3A4.7 4.7 0 0 1 8.2 14h1.6a4.7 4.7 0 0 1 4.7 4.7V20" {...p}/><path d="M16 5.4a3 3 0 0 1 0 5.6M17.4 14h.5a4.2 4.2 0 0 1 4.1 4.2V20" {...p}/></>,
    history: <><circle cx="12" cy="12" r="8.5" {...p}/><path d="M12 7.2V12l3.2 2" {...p}/></>,
    map: <><path d="M9 4 3.5 6.2v13.3L9 17.3l6 2.2 5.5-2.2V3.9L15 6.1 9 3.9z" {...p}/><line x1="9" y1="4" x2="9" y2="17.3" {...p}/><line x1="15" y1="6.1" x2="15" y2="19.5" {...p}/></>,
    gear: <><circle cx="12" cy="12" r="3" {...p}/><path d="M12 2.6v2.4M12 19v2.4M21.4 12H19M5 12H2.6M18.6 5.4 16.9 7.1M7.1 16.9l-1.7 1.7M18.6 18.6 16.9 16.9M7.1 7.1 5.4 5.4" {...p}/></>,
    search: <><circle cx="11" cy="11" r="6.5" {...p}/><line x1="20" y1="20" x2="16" y2="16" {...p}/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" {...p}/><line x1="5" y1="12" x2="19" y2="12" {...p}/></>,
    chev: <path d="M9 6l6 6-6 6" {...p}/>,
    chevDown: <path d="M6 9l6 6 6-6" {...p}/>,
    back: <path d="M15 6l-6 6 6 6" {...p}/>,
    phone: <path d="M5.5 4h3l1.4 4-2 1.3a11 11 0 0 0 4.8 4.8l1.3-2 4 1.4v3a1.6 1.6 0 0 1-1.8 1.6A15.6 15.6 0 0 1 4 6.8 1.6 1.6 0 0 1 5.5 4z" {...p}/>,
    check: <path d="M4.5 12.5 9.5 17.5 19.5 6.5" {...p}/>,
    x: <><line x1="6" y1="6" x2="18" y2="18" {...p}/><line x1="18" y1="6" x2="6" y2="18" {...p}/></>,
    edit: <><path d="M14 4.5 19.5 10 8.5 21H3v-5.5z" {...p}/><line x1="13" y1="6" x2="18" y2="11" {...p}/></>,
    trash: <><path d="M4.5 6.5h15M9 6.5V4.5h6v2M6.5 6.5 7.5 20h9l1-13.5" {...p}/></>,
    msg: <path d="M4 5h16v11H9l-4 3.5V16H4z" {...p}/>,
    pin: <><path d="M12 21s7-6.3 7-11.5a7 7 0 0 0-14 0C5 14.7 12 21 12 21z" {...p}/><circle cx="12" cy="9.5" r="2.6" {...p}/></>,
    globe: <><circle cx="12" cy="12" r="8.5" {...p}/><path d="M3.5 12h17M12 3.5c2.5 2.4 2.5 14.6 0 17M12 3.5c-2.5 2.4-2.5 14.6 0 17" {...p}/></>,
    water: <path d="M12 3.5C8 8 5.5 11 5.5 14.2a6.5 6.5 0 0 0 13 0C18.5 11 16 8 12 3.5z" {...p}/>,
    bolt: <path d="M13 2 4.5 13.5H11l-1 8.5L19 10h-6.5z" {...p} fill={color} fillOpacity="0.15"/>,
    bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2.2H4.5z" {...p}/><path d="M9.5 18.2a2.6 2.6 0 0 0 5 0" {...p}/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>{paths[name]}</svg>;
}

// ── Siren beacon glyph ────────────────────────────────────────
function SirenGlyph({ size = 56, color = '#fff', stroke = 5 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path d="M16 44 V40 a16 16 0 0 1 32 0 V44" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="11" y="44" width="42" height="8" rx="4" stroke={color} strokeWidth={stroke}/>
      <line x1="32" y1="16" x2="32" y2="8" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
      <line x1="50" y1="24" x2="56" y2="19" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
      <line x1="14" y1="24" x2="8" y2="19" stroke={color} strokeWidth={stroke} strokeLinecap="round"/>
    </svg>
  );
}

// ── Tick ring (progress-aware) ────────────────────────────────
function TickRing({ size = 252, count = 72, color = T.red, active = 0, idle = '#2B2F37' }) {
  const cx = size / 2, cy = size / 2, rO = size / 2 - 4, rI = size / 2 - 20;
  const ticks = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2;
    const on = i / count < active;
    ticks.push(<line key={i}
      x1={cx + Math.cos(a) * rI} y1={cy + Math.sin(a) * rI}
      x2={cx + Math.cos(a) * rO} y2={cy + Math.sin(a) * rO}
      stroke={on ? color : idle} strokeWidth="2" strokeLinecap="round"
      style={{ transition: 'stroke 80ms linear' }}/>);
  }
  return <svg width={size} height={size} style={{ position: 'absolute', inset: 0 }}>{ticks}</svg>;
}

// ── Status dot + label ────────────────────────────────────────
function Dot({ color, size = 7 }) {
  return <span style={{ width: size, height: size, borderRadius: '50%', background: color, display: 'inline-block', boxShadow: `0 0 7px ${color}` }} />;
}
function StatusTag({ kind = 'ok', children }) {
  const m = { ok: [T.green, T.greenSoft], warn: [T.amber, T.amberSoft], crit: [T.red, T.redSoft], idle: [T.dim, 'rgba(255,255,255,0.06)'] }[kind];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 9px', borderRadius: 7,
      background: m[1], color: m[0], fontFamily: T.mono, fontSize: 10.5, fontWeight: 600, letterSpacing: 0.5, whiteSpace: 'nowrap' }}>
      <Dot color={m[0]} size={6} />{children}
    </span>
  );
}

// ── Section header (mono kicker) ──────────────────────────────
function Kicker({ children, style }) {
  return <div style={{ fontFamily: T.mono, fontSize: 10.5, letterSpacing: 1.5, color: T.dim2, textTransform: 'uppercase', ...style }}>{children}</div>;
}

// ── Bottom sheet / modal ──────────────────────────────────────
function Sheet({ open, onClose, children, height }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.62)', backdropFilter: 'blur(2px)', animation: 'ogFade .2s ease' }} />
      <div onClick={e => e.stopPropagation()} style={{ position: 'relative', background: T.panel, borderTopLeftRadius: 26, borderTopRightRadius: 26,
        borderTop: `1px solid ${T.line}`, boxShadow: '0 -20px 60px rgba(0,0,0,0.6)', height, maxHeight: '90%', display: 'flex', flexDirection: 'column',
        animation: 'ogSheet .26s cubic-bezier(.2,.8,.2,1)', paddingBottom: 30 }}>
        <div style={{ width: 38, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.18)', margin: '10px auto 4px' }} />
        {children}
      </div>
    </div>
  );
}

// ── Button ────────────────────────────────────────────────────
function Btn({ children, onClick, variant = 'solid', full, style, disabled }) {
  const base = { fontFamily: T.sans, fontSize: 15, fontWeight: 600, padding: '13px 18px', borderRadius: 13, border: 'none',
    cursor: disabled ? 'default' : 'pointer', width: full ? '100%' : undefined, display: 'inline-flex', alignItems: 'center',
    justifyContent: 'center', gap: 8, opacity: disabled ? 0.5 : 1, transition: 'transform .1s, filter .15s', WebkitTapHighlightColor: 'transparent' };
  const variants = {
    solid: { background: T.text, color: '#0C0D10' },
    danger:{ background: T.red, color: '#fff' },
    ghost: { background: T.panel2, color: T.text, border: `1px solid ${T.line}` },
    quiet: { background: 'transparent', color: T.dim },
  };
  return <button onClick={disabled ? undefined : onClick} onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.97)'; }}
    onMouseUp={e => e.currentTarget.style.transform = ''} onMouseLeave={e => e.currentTarget.style.transform = ''}
    style={{ ...base, ...variants[variant], ...style }}>{children}</button>;
}

// avatar initials
function Avatar({ name, color = T.panel2, size = 38 }) {
  const ini = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return <div style={{ width: size, height: size, borderRadius: 10, background: color, border: `1px solid ${T.line}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.mono, fontSize: size * 0.34, fontWeight: 600, color: T.dim, flexShrink: 0 }}>{ini}</div>;
}

function fmtPhone(p) { return p; }

Object.assign(window, { T, HATCH, Icon, SirenGlyph, TickRing, Dot, StatusTag, Kicker, Sheet, Btn, Avatar, fmtPhone });
