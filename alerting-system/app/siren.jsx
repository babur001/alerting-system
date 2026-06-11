// siren.jsx — Trevoga screen: hold-to-fire siren, confirm, live SMS sending
const { useState, useRef, useEffect, useCallback } = React;

function timeAgo(ts) {
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 1) return 'hozir';
  if (m < 60) return m + ' daqiqa oldin';
  const h = Math.round(m / 60);
  if (h < 24) return h + ' soat oldin';
  return Math.round(h / 24) + ' kun oldin';
}

// ── Fire button (single tap → confirm step) ───────────────────
function HoldButton({ onArmed, recipients, disabled, testMode }) {
  const [press, setPress] = useState(false);
  const fire = () => {
    if (disabled) return;
    if (navigator.vibrate) navigator.vibrate(12);
    onArmed();
  };
  const accent = testMode ? T.amber : T.red;
  const g1 = testMode ? '#ffc24d' : '#ff7a68', g2 = accent, g3 = testMode ? '#b9760a' : '#c41d10';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 256, height: 256, display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: disabled ? 0.4 : 1 }}>
        {/* idle pulse ring */}
        {!disabled && <span style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', border: `2px solid ${accent}`,
          opacity: 0.5, animation: 'ogRing 2.2s ease-out infinite' }} />}
        <TickRing size={256} count={72} color={accent} active={0} />
        <button
          onClick={fire}
          onPointerDown={() => !disabled && setPress(true)}
          onPointerUp={() => setPress(false)} onPointerLeave={() => setPress(false)} onPointerCancel={() => setPress(false)}
          style={{
            width: 178, height: 178, borderRadius: '50%', userSelect: 'none', touchAction: 'manipulation', border: 'none', padding: 0,
            cursor: disabled ? 'default' : 'pointer',
            background: `radial-gradient(circle at 40% 32%, ${g1}, ${g2} 60%, ${g3})`,
            boxShadow: `0 0 ${press ? 60 : 30}px ${accent}${press ? 'cc' : '88'}, 0 0 0 1px ${g1}, inset 0 6px 22px rgba(255,255,255,0.4), inset 0 -12px 30px rgba(120,8,0,0.55)`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 7,
            transform: press ? 'scale(0.955)' : 'scale(1)', transition: 'transform .12s, box-shadow .15s',
          }}>
          <SirenGlyph size={56} color="#fff" stroke={5} />
          <div style={{ fontFamily: T.mono, fontSize: 16, fontWeight: 700, letterSpacing: 3, color: '#fff', lineHeight: 1 }}>{testMode ? 'SINOV' : 'TREVOGA'}</div>
          <div style={{ fontFamily: T.mono, fontSize: 9.5, fontWeight: 500, letterSpacing: 1.5, color: '#ffffffd0' }}>BOSING</div>
        </button>
      </div>
      <div style={{ marginTop: 16, fontFamily: T.mono, fontSize: 10.5, letterSpacing: 1.4, color: T.dim2, textAlign: 'center' }}>
        BOSIB OGOHLANTIRISHNI YUBORING · DARAJA: {testMode ? 'SINOV' : 'QIZIL'}
      </div>
    </div>
  );
}

