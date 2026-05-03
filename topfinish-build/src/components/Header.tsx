import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../data';

interface HeaderProps {
  onNavigate?: (href: string) => void;
  activePage?: string;
  activeSection?: string;
}

export default function Header({ onNavigate, activePage = 'home', activeSection = '' }: HeaderProps = {}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLink = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    onNavigate?.(href);
  };

  const isActive = (href: string) => {
    if (href === '#prices'   && activePage === 'pricing') return true;
    if (href === '#gallery'  && activePage === 'gallery') return true;
    if (activePage === 'home' && href === activeSection)  return true;
    return false;
  };

  const activeStyle = { color: '#f97316' };

  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 40, isolation: 'isolate' }}>
      <nav style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>

        {/* Logo */}
        <div style={{ cursor: 'pointer' }} onClick={e => handleLink(e as any, '#home')}>
          <img src="/logos/topfinish-build-logo.png" alt="TopFinish Build" style={{ height: '3rem', width: 'auto', display: 'block' }} />
        </div>

        {/* Desktop nav */}
        <div className="nav-desktop">
          {NAV_LINKS.map(([href, label]) => {
            const active = isActive(href);
            return (
              <a
                key={href}
                href={href}
                className="nav-link"
                onClick={e => handleLink(e, href)}
                aria-current={active ? 'page' : undefined}
                style={active ? activeStyle : undefined}
              >
                {label}
                {active && (
                  <span style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 2, background: '#f97316', borderRadius: 1 }} />
                )}
              </a>
            );
          })}
          <a
            href="#contact"
            className="btn-primary"
            onClick={e => handleLink(e, '#contact')}
            style={{ padding: '0.6rem 1.5rem', fontSize: '0.9375rem' }}
          >
            Контакт
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="nav-mobile-btn"
          aria-label={menuOpen ? 'Затвори менюто' : 'Отвори менюто'}
          aria-expanded={menuOpen}
          style={{ background: 'none', border: 'none', color: '#374151', padding: '0.25rem' }}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`header-mobile-menu${menuOpen ? ' header-mobile-menu--open' : ''}`} role="navigation" aria-label="Мобилно меню">
        <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {NAV_LINKS.map(([href, label]) => {
            const active = isActive(href);
            return (
              <a
                key={href}
                href={href}
                onClick={e => handleLink(e, href)}
                aria-current={active ? 'page' : undefined}
                style={{ fontFamily: "'Barlow', sans-serif", color: active ? '#f97316' : '#374151', fontWeight: active ? 700 : 500, padding: '0.5rem 0', borderBottom: '1px solid #f9fafb' }}
              >{label}</a>
            );
          })}
          <a href="#contact" onClick={e => handleLink(e, '#contact')} className="btn-primary" style={{ textAlign: 'center', justifyContent: 'center', marginTop: '0.5rem' }}>
            Контакт
          </a>
        </div>
      </div>
    </header>
  );
}
