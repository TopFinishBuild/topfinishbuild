import { useState } from 'react';
import BusyCalendar from '../sections/BusyCalendar';

type Form = { name: string; email: string; phone: string; message: string };

const FH = "'Manrope',sans-serif";
const FB = "'Manrope',sans-serif";
const ORANGE = '#f07420';
const NAVY   = '#0f1f3d';
const WHITE  = '#ffffff';

export default function TeamSchedule() {
  const [form, setForm] = useState<Form>({ name:'', email:'', phone:'', message:'' });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Благодарим за запитването! Ще се свържем с Вас скоро.');
    setForm({ name:'', email:'', phone:'', message:'' });
  };

  const fields: { label: string; key: keyof Form; type: string; ph: string }[] = [
    { label:'Име и Фамилия *', key:'name',  type:'text',  ph:'Вашето ime' },
    { label:'Email *',          key:'email', type:'email', ph:'your@email.com' },
    { label:'Телефон *',        key:'phone', type:'tel',   ph:'+359 888 123 456' },
  ];

  const panel: React.CSSProperties = {
    background: WHITE,
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    background: '#f8fafc',
    border: '1.5px solid #e5e7eb',
    borderRadius: 8,
    fontFamily: FB,
    fontSize: 15,
    color: '#111827',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <section id="calendar" style={{ padding:'100px 0', background: NAVY }}>
      <div className="team-schedule__inner">

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <span className="section-label">График</span>
          <h2 className="section-title" style={{ color: WHITE }}>
            Заетост на екипа
          </h2>
          <div className="divider" />
          <p style={{ fontFamily:FB, fontSize:18, color:'rgba(255,255,255,0.75)' }}>
            Проверете свободните дати и резервирайте своя слот навреме.
          </p>
        </div>

        {/* Two equal panels — responsive via CSS class */}
        <div className="team-schedule__panels">

          {/* Calendar panel — light */}
          <div style={panel}>
            <BusyCalendar theme="light" fillHeight />
          </div>

          {/* Form panel — light */}
          <div style={panel}>
            <div style={{ fontFamily:FH, fontSize:22, fontWeight:700, color:'#0f1f3d', marginBottom:8 }}>Изпратете запитване</div>
            <p style={{ fontFamily:FB, fontSize:17, color:'#6b7280', marginBottom:24 }}>
              Свържете се с нас за безплатна консултация и оценка на вашия проект.
            </p>
            <form onSubmit={onSubmit} style={{ display:'flex', flexDirection:'column', gap:14, flex:1 }}>
              {fields.map(f => (
                <div key={f.key}>
                  <label style={{ display:'block', fontFamily:FB, fontSize:13, fontWeight:600, color:'#374151', marginBottom:6 }}>{f.label}</label>
                  <input
                    type={f.type} required
                    placeholder={f.ph}
                    value={form[f.key]}
                    onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              ))}
              <div>
                <label style={{ display:'block', fontFamily:FB, fontSize:13, fontWeight:600, color:'#374151', marginBottom:6 }}>Съобщение *</label>
                <textarea
                  required rows={5}
                  placeholder="Разкажете ни за вашия проект..."
                  value={form.message}
                  onChange={e => setForm(v => ({ ...v, message: e.target.value }))}
                  style={{ ...inputStyle, resize:'none' }}
                />
              </div>
              <button type="submit" style={{
                marginTop:'auto',
                background: ORANGE,
                color: WHITE,
                fontFamily: FH,
                fontSize: 15, fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '15px 32px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                whiteSpace: 'nowrap',
              }}>
                Изпрати Запитване
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
