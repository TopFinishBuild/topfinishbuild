import { Utensils, Droplets, Sun, Wrench, Layers, Paintbrush } from 'lucide-react';
import { SERVICES } from '../data';

const ICONS = [
  <Utensils  size={22} />,
  <Droplets  size={22} />,
  <Sun       size={22} />,
  <Wrench    size={22} />,
  <Layers    size={22} />,
  <Paintbrush size={22} />,
];

export default function Services() {
  return (
    <section id="services" style={{ padding: '5rem 0', background: '#f8fafc' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-label">Какво Правим</span>
          <h2 className="section-title">Нашите Услуги</h2>
          <div className="divider" />
        </div>

        <div className="grid-3col">
          {SERVICES.map((s, i) => (
            <div key={i} className="service-card">
              <div className="service-icon">
                {ICONS[i]}
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
