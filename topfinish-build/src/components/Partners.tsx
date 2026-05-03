import { partners } from '../data';

export default function Partners() {
  return (
    <section id="partners" style={{ padding: '5rem 0', background: '#fff' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-label">Сътрудничество</span>
          <h2 className="section-title">Нашите Партньори</h2>
          <div className="divider"  style={{margin: "20px auto"}}/>
          <p style={{ color: '#6b7280', fontSize: '1.0625rem', marginTop: '0.875rem' }}>Работим само с най-добрите в бранша</p>
        </div>

        <div className="partners-outer">
          <div className="partners-track">
            {[...partners, ...partners, ...partners].map((p, i) => (
              <div key={i} className="partner-card">
                <img src={p.logo} alt={p.name}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
