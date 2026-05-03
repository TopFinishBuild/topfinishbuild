import { useState } from 'react';
import D7BusyCalendar from './D7BusyCalendar';

type FormState = { name: string; email: string; phone: string; message: string };

export default function D7ContactSection() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', message: '' });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Благодарим за запитването! Ще се свържем с Вас скоро.');
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  const fields: { label: string; key: keyof FormState; type: string; ph: string }[] = [
    { label: 'Име и Фамилия *', key: 'name',  type: 'text',  ph: 'Вашето ime' },
    { label: 'Email *',          key: 'email', type: 'email', ph: 'your@email.com' },
    { label: 'Телефон *',        key: 'phone', type: 'tel',   ph: '+359 888 123 456' },
  ];

  return (
    <section id="d7-contact" className="d7-contact">
      <div className="d7-container">

        <div className="d7-contact__header">
          <span className="d7-label">Резервирайте</span>
          <h2 className="d7-section-title">
            Текуща <em>заетост</em>
          </h2>
          <div className="d7-divider" />
          <p style={{ fontFamily: 'var(--d7-fb)', fontSize: 16, color: 'var(--d7-gray)', marginTop: 8 }}>
            Проверете свободните дати и планирайте своя ремонт навреме.
          </p>
        </div>

        <div className="d7-contact__grid">

          {/* Calendar panel */}
          <div className="d7-contact__panel">
            <D7BusyCalendar theme="light" />
          </div>

          {/* Form panel */}
          <div className="d7-contact__panel">
            <div className="d7-contact__form-title">Изпратете запитване</div>
            <p className="d7-contact__form-sub">
              Свържете се с нас за безплатна консултация и оценка на вашия проект.
            </p>

            <form onSubmit={onSubmit} className="d7-contact__form">
              {fields.map((f) => (
                <div key={f.key}>
                  <label>{f.label}</label>
                  <input
                    type={f.type}
                    required
                    placeholder={f.ph}
                    value={form[f.key]}
                    onChange={(e) => setForm((v) => ({ ...v, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
              <div>
                <label>Съобщение *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Разкажете ни за вашия проект..."
                  value={form.message}
                  onChange={(e) => setForm((v) => ({ ...v, message: e.target.value }))}
                />
              </div>
              <button type="submit" className="d7-btn-primary">
                Изпрати Запитване
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
