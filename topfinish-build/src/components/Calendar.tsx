import { useState } from 'react';
import { busyDates, MONTH_NAMES, DAY_NAMES } from '../data';

function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstWeekday(y: number, m: number) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }

type FormState = { name: string; email: string; phone: string; message: string };

export default function Calendar() {
  const [calDate, setCalDate] = useState({ year: 2025, month: 4 });
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', message: '' });

  const { year, month } = calDate;
  const totalDays = daysInMonth(year, month);
  const startDay  = firstWeekday(year, month);
  const dateKey   = (d: number) => `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

  const shiftMonth = (dir: 1 | -1) => setCalDate(({ year: y, month: m }) => {
    const nm = m + dir;
    if (nm < 0)  return { year: y - 1, month: 11 };
    if (nm > 11) return { year: y + 1, month: 0  };
    return { year: y, month: nm };
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Благодарим за запитването! Ще се свържем с Вас скоро.');
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  const fields = [
    { label: 'Име и Фамилия *', key: 'name'  as const, type: 'text',  ph: 'Вашето ime' },
    { label: 'Email *',          key: 'email' as const, type: 'email', ph: 'your@email.com' },
    { label: 'Телефон *',        key: 'phone' as const, type: 'tel',   ph: '+359 888 123 456' },
  ];

  return (
    <section id="calendar" style={{ padding: '5rem 0', background: '#f8fafc' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-label">График</span>
          <h2 className="section-title">Текуща <em>заетост</em></h2>
          <p style={{ color: '#6b7280', fontSize: '1.0625rem', marginTop: '0.875rem' }}>Проверете свободните дати и планирайте своя ремонт навреме.</p>
        </div>

        <div className="calendar-contact-grid">

          {/* Calendar */}
          <div style={{ background: '#fff', borderRadius: '1.25rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2rem', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <button className="cal-nav-btn" onClick={() => shiftMonth(-1)}>‹</button>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: '#1e3266' }}>{MONTH_NAMES[month]} {year}</span>
              <button className="cal-nav-btn" onClick={() => shiftMonth(1)}>›</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: '0.5rem' }}>
              {DAY_NAMES.map(d => <div key={d} className="cal-day-header">{d}</div>)}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px', flex: 1 }}>
              {Array.from({length: startDay}).map((_,i) => <div key={`e${i}`}/>)}
              {Array.from({length: totalDays}).map((_,i) => {
                const day = i + 1;
                const busy = busyDates.has(dateKey(day));
                return (
                  <div key={day} className={`cal-cell${busy ? ' busy' : ''}`}>
                    <span className="day-num">{day}</span>
                    <span className="cal-dot"/>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#6b7280' }}>
                <span style={{ width: '0.75rem', height: '0.75rem', borderRadius: '3px', background: '#fed7aa', border: '1.5px solid #f97316', display: 'inline-block' }}/>
                Зает ден
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#6b7280' }}>
                <span style={{ width: '0.75rem', height: '0.75rem', borderRadius: '3px', background: '#f3f4f6', border: '1.5px solid #d1d5db', display: 'inline-block' }}/>
                Свободен ден
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div style={{ background: '#fff', borderRadius: '1.25rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2rem', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.625rem', fontWeight: 800, color: '#1e3266', marginBottom: '0.5rem' }}>
              Изпратете запитване
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
              Свържете се с нас за безплатна консултация и оценка на вашия проект.
            </p>
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {fields.map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: '0.375rem' }}>{f.label}</label>
                  <input
                    type={f.type} required
                    value={form[f.key]}
                    onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                    placeholder={f.ph}
                    className="form-input"
                  />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontFamily: "'Barlow', sans-serif", fontWeight: 600, fontSize: '0.875rem', color: '#374151', marginBottom: '0.375rem' }}>Съобщение *</label>
                <textarea
                  required rows={4}
                  value={form.message}
                  onChange={e => setForm(v => ({ ...v, message: e.target.value }))}
                  placeholder="Разкажете ни за вашия проект..."
                  className="form-input"
                  style={{ resize: 'none' }}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: 'auto' }}>
                Изпрати Запитване
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
