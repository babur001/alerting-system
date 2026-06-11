// people.jsx — Aholi: directory by zone, search, active toggle, add/edit
const { useState: useStateP } = React;

function Toggle({ on, onChange }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onChange(!on); }} style={{ width: 44, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
      background: on ? T.green : '#3a3f48', position: 'relative', transition: 'background .2s', flexShrink: 0, padding: 0 }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left .18s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
    </button>
  );
}

function Field({ label, value, onChange, placeholder, mono, type = 'text' }) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      <Kicker style={{ marginBottom: 6 }}>{label}</Kicker>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type} inputMode={mono ? 'tel' : undefined}
        style={{ width: '100%', boxSizing: 'border-box', background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 11, padding: '12px 13px',
          color: T.text, fontFamily: mono ? T.mono : T.sans, fontSize: 15, outline: 'none' }}
        onFocus={e => e.target.style.borderColor = T.dim} onBlur={e => e.target.style.borderColor = T.line} />
    </label>
  );
}

function PersonForm({ initial, objName, onSave, onDelete, onClose }) {
  const [name, setName] = useStateP(initial?.name || '');
  const [phone, setPhone] = useStateP(initial?.phone || '+998 ');
  const [zone, setZone] = useStateP(initial?.zone || 'river');
  const [active, setActive] = useStateP(initial?.active ?? true);
  const editing = !!initial;
  const valid = name.trim().length > 1 && phone.replace(/\D/g, '').length >= 9;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 18px 12px' }}>
        <div style={{ fontFamily: T.sans, fontSize: 18, fontWeight: 700, color: T.text }}>{editing ? 'Abonentni tahrirlash' : 'Abonent qoʻshish'}</div>
        <button onClick={onClose} style={{ background: T.panel2, border: 'none', borderRadius: 9, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="x" size={17} color={T.dim} /></button>
      </div>
      <div style={{ overflowY: 'auto', padding: '0 18px' }}>
        <Field label="Ism familiya" value={name} onChange={setName} placeholder="Akmal Karimov" />
        <Field label="Telefon raqami" value={phone} onChange={setPhone} placeholder="+998 90 123 45 67" mono type="tel" />
        <Kicker style={{ marginBottom: 7 }}>HUDUD / TOIFA</Kicker>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 16 }}>
          {ZONES.map(z => (
            <button key={z.id} onClick={() => setZone(z.id)} style={{ padding: '8px 12px', borderRadius: 9, cursor: 'pointer',
              border: `1px solid ${zone === z.id ? T.text : T.line}`, background: zone === z.id ? T.text : 'transparent',
              color: zone === z.id ? '#0C0D10' : T.dim, fontFamily: T.sans, fontSize: 12.5, fontWeight: 600 }}>{z.name}</button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 14px', background: T.bg2, borderRadius: 12, border: `1px solid ${T.line2}`, marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: T.sans, fontSize: 14.5, fontWeight: 600, color: T.text }}>Faol holat</div>
            <div style={{ fontFamily: T.mono, fontSize: 10.5, color: T.dim2, marginTop: 2 }}>{active ? 'Ogohlantirish oladi' : 'Ogohlantirishdan chiqarilgan'}</div>
          </div>
          <Toggle on={active} onChange={setActive} />
        </div>
        <div style={{ fontFamily: T.mono, fontSize: 10.5, color: T.dim2, marginBottom: 14 }}>OBYEKT: {objName}</div>
      </div>
      <div style={{ padding: '12px 18px 4px', borderTop: `1px solid ${T.line}`, display: 'flex', gap: 10 }}>
        {editing && <Btn variant="ghost" onClick={onDelete} style={{ color: T.red, borderColor: 'rgba(255,70,50,0.3)', flex: '0 0 auto', padding: '13px 15px' }}><Icon name="trash" size={18} color={T.red} /></Btn>}
        <Btn variant="solid" full disabled={!valid} onClick={() => onSave({ name: name.trim(), phone: phone.trim(), zone, active })}>{editing ? 'Saqlash' : 'Qoʻshish'}</Btn>
      </div>
    </div>
  );
}

function PeopleScreen({ obj, people, onAdd, onUpdate, onDelete, onToggle }) {
  const [q, setQ] = useStateP('');
  const [filter, setFilter] = useStateP('all');
  const [form, setForm] = useStateP(null); // {mode:'add'} | {mode:'edit', person}

  const mine = people.filter(p => p.objectId === obj.id);
  const filtered = mine.filter(p => {
    if (filter === 'active' && !p.active) return false;
    if (filter !== 'all' && filter !== 'active' && p.zone !== filter) return false;
    if (q && !(p.name.toLowerCase().includes(q.toLowerCase()) || p.phone.includes(q))) return false;
    return true;
  });
  const grouped = ZONES.map(z => ({ zone: z, items: filtered.filter(p => p.zone === z.id) })).filter(g => g.items.length);
  const activeCount = mine.filter(p => p.active).length;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 18px 10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontFamily: T.sans, fontSize: 26, fontWeight: 700, color: T.text, letterSpacing: 0.2 }}>Aholi</div>
            <div style={{ fontFamily: T.mono, fontSize: 11, color: T.dim2, marginTop: 1 }}>{obj.name.split(' ')[0]} · {activeCount}/{mine.length} faol</div>
          </div>
          <button onClick={() => setForm({ mode: 'add' })} style={{ width: 40, height: 40, borderRadius: 11, background: T.text, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="plus" size={22} color="#0C0D10" sw={2.4} /></button>
        </div>
      </div>

      {/* search */}
      <div style={{ padding: '0 18px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: T.bg2, border: `1px solid ${T.line2}`, borderRadius: 11, padding: '9px 12px' }}>
          <Icon name="search" size={17} color={T.dim2} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Ism yoki raqam boʻyicha qidirish"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: T.text, fontFamily: T.sans, fontSize: 14 }} />
          {q && <button onClick={() => setQ('')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><Icon name="x" size={15} color={T.dim2} /></button>}
        </div>
      </div>

      {/* filter chips */}
      <div style={{ display: 'flex', gap: 7, padding: '0 18px 8px', overflowX: 'auto' }}>
        {[['all', 'Barchasi'], ['active', 'Faol']].concat(ZONES.map(z => [z.id, z.short])).map(([id, lbl]) => (
          <button key={id} onClick={() => setFilter(id)} style={{ whiteSpace: 'nowrap', padding: '7px 13px', borderRadius: 18, cursor: 'pointer',
            border: `1px solid ${filter === id ? T.text : T.line}`, background: filter === id ? T.text : 'transparent',
            color: filter === id ? '#0C0D10' : T.dim, fontFamily: T.sans, fontSize: 12.5, fontWeight: 600, flexShrink: 0 }}>{lbl}</button>
        ))}
      </div>

      {/* list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 14px 12px' }}>
        {grouped.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: T.dim2, fontFamily: T.sans, fontSize: 14 }}>Hech narsa topilmadi</div>
        )}
        {grouped.map(({ zone, items }) => (
          <div key={zone.id} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 8px 7px' }}>
              <Dot color={zone.risk === 'crit' ? T.red : zone.risk === 'warn' ? T.amber : T.green} size={7} />
              <Kicker>{zone.name}</Kicker>
              <span style={{ fontFamily: T.mono, fontSize: 10.5, color: T.dim2 }}>· {items.length}</span>
            </div>
            <div style={{ background: T.panel, borderRadius: 14, border: `1px solid ${T.line2}`, overflow: 'hidden' }}>
              {items.map((p, i) => (
                <div key={p.id} onClick={() => setForm({ mode: 'edit', person: p })} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px',
                  borderBottom: i < items.length - 1 ? `1px solid ${T.line2}` : 'none', cursor: 'pointer', opacity: p.active ? 1 : 0.5 }}>
                  <Avatar name={p.name} size={38} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: T.sans, fontSize: 14.5, fontWeight: 600, color: T.text }}>{p.name}</div>
                    <div style={{ fontFamily: T.mono, fontSize: 11, color: T.dim2 }}>{p.phone}</div>
                  </div>
                  <Toggle on={p.active} onChange={(v) => onToggle(p.id, v)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Sheet open={!!form} onClose={() => setForm(null)} height="86%">
        {form && <PersonForm initial={form.mode === 'edit' ? form.person : null} objName={obj.name}
          onSave={(data) => { form.mode === 'edit' ? onUpdate(form.person.id, data) : onAdd({ ...data, objectId: obj.id }); setForm(null); }}
          onDelete={() => { onDelete(form.person.id); setForm(null); }}
          onClose={() => setForm(null)} />}
      </Sheet>
    </div>
  );
}

Object.assign(window, { PeopleScreen, Toggle });
