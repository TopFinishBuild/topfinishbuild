import { useState } from 'react';
import { projects, FILTERS } from '../data';

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('всички');

  const filtered = projects.filter(p =>
    activeFilter === 'всички' || p.category === activeFilter || p.room === activeFilter
  );

  return (
    <section id="gallery" style={{ padding: '5rem 0', background: '#f8fafc' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="section-label">Портфолио</span>
          <h2 className="section-title">Нашите Проекти</h2>
          <div className="divider" />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`filter-pill${activeFilter === f ? ' active' : ''}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid-3col gallery-grid" style={{ gap: '1.25rem' }}>
          {filtered.map(p => (
            <div key={p.id} className="gallery-item">
              <img src={p.image} alt={p.title} className="gallery-image"/>
              <div className="gallery-overlay">
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.125rem', marginBottom: '0.5rem' }}>{p.title}</h3>
                  <span style={{ background: '#f97316', color: '#fff', padding: '0.3rem 1rem', borderRadius: '999px', fontSize: '0.8125rem', fontFamily: "'Barlow', sans-serif", fontWeight: 600 }}>Виж повече</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
