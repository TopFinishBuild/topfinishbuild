import { PageHero } from '../common/PageHero';

interface PricingPageProps {
  onNavigate: (href: string) => void;
}

export default function PricingPage({ onNavigate }: PricingPageProps) {
  return (
    <div className="pricing-page">
      <PageHero label="Цени" title={<>ОЧАКВАЙТЕ <em>СКОРО</em></>} />

      <div className="pricing-page__content">
        <div className="container">
          <div className="pricing-page__card">
            <div className="pricing-page__card-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h2 className="pricing-page__card-title">Подробна ценова листа — очаквайте скоро</h2>
            <p className="pricing-page__card-text">
              Работим по изготвяне на прозрачна ценова листа за всяка услуга.<br />
              До тогава — свържете се с нас за <strong>индивидуална оферта</strong>. Отговаряме до 24 часа.
            </p>
            <div className="pricing-page__actions">
              <a href="tel:+359888000123" className="pricing-page__phone">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.55 3.49 2 2 0 0 1 3.55 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                +359 888 000 123
              </a>
              <button onClick={() => onNavigate('#calendar')} className="btn-primary" style={{ border: 'none', cursor: 'pointer' }}>
                Заявете оферта
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