// ── Sending overlay (streams per-person status) ───────────────
function SendingOverlay({ open, recipients, message, onDone }) {
  const [statuses, setStatuses] = useState({});
  const [phase, setPhase] = useState('send'); // send | done
  const listRef = useRef(null);

  useEffect(() => {
    if (!open) { setStatuses({}); setPhase('send'); return; }
    let cancelled = false;
    const results = {};
    recipients.forEach((r, i) => {
      setTimeout(() => { if (!cancelled) setStatuses(s => ({ ...s, [r.id]: 'sent' })); }, 120 + i * 95);
      setTimeout(() => {
        if (cancelled) return;
        const failed = Math.random() < 0.07;
        results[r.id] = failed ? 'failed' : 'delivered';
        setStatuses(s => ({ ...s, [r.id]: failed ? 'failed' : 'delivered' }));
      }, 520 + i * 95);
    });
    const totalMs = 700 + recipients.length * 95;
    const t = setTimeout(() => {
      if (cancelled) return;
      const final = recipients.map(r => ({ ...r, status: results[r.id] || 'delivered' }));
      setPhase('done');
      window.__lastSendResult = final;
    }, totalMs);
    return () => { cancelled = true; clearTimeout(t); };
  }, [open, recipients]);

  if (!open) return null;
  const sentCount = Object.keys(statuses).length;
  const delivered = Object.values(statuses).filter(s => s === 'delivered').length;
  const failed = Object.values(statuses).filter(s => s === 'failed').length;

  const sIcon = (st) => {
    if (st === 'delivered') return <span style={{ color: T.green, display: 'flex' }}><Icon name="check" size={16} color={T.green} sw={2.4} /></span>;
    if (st === 'failed') return <span style={{ color: T.red, display: 'flex' }}><Icon name="x" size={15} color={T.red} sw={2.4} /></span>;
    if (st === 'sent') return <span style={{ fontFamily: T.mono, fontSize: 9.5, color: T.amber, letterSpacing: 0.5 }}>SMS…</span>;
    return <span style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${T.line}` }} />;
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 300, background: T.bg, display: 'flex', flexDirection: 'column',
      paddingTop: 58, animation: 'ogFade .2s ease' }}>
      <div style={{ padding: '8px 20px 14px', textAlign: 'center' }}>
        {phase === 'send' ? (
          <>
            <div style={{ display: 'inline-flex', marginBottom: 8 }}>
              <span style={{ width: 46, height: 46, borderRadius: '50%', background: T.redSoft, display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'ogPulse 1s ease-in-out infinite' }}><Icon name="siren" size={24} color={T.red} /></span>
            </div>
            <div style={{ fontFamily: T.sans, fontSize: 19, fontWeight: 700, color: T.text }}>Ogohlantirish yuborilmoqda</div>
            <div style={{ fontFamily: T.mono, fontSize: 12, color: T.dim, marginTop: 4 }}>{sentCount} / {recipients.length} abonent</div>
          </>
        ) : (
          <>
            <div style={{ display: 'inline-flex', marginBottom: 8 }}>
              <span style={{ width: 46, height: 46, borderRadius: '50%', background: T.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="check" size={26} color={T.green} sw={2.6} /></span>
            </div>
            <div style={{ fontFamily: T.sans, fontSize: 19, fontWeight: 700, color: T.text }}>Ogohlantirish yuborildi</div>
            <div style={{ fontFamily: T.mono, fontSize: 12, color: T.dim, marginTop: 4 }}>
              <span style={{ color: T.green }}>{delivered} yetkazildi</span> · {failed > 0 ? <span style={{ color: T.red }}>{failed} xato</span> : '0 xato'}
            </div>
          </>
        )}
      </div>
      <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '4px 14px' }}>
        {recipients.map(r => {
          const st = statuses[r.id];
          return (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 10px', borderBottom: `1px solid ${T.line2}`, opacity: st ? 1 : 0.4, transition: 'opacity .2s' }}>
              <Avatar name={r.name} size={32} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: T.sans, fontSize: 13.5, color: T.text, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                <div style={{ fontFamily: T.mono, fontSize: 10.5, color: T.dim2 }}>{r.phone}</div>
              </div>
              <div style={{ minWidth: 40, display: 'flex', justifyContent: 'flex-end' }}>{sIcon(st)}</div>
            </div>
          );
        })}
      </div>
      {phase === 'done' && (
        <div style={{ padding: '12px 18px 26px', borderTop: `1px solid ${T.line}` }}>
          <Btn full variant="solid" onClick={() => onDone(window.__lastSendResult)}>Tayyor</Btn>
        </div>
      )}
    </div>
  );
}

// ── Siren screen ──────────────────────────────────────────────
function SirenScreen({ obj, objects, people, message, onSwitchObj, onSend, lastAlert }) {
  const [confirm, setConfirm] = useState(false);
  const [sending, setSending] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [pickObj, setPickObj] = useState(false);

  const recipients = people.filter(p => p.objectId === obj.id && p.active);
  const inactive = people.filter(p => p.objectId === obj.id && !p.active).length;

  const objStatus = { ok: 'ok', warn: 'warn', crit: 'crit' }[obj.status] || 'ok';
  const objLabel = { ok: 'BARQAROR', warn: 'KUZATUVDA', crit: 'XAVF' }[obj.status];

  const fire = () => {
    setConfirm(false);
    setSending(true);
  };
  const finishSend = (results) => {
    setSending(false);
    onSend({
      id: 'a' + Date.now(), objectId: obj.id, objectName: obj.name, ts: Date.now(),
      level: testMode ? 'Sinov' : 'Qizil', kind: testMode ? 'warn' : 'crit', test: testMode,
      total: results.length, delivered: results.filter(r => r.status === 'delivered').length,
      failed: results.filter(r => r.status === 'failed').length, msg: testMode ? 'SINOV: ' + message : message,
      operator: 'A. Karimov', recipients: results,
    });
    setTestMode(false);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* header */}
      <div style={{ padding: '8px 18px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${T.line2}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <SirenGlyph size={20} color={T.red} stroke={5} />
          <span style={{ fontFamily: T.mono, fontSize: 15, fontWeight: 700, letterSpacing: 3, color: T.text }}>OGOH</span>
        </div>
        <StatusTag kind="ok">TIZIM ONLAYN</StatusTag>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* object selector */}
        <button onClick={() => setPickObj(true)} style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
          padding: '14px 18px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
          <div>
            <Kicker>OBYEKT · {obj.region}</Kicker>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 3 }}>
              <span style={{ fontFamily: T.sans, fontSize: 20, fontWeight: 700, color: T.text }}>{obj.name}</span>
              <span style={{ color: T.dim2, display: 'flex', transform: 'translateY(1px)' }}><Icon name="chevDown" size={17} color={T.dim2} /></span>
            </div>
          </div>
          <div style={{ paddingTop: 16 }}><StatusTag kind={objStatus}>{objLabel}</StatusTag></div>
        </button>

        {/* telemetry */}
        <div style={{ display: 'flex', gap: 18, padding: '10px 18px 6px', fontFamily: T.mono, fontSize: 11.5, color: T.dim }}>
          <span>SATH <b style={{ color: T.text }}>{obj.level}%</b></span>
          <span>BOSIM <b style={{ color: obj.status === 'warn' ? T.amber : T.text }}>{obj.status === 'warn' ? 'YUQORI' : 'NORMA'}</b></span>
          <span>HUDUD <b style={{ color: T.text }}>{ZONES.length}</b></span>
        </div>

        {/* siren */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '14px 18px' }}>
          <HoldButton onArmed={() => setConfirm(true)} recipients={recipients} disabled={recipients.length === 0} testMode={testMode} />
          <button onClick={() => setTestMode(t => !t)} style={{ marginTop: 18, background: testMode ? T.amberSoft : 'transparent',
            border: `1px solid ${testMode ? T.amber : T.line}`, color: testMode ? T.amber : T.dim, padding: '7px 14px', borderRadius: 20,
            fontFamily: T.mono, fontSize: 10.5, letterSpacing: 0.8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
            <Dot color={testMode ? T.amber : T.dim2} size={6} /> {testMode ? 'SINOV REJIMI YOQILGAN' : 'SINOV REJIMI'}
          </button>
        </div>

        {/* recipients readout */}
        <div style={{ margin: '0 14px 12px', padding: 14, background: T.panel, borderRadius: 14, border: `1px solid ${T.line2}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: T.mono, fontSize: 28, fontWeight: 700, color: T.text, lineHeight: 1 }}>{recipients.length}</span>
              <span style={{ fontFamily: T.sans, fontSize: 12.5, color: T.dim }}>faol abonent ogohlantiriladi</span>
            </div>
            {inactive > 0 && <div style={{ fontFamily: T.mono, fontSize: 10.5, color: T.dim2, marginTop: 5 }}>{inactive} nofaol — chiqarib tashlandi</div>}
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: 5 }).map((_, i) => <div key={i} style={{ width: 6, height: 22, borderRadius: 2, background: i < Math.ceil(recipients.length / 5) ? T.green : '#3a3f48' }} />)}
          </div>
        </div>

        {lastAlert && (
          <div style={{ margin: '0 18px 16px', fontFamily: T.mono, fontSize: 10.5, color: T.dim2, display: 'flex', alignItems: 'center', gap: 7 }}>
            <Icon name="history" size={13} color={T.dim2} /> Oxirgi: {lastAlert.objectName.split(' ')[0]} · {timeAgo(lastAlert.ts)} · {lastAlert.delivered}/{lastAlert.total}
          </div>
        )}
      </div>

      {/* confirm sheet */}
      <Sheet open={confirm} onClose={() => setConfirm(false)}>
        <div style={{ padding: '6px 22px 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 14 }}>
            <span style={{ width: 44, height: 44, borderRadius: 12, background: testMode ? T.amberSoft : T.redSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="siren" size={24} color={testMode ? T.amber : T.red} /></span>
            <div>
              <div style={{ fontFamily: T.sans, fontSize: 18, fontWeight: 700, color: T.text }}>{testMode ? 'Sinov xabari yuborilsinmi?' : 'Ogohlantirish yuborilsinmi?'}</div>
              <div style={{ fontFamily: T.mono, fontSize: 11, color: T.dim2, marginTop: 1 }}>DARAJA: {testMode ? 'SINOV' : 'QIZIL'} · {obj.name.split(' ')[0]}</div>
            </div>
          </div>
          <div style={{ background: T.bg2, border: `1px solid ${T.line2}`, borderRadius: 12, padding: 13, marginBottom: 12 }}>
            <Kicker style={{ marginBottom: 6 }}>SMS MATNI</Kicker>
            <div style={{ fontFamily: T.sans, fontSize: 13, color: T.text, lineHeight: 1.5 }}>{testMode ? 'SINOV: ' + message : message}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: '0 2px' }}>
            <span style={{ fontFamily: T.sans, fontSize: 13.5, color: T.dim }}>Qabul qiluvchilar</span>
            <span style={{ fontFamily: T.mono, fontSize: 15, fontWeight: 700, color: T.text }}>{recipients.length} abonent</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn variant="ghost" style={{ flex: 1 }} onClick={() => setConfirm(false)}>Bekor qilish</Btn>
            <Btn variant={testMode ? 'solid' : 'danger'} style={{ flex: 1.4 }} onClick={fire}>
              <Icon name="siren" size={18} color={testMode ? '#0C0D10' : '#fff'} /> YUBORISH
            </Btn>
          </div>
        </div>
      </Sheet>

      {/* object picker */}
      <Sheet open={pickObj} onClose={() => setPickObj(false)}>
        <div style={{ padding: '6px 18px 4px' }}>
          <div style={{ fontFamily: T.sans, fontSize: 17, fontWeight: 700, color: T.text, marginBottom: 4, padding: '0 4px' }}>Obyektni tanlang</div>
          {objects.map(o => {
            const cnt = people.filter(p => p.objectId === o.id && p.active).length;
            const sel = o.id === obj.id;
            return (
              <button key={o.id} onClick={() => { onSwitchObj(o.id); setPickObj(false); }} style={{ width: '100%', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 12, padding: '13px 12px', borderRadius: 12, marginTop: 6, cursor: 'pointer',
                background: sel ? T.panel2 : 'transparent', border: `1px solid ${sel ? T.line : 'transparent'}` }}>
                <span style={{ width: 36, height: 36, borderRadius: 9, background: T.bg2, border: `1px solid ${T.line2}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="water" size={19} color={o.status === 'warn' ? T.amber : T.dim} /></span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: T.sans, fontSize: 14.5, fontWeight: 600, color: T.text }}>{o.name}</div>
                  <div style={{ fontFamily: T.mono, fontSize: 10.5, color: T.dim2 }}>{o.region} · {cnt} abonent</div>
                </div>
                {sel && <Icon name="check" size={18} color={T.green} sw={2.4} />}
              </button>
            );
          })}
        </div>
      </Sheet>

      <SendingOverlay open={sending} recipients={recipients} message={message} onDone={finishSend} />
    </div>
  );
}

Object.assign(window, { SirenScreen, timeAgo });
