export default function Footer() {
  return (
    <footer style={{ background: '#0f172a', color: '#fff', padding: '3rem 1.5rem' }}>
      <div className="footer-inner" style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <div style={{ width: '2.25rem', height: '2.25rem', background: 'linear-gradient(135deg,#1d4ed8,#1e3a8a)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 9L12 4.5L18 9V18H6V9Z" fill="white" opacity="0.9"/>
                <rect x="9" y="12" width="6" height="6" fill="#f97316"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1.25rem', color: '#fff' }}>TopFinish Build</span>
          </div>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.8125rem', color: '#64748b', fontStyle: 'italic' }}>Перфекционизъм във всеки детайл</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>© 2025 TopFinish Build. Всички права запазени.</p>
          <p style={{ color: '#475569', fontSize: '0.8125rem', marginTop: '0.25rem' }}>Изработено с внимание и грижа</p>
        </div>
      </div>
    </footer>
  );
}
