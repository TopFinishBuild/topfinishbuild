import { useState } from 'react';
import { token } from '../../api/client';
import AdminLogin from '../admin/AdminLogin';
import GalleryManager from '../admin/GalleryManager';
import CalendarManager from '../admin/CalendarManager';

type Tab = 'gallery' | 'calendar';

interface Props {
    onNavigate: (href: string) => void;
}

export default function AdminPage({ onNavigate }: Props) {
    const [adminName, setAdminName] = useState<string | null>(() =>
        token.get() ? 'Администратор' : null
    );
    const [tab, setTab] = useState<Tab>('gallery');

    const logout = () => {
        token.clear();
        setAdminName(null);
    };
    if (!adminName) return <AdminLogin onLogin={name => setAdminName(name)} />;

    const navItem = (t: Tab, label: string, icon: React.ReactNode) => (
        <button
            onClick={() => setTab(t)}
            style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                background: tab === t ? 'rgba(249,115,22,0.15)' : 'transparent',
                border: `1px solid ${tab === t ? 'rgba(249,115,22,0.4)' : 'transparent'}`,
                borderRadius: 8, padding: '10px 14px', color: tab === t ? '#fb923c' : '#94a3b8',
                fontSize: 14, fontWeight: 600, cursor: 'pointer', textAlign: 'left',
            }}
        >
            {icon}
            {label}
        </button>
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a' }}>
            {/* Sidebar */}
            <aside style={{ width: 240, flexShrink: 0, background: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', padding: '24px 16px' }}>
                <div style={{ marginBottom: 32 }}>
                    <img src="/logos/topfinish-build-logo.png" alt="TopFinish Build" style={{ height: 40, display: 'block', marginBottom: 4 }} />
                    <span style={{ color: '#475569', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin Panel</span>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                    {navItem('gallery', 'Галерия',
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    )}
                    {navItem('calendar', 'Календар',
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    )}
                </nav>

                <div style={{ borderTop: '1px solid #334155', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ color: '#475569', fontSize: 12 }}>{adminName}</div>
                    <button
                        onClick={() => { onNavigate('#home'); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', color: '#64748b', fontSize: 13, cursor: 'pointer', padding: '6px 0' }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                        Към сайта
                    </button>
                    <button
                        onClick={logout}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', color: '#64748b', fontSize: 13, cursor: 'pointer', padding: '6px 0' }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Изход
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main style={{ flex: 1, padding: 40, overflowY: 'auto' }}>
                {tab === 'gallery'   && <GalleryManager />}
                {tab === 'calendar'  && <CalendarManager />}
            </main>
        </div>
    );
}
