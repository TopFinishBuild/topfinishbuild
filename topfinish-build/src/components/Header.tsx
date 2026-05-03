import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../data';

interface HeaderProps {
  onNavigate?: (href: string) => void;
}

export default function Header({ onNavigate }: HeaderProps = {}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLink = (href: string) => {
    setMenuOpen(false);
    if (onNavigate && (href === '#prices' || href === '#gallery')) {
      onNavigate(href);
    }
  };

  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 40, isolation: 'isolate' }}>
      <nav style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '5rem' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '3.25rem', height: '3.25rem', background: 'linear-gradient(135deg,#1d4ed8,#1e3a8a)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(30,58,138,0.3)' }}>
            <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
              <path d="M8 12L16 6L24 12V24H8V12Z" fill="white" opacity="0.9"/>
              <rect x="12" y="16" width="8" height="8" fill="#f97316"/>
              <path d="M6 14L16 8L26 14" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: '#1e3266', lineHeight: 1.1 }}>TopFinish Build</div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic', fontWeight: 400 }}>Перфекционизъм във всеки детайл</div>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="nav-desktop">
          {NAV_LINKS.map(([href, label]) => (
            <a key={href} href={href} className="nav-link"
              onClick={e => { if (onNavigate && (href === '#prices' || href === '#gallery')) { e.preventDefault(); handleLink(href); } }}
            >{label}</a>
          ))}
          <a href="#contact" className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9375rem' }}>
            Контакт
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMenuOpen(v => !v)} className="nav-mobile-btn" style={{ background: 'none', border: 'none', color: '#374151', padding: '0.25rem' }}>
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile menu — absolute overlay, doesn't push content */}
      <div className={`header-mobile-menu${menuOpen ? ' header-mobile-menu--open' : ''}`}>
        <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {NAV_LINKS.map(([href, label]) => (
            <a key={href} href={href}
              onClick={e => { if (onNavigate && (href === '#prices' || href === '#gallery')) e.preventDefault(); handleLink(href); }}
              style={{ fontFamily: "'Barlow', sans-serif", color: '#374151', fontWeight: 500, padding: '0.5rem 0', borderBottom: '1px solid #f9fafb' }}
            >{label}</a>
          ))}
          <a href="#contact" onClick={() => setMenuOpen(false)} className="btn-primary" style={{ textAlign: 'center', justifyContent: 'center', marginTop: '0.5rem' }}>
            Контакт
          </a>
        </div>
      </div>
    </header>
  );
}
