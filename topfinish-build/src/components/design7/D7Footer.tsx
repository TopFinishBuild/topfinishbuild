const SERVICES_LINKS = ['Баня / WC', 'Настилки', 'Боядисване', 'ВиК Инсталации', 'Електро Работи', 'Гипсокартон'];
const NAV_LINKS      = ['За нас', 'Услуги', 'Преди/След', 'Клиенти', 'Контакт'];

export default function D7Footer() {
  return (
    <footer className="d7-footer">
      <div className="d7-container">

        <div className="d7-footer__inner">

          {/* Brand column */}
          <div>
            <div className="d7-footer__logo">
              <div className="d7-footer__logo-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9L12 4.5L18 9V18H6V9Z" fill="white" opacity="0.9"/>
                  <rect x="9" y="12" width="6" height="6" fill="white"/>
                </svg>
              </div>
              <span className="d7-footer__brand">TopFinish Build</span>
            </div>
            <p className="d7-footer__tagline">
              Повече от 12 години трансформираме пространства с прецизност и безупречно качество. Вашият надежден партньор за всякакъв вид ремонти.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {['facebook', 'instagram'].map((s) => (
                <a key={s} href="#" style={{
                  width: 36, height: 36,
                  borderRadius: 6,
                  background: 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'var(--d7-fh)', fontSize: 11, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  transition: 'background 0.2s',
                }}>
                  {s[0].toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className="d7-footer__col-title">Навигация</div>
            <ul className="d7-footer__links">
              {NAV_LINKS.map((l) => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <div className="d7-footer__col-title">Услуги</div>
            <ul className="d7-footer__links">
              {SERVICES_LINKS.map((l) => (
                <li key={l}><a href="#d7-services">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="d7-footer__col-title">Контакти</div>
            <div className="d7-footer__contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.55 3.49 2 2 0 0 1 3.55 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              +359 888 123 456
            </div>
            <div className="d7-footer__contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              info@topfinish.bg
            </div>
            <div className="d7-footer__contact-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              София, България
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="d7-footer__bottom">
          <span className="d7-footer__copy">© 2025 TopFinish Build. Всички права запазени.</span>
          <span className="d7-footer__copy">Изработено с внимание и грижа</span>
        </div>

      </div>
    </footer>
  );
}
