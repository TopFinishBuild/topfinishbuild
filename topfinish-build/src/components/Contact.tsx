import { Phone, Mail, MapPin } from 'lucide-react';

const INFO = [
  { Icon: Phone,   label: 'Телефон', value: '+359 888 123 456' },
  { Icon: Mail,    label: 'Email',   value: 'info@topfinishbuild.bg' },
  { Icon: MapPin,  label: 'Адрес',   value: 'София 1000, бул. Витоша 15' },
];

export default function Contact() {
  return (
    <section id="contact" style={{ padding: '5rem 0', background: 'linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 100%)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '3rem', right: '3rem', width: '20rem', height: '20rem', background: '#f97316', borderRadius: '50%', filter: 'blur(70px)' }}/>
        <div style={{ position: 'absolute', bottom: '3rem', left: '3rem', width: '20rem', height: '20rem', background: '#3b82f6', borderRadius: '50%', filter: 'blur(70px)' }}/>
      </div>

      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="section-label" style={{ color: '#fed7aa', justifyContent: 'center' }}>Свържете се</span>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2rem,5vw,2.875rem)', fontWeight: 800, color: '#fff', marginTop: '0.5rem' }}>
            Готови сме да започнем
          </h2>
          <p style={{ color: '#bfdbfe', fontSize: '1.0625rem', lineHeight: 1.7, marginTop: '0.875rem' }}>
            Превърнете вашата визия в реалност. Обадете се или напишете ни.
          </p>
        </div>

        <div className="contact-info-grid">
          {INFO.map(({ Icon, label, value }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '1rem', padding: '1.75rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '3rem', height: '3rem', background: 'rgba(249,115,22,0.25)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#f97316' }}>
                <Icon size={22} strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#fed7aa', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{label}</div>
                <div style={{ color: '#e0eaff', fontSize: '1.0625rem', fontWeight: 500 }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
