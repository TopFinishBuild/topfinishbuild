import { testimonials } from '../data';

export default function Testimonials() {
  return (
    <section id="testimonials" style={{ padding: '5rem 0', background: '#fff' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-label">Отзиви</span>
          <h2 className="section-title">Какво казват <em>нашите клиенти</em></h2>
          <p style={{ color: '#6b7280', fontSize: '1.0625rem', marginTop: '0.875rem' }}>Доверието на клиентите ни е нашата най-голяма награда.</p>
        </div>

        <div className="grid-3col">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <span className="quote-bg">"</span>
              <div style={{ display: 'flex', gap: '3px', marginBottom: '1rem' }}>
                {Array.from({length:5}).map((_,si) => (
                  <svg key={si} width="18" height="18" viewBox="0 0 20 20" fill="#f97316">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p style={{ color: '#374151', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.9375rem' }}>{t.text}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '2.75rem', height: '2.75rem', background: 'linear-gradient(135deg,#1d4ed8,#1e3a8a)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.8125rem', fontFamily: "'Barlow Condensed', sans-serif" }}>{t.initials}</span>
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#1e3266', fontSize: '0.9375rem', fontFamily: "'Barlow', sans-serif" }}>{t.name}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>{t.subtitle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
