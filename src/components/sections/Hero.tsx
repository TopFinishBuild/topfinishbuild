import { publicSrcSet } from '../../utils/image';

export default function Hero() {
  return (
    <section className="hero-section">
      {/* Background image — WebP with PNG fallback, high priority for LCP */}
      <div className="hero-bg-img">
        <img
          src="/hero-1200.webp"
          srcSet={publicSrcSet('/hero.webp')}
          sizes="100vw"
          width={4000}
          height={1400}
          alt=""
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Dark gradient overlay */}
      <div className="hero-overlay" />

      {/* Ambient glows */}
      <div className="hero-glows">
        <div className="hero-glow-orange" />
        <div className="hero-glow-blue" />
      </div>

      <div className="hero-content">
        <div style={{ marginBottom: '1.5rem' }}>
          <span className="hero-badge">Професионални Довършителни Работи</span>
        </div>

        <h1 className="hero-title">
          TopFinish Build<br />
          {/* <span style={{ color: '#f97316' }}>За Вашия Дом</span> */}
          <span style={{ color: '#f97316' }}>Правилният избор</span>
        </h1>

        <p className="hero-subtitle">
          Перфекционизъм във всеки детайл<br />
          {/* Качество, прецизност и внимание към детайла. */}
        </p>

        <div className="hero-buttons">
          <a href="#calendar" className="btn-primary">Свържете се с нас</a>
          <a href="#before-after" className="btn-ghost">Вижте Резултатите</a>
        </div>
      </div>
    </section>
  );
}
