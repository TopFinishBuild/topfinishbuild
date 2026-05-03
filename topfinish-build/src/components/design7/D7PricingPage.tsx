interface D7PricingPageProps {
  onBack: () => void;
}

export default function D7PricingPage({ onBack }: D7PricingPageProps) {
  return (
    <div className="d7-pricing-page">
      {/* Hero strip — navy, with back button */}
      <div className="d7-page-hero">
        <div className="d7-container">
          <button className="d7-page-hero__back" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Назад
          </button>
          <span className="d7-label" style={{ marginTop: 16, display: 'inline-block' }}>Цени</span>
          <h1 className="d7-section-title" style={{ color: '#fff', marginTop: 10 }}>
            ОЧАКВАЙТЕ <em>СКОРО</em>
          </h1>
        </div>
      </div>

      {/* Content — light */}
      <div className="d7-pricing-page__content">
        <div className="d7-container">
          <div className="d7-pricing-page__card">
            <div className="d7-pricing-page__card-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h2 className="d7-pricing-page__card-title">Подробна ценова листа — очаквайте скоро</h2>
            <p className="d7-pricing-page__card-text">
              Работим по изготвяне на прозрачна ценова листа за всяка услуга.<br />
              До тогава — свържете се с нас за <strong>индивидуална оферта</strong>. Отговаряме до 24 часа.
            </p>
            <div className="d7-pricing-page__actions">
              <a href="tel:+359888000123" className="d7-pricing-page__phone">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.55 3.49 2 2 0 0 1 3.55 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                +359 888 000 123
              </a>
              <a href="#contact" onClick={onBack} className="d7-btn-primary">
                Заявете оферта
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
