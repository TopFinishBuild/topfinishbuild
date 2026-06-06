import { useState, useEffect } from 'react';
import { token } from '../../api/client';
import AdminLogin from '../admin/AdminLogin';
import GalleryManager from '../admin/GalleryManager';
import CalendarManager from '../admin/CalendarManager';
import SecurityManager from '../admin/SecurityManager';
import PartnersManager from '../admin/PartnersManager';
import ReviewsManager from '../admin/ReviewsManager';
import ContactSettings from '../admin/ContactSettings';
import BeforeAfterManager from '../admin/BeforeAfterManager';

type Tab = 'gallery' | 'beforeafter' | 'calendar' | 'partners' | 'reviews' | 'contact' | 'security';

interface Props { onNavigate: (href: string) => void; }

const NAVY   = '#0f1f3d';
const ORANGE = '#f07420';
const FH     = "'Manrope', sans-serif";

const NAV_ITEMS: { tab: Tab; label: string; icon: string }[] = [
    { tab: 'gallery',     label: 'Галерия',   icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>' },
    { tab: 'beforeafter', label: 'Преди/След', icon: '<rect x="2" y="6" width="20" height="12" rx="2"/><line x1="12" y1="6" x2="12" y2="18"/><polyline points="8 10 5 12 8 14"/><polyline points="16 10 19 12 16 14"/>' },
    { tab: 'calendar',    label: 'Календар',  icon: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>' },
    { tab: 'partners',    label: 'Партньори', icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
    { tab: 'reviews',     label: 'Отзиви',    icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
    { tab: 'contact',     label: 'Контакти',  icon: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.55 3.49 2 2 0 0 1 3.55 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>' },
    { tab: 'security',    label: 'Сигурност', icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
];

export default function AdminPage({ onNavigate }: Props) {
    const [adminName, setAdminName] = useState<string | null>(() =>
        token.get() ? 'Администратор' : null
    );
    const [tab, setTab] = useState<Tab>('gallery');

    const logout = () => { token.clear(); setAdminName(null); };

    useEffect(() => {
        window.addEventListener('auth:expired', logout);
        return () => window.removeEventListener('auth:expired', logout);
    }, []);

    if (!adminName) return <AdminLogin onLogin={name => setAdminName(name)} />;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: FH, background: '#f1f5f9' }}>

            {/* ── Sidebar ── */}
            <aside style={{
                width: 248, flexShrink: 0,
                background: '#fff',
                borderRight: '1px solid #e2e8f0',
                display: 'flex', flexDirection: 'column',
                position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
            }}>
                {/* Logo — matches site header exactly */}
                <div style={{ padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
                    <img src="/logos/topfinish-build-logo.png" alt="TopFinish Build" style={{ height: 44, display: 'block' }} />
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {NAV_ITEMS.map(({ tab: t, label, icon }) => {
                        const active = tab === t;
                        return (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    width: '100%', textAlign: 'left',
                                    background: active ? 'rgba(240,116,32,0.08)' : 'transparent',
                                    border: 'none',
                                    borderRadius: 8,
                                    padding: '10px 14px',
                                    color: active ? ORANGE : '#475569',
                                    fontSize: 14, fontWeight: active ? 700 : 500,
                                    fontFamily: FH, cursor: 'pointer',
                                    transition: 'background 0.15s, color 0.15s',
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round"
                                    dangerouslySetInnerHTML={{ __html: icon }}
                                />
                                {label}
                            </button>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div style={{ padding: '12px 10px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', padding: '0 14px 8px', textTransform: 'uppercase', fontFamily: FH }}>
                        {adminName}
                    </div>
                    <button
                        onClick={() => { window.location.href = '/'; }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', color: '#64748b', fontSize: 13, fontFamily: FH, fontWeight: 500, cursor: 'pointer', padding: '9px 14px', borderRadius: 8, textAlign: 'left', width: '100%' }}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                        Към сайта
                    </button>
                    <button
                        onClick={logout}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', color: '#64748b', fontSize: 13, fontFamily: FH, fontWeight: 500, cursor: 'pointer', padding: '9px 14px', borderRadius: 8, textAlign: 'left', width: '100%' }}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Изход
                    </button>
                </div>
            </aside>

            {/* ── Main ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

                {/* Top bar */}
                <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    <div style={{ fontFamily: FH, fontSize: 18, fontWeight: 800, color: NAVY }}>
                        {NAV_ITEMS.find(n => n.tab === tab)?.label}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: `rgba(240,116,32,0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </div>
                        <span style={{ fontFamily: FH, fontSize: 13, fontWeight: 600, color: '#475569' }}>{adminName}</span>
                    </div>
                </header>

                {/* Content */}
                <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
                    {tab === 'gallery'     && <GalleryManager />}
                    {tab === 'beforeafter' && <BeforeAfterManager />}
                    {tab === 'calendar'    && <CalendarManager />}
                    {tab === 'partners'    && <PartnersManager />}
                    {tab === 'reviews'     && <ReviewsManager />}
                    {tab === 'contact'     && <ContactSettings />}
                    {tab === 'security'    && <SecurityManager />}
                </main>
            </div>
        </div>
    );
}
