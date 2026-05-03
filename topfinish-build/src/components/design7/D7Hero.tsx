import D7StatsLine from './D7StatsLine';

const HERO_IMG = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=80';

const NAV_LINKS = [
  ['#d7-partner',      'За нас'],
  ['#d7-services',     'Услуги'],
  ['#d7-before-after', 'Преди/След'],
  ['#d7-testimonials', 'Клиенти'],
  ['#d7-contact',      'Контакт'],
];

export default function D7Hero() {
  return (
    <section className="d7-hero">
      {/* Background image */}
      <img src={HERO_IMG} alt="" className="d7-hero__bg" />
      <div className="d7-hero__overlay" />

      {/* Navigation */}
      <nav className="d7-hero__nav">
        <div className="d7-hero__logo">
          <div className="d7-hero__logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M6 9L12 4.5L18 9V18H6V9Z" fill="white" opacity="0.9"/>
              <rect x="9" y="12" width="6" height="6" fill="white"/>
            </svg>
          </div>
          <span className="d7-hero__logo-name">
            TopFinish <span>Build</span>
          </span>
        </div>

        <ul className="d7-hero__nav-links">
          {NAV_LINKS.map(([href, label]) => (
            <li key={label}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>

        <a href="#d7-contact" className="d7-btn-primary" style={{ fontSize: 13, padding: '10px 24px' }}>
          Безплатна оферта
        </a>
      </nav>

      {/* Content */}
      <div className="d7-hero__content">
        <div className="d7-hero__text">
          <div className="d7-hero__kicker">Професионални довършителни работи</div>
          <h1 className="d7-hero__title">
            TopFinish Build
            <span className="d7-hero__title-accent">Правилният избор</span>
          </h1>
          <p className="d7-hero__subtitle">
            Повече от 12 години трансформираме пространства с прецизност и безупречно качество. Всеки детайл има значение.
          </p>
          <div className="d7-hero__cta">
            <a href="#d7-contact" className="d7-btn-primary">Свържете се →</a>
            <a href="#d7-before-after" className="d7-btn-outline">Вижте Резултати</a>
          </div>
        </div>
      </div>

      {/* Stats line at the bottom of hero */}
      <D7StatsLine />
    </section>
  );
}
