// history.jsx — Tarix: alert log + per-person delivery status detail
const { useState: useStateH } = React;

function fmtDateTime(ts) {
  const d = new Date(ts);
  const months = ['yan','fev','mar','apr','may','iyn','iyl','avg','sen','okt','noy','dek'];
  const p = n => String(n).padStart(2, '0');
  return `${d.getDate()} ${months[d.getMonth()]}, ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function AlertDetail({ alert, onClose }) {
  const recips = alert.recipients;
  const sIcon = (st) => {
    if (st === 'delivered') return <StatusTag kind="ok">Yetkazildi</StatusTag>;
    if (st === 'failed') return <StatusTag kind="crit">Xato</StatusTag>;
    return <StatusTag kind="warn">Yuborildi</StatusTag>;
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '4px 18px 12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StatusTag kind={alert.kind}>{alert.test ? 'SINOV' : 'DARAJA: ' + alert.level.toUpperCase()}</StatusTag>
          </div>
          <div style={{ fontFamily: T.sans, fontSize: 18, fontWeight: 700, color: T.text, marginTop: 8 }}>{alert.objectName}</div>
          <div style={{ fontFamily: T.mono, fontSize: 11, color: T.dim2, marginTop: 2 }}>{fmtDateTime(alert.ts)} · operator {alert.operator}</div>
        </div>
        <button onClick={onClose} style={{ background: T.panel2, border: 'none', borderRadius: 9, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="x" size={17} color={T.dim} /></button>
      </div>

      <div style={{ overflowY: 'auto', padding: '0 18px 4px' }}>
        {/* summary stats */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {[[alert.total, 'YUBORILDI', T.text], [alert.delivered, 'YETKAZILDI', T.green], [alert.failed, 'XATO', alert.failed ? T.red : T.dim]].map(([n, l, c], i) => (
            <div key={i} style={{ flex: 1, background: T.bg2, border: `1px solid ${T.line2}`, borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
              <div style={{ fontFamily: T.mono, fontSize: 22, fontWeight: 700, color: c }}>{n}</div>
              <div style={{ fontFamily: T.mono, fontSize: 8.5, letterSpacing: 0.8, color: T.dim2, marginTop: 3 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ background: T.bg2, border: `1px solid ${T.line2}`, borderRadius: 12, padding: 13, marginBottom: 14 }}>
          <Kicker style={{ marginBottom: 6 }}>YUBORILGAN MATN</Kicker>
          <div style={{ fontFamily: T.sans, fontSize: 13, color: T.text, lineHeight: 1.5 }}>{alert.msg}</div>
        </div>

        {recips ? (
          <>
            <Kicker style={{ marginBottom: 8, padding: '0 2px' }}>QABUL QILUVCHILAR · {recips.length}</Kicker>
            <div style={{ background: T.panel, borderRadius: 14, border: `1px solid ${T.line2}`, overflow: 'hidden', marginBottom: 8 }}>
              {recips.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 13px', borderBottom: i < recips.length - 1 ? `1px solid ${T.line2}` : 'none' }}>
                  <Avatar name={r.name} size={34} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: T.sans, fontSize: 13.5, fontWeight: 500, color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                    <div style={{ fontFamily: T.mono, fontSize: 10.5, color: T.dim2 }}>{r.phone}</div>
                  </div>
                  {sIcon(r.status)}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px', fontFamily: T.mono, fontSize: 11, color: T.dim2 }}>
            Qabul qiluvchilar tafsiloti arxivlangan
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryScreen({ alerts }) {
  const [open, setOpen] = useStateH(null);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 18px 8px' }}>
        <div style={{ fontFamily: T.sans, fontSize: 26, fontWeight: 700, color: T.text }}>Tarix</div>
        <div style={{ fontFamily: T.mono, fontSize: 11, color: T.dim2, marginTop: 1 }}>{alerts.length} ta ogohlantirish qaydi</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 14px 12px' }}>
        {alerts.length === 0 && <div style={{ textAlign: 'center', padding: '50px 20px', color: T.dim2, fontFamily: T.sans, fontSize: 14 }}>Hali ogohlantirishlar yoʻq</div>}
        {alerts.map(a => (
          <button key={a.id} onClick={() => a.recipients !== undefined && setOpen(a)} style={{ width: '100%', textAlign: 'left', display: 'block',
            background: T.panel, border: `1px solid ${T.line2}`, borderRadius: 14, padding: 14, marginBottom: 10, cursor: a.recipients ? 'pointer' : 'default' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 38, height: 38, borderRadius: 10, background: a.kind === 'crit' ? T.redSoft : T.amberSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="siren" size={20} color={a.kind === 'crit' ? T.red : T.amber} /></span>
                <div>
                  <div style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 600, color: T.text }}>{a.objectName.split(' suv')[0]}</div>
                  <div style={{ fontFamily: T.mono, fontSize: 10.5, color: T.dim2, marginTop: 1 }}>{fmtDateTime(a.ts)}</div>
                </div>
              </div>
              <StatusTag kind={a.kind}>{a.test ? 'SINOV' : a.level.toUpperCase()}</StatusTag>
            </div>
            <div style={{ display: 'flex', gap: 16, fontFamily: T.mono, fontSize: 11, color: T.dim, paddingTop: 10, borderTop: `1px solid ${T.line2}` }}>
              <span>{a.total} yuborildi</span>
              <span style={{ color: T.green }}>{a.delivered} yetkazildi</span>
              {a.failed > 0 && <span style={{ color: T.red }}>{a.failed} xato</span>}
              {a.recipients && <span style={{ marginLeft: 'auto', color: T.dim2, display: 'flex', alignItems: 'center', gap: 3 }}>Tafsilot <Icon name="chev" size={13} color={T.dim2} /></span>}
            </div>
          </button>
        ))}
      </div>
      <Sheet open={!!open} onClose={() => setOpen(null)} height="88%">
        {open && <AlertDetail alert={open} onClose={() => setOpen(null)} />}
      </Sheet>
    </div>
  );
}

Object.assign(window, { HistoryScreen, fmtDateTime });
