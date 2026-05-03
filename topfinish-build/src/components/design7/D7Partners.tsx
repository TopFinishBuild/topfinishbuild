import { partners } from '../../data';

export default function D7Partners() {
  const triple = [...partners, ...partners, ...partners];

  return (
    <section id="d7-partners" className="d7-partners">
      <div className="d7-container">
        <div className="d7-partners__header">
          <span className="d7-label">Сътрудничество</span>
          <h2 className="d7-section-title">Нашите Партньори</h2>
          <div className="d7-divider" />
          <p style={{ fontFamily: 'var(--d7-fb)', fontSize: 16, color: 'var(--d7-gray)', marginTop: 8 }}>
            Работим само с най-добрите в бранша
          </p>
        </div>
      </div>

      <div className="d7-partners__track-wrap">
        <div className="d7-partners__track">
          {triple.map((p, i) => (
            <img key={i} src={p.logo} alt={p.name} className="d7-partners__logo" />
          ))}
        </div>
      </div>
    </section>
  );
}
