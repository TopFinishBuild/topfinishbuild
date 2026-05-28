import React, { useState, useEffect } from 'react';
import { fetchSettings } from '../../api/settingsCache';

const SERVICES_LINKS = ['Баня / WC', 'Настилки', 'Боядисване', 'ВиК Инсталации', 'Електро Работи', 'Гипсокартон'];
const NAV_LINKS: [string, string][] = [
    ['За нас',    '#about'],
    ['Услуги',    '#services'],
    ['Преди/След','#before-after'],
    ['Галерия',   '#gallery'],
    ['Контакт',   '#calendar'],
];

const SOCIALS = [
    {
        label: 'Facebook', href: '#',
        Icon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    },
    {
        label: 'Instagram', href: '#',
        Icon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
    },
    {
        label: 'TikTok', href: '#',
        Icon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/></svg>,
    },
];

const PhoneIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.55 3.49 2 2 0 0 1 3.55 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
);

const EmailIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
);

interface FooterProps { onNavigate?: (href: string) => void; }

export default function Footer({ onNavigate }: FooterProps = {}) {
    const [phone1, setPhone1] = useState('+359 888 123 456');
    const [phone2, setPhone2] = useState('');
    const [email1, setEmail1] = useState('info@topfinish.bg');
    const [email2, setEmail2] = useState('');

    useEffect(() => {
        fetchSettings().then(s => {
            if (s.phone1) setPhone1(s.phone1);
            if (s.phone2 !== undefined) setPhone2(s.phone2);
            if (s.email1) setEmail1(s.email1);
            if (s.email2 !== undefined) setEmail2(s.email2);
        }).catch(() => { /* keep defaults */ });
    }, []);

    const handleClick = (e: React.MouseEvent, href: string) => { e.preventDefault(); onNavigate?.(href); };

    return (
        <footer className="footer">
            <div className="container">

                <div className="footer__inner">

                    {/* Brand column */}
                    <div>
                        <div className="footer__logo">
                            <img src="/logos/topfinish-build-logo-light.png" alt="TopFinish Build" />
                        </div>
                        <p className="footer__tagline">
                            Повече от 12 години трансформираме пространства с прецизност и безупречно качество. Вашият надежден партньор за всякакъв вид ремонти.
                        </p>
                        <div style={{ display: 'flex', gap: 10 }}>
                            {SOCIALS.map(({ label, Icon, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.75)', transition: 'background 0.2s, color 0.2s, border-color 0.2s' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--d7-orange)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--d7-orange)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.09)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)'; }}
                                >
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <div className="footer__col-title">Навигация</div>
                        <ul className="footer__links">
                            {NAV_LINKS.map(([label, href]) => (
                                <li key={href}><a href={href} onClick={e => handleClick(e, href)}>{label}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <div className="footer__col-title">Услуги</div>
                        <ul className="footer__links">
                            {SERVICES_LINKS.map(l => (
                                <li key={l}><a href="#services">{l}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <div className="footer__col-title">Контакти</div>
                        <div className="footer__contact-item">
                            <PhoneIcon />
                            {phone1}
                        </div>
                        {phone2 && (
                            <div className="footer__contact-item">
                                <PhoneIcon />
                                {phone2}
                            </div>
                        )}
                        <div className="footer__contact-item">
                            <EmailIcon />
                            {email1}
                        </div>
                        {email2 && (
                            <div className="footer__contact-item">
                                <EmailIcon />
                                {email2}
                            </div>
                        )}
                        <div className="footer__contact-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                            </svg>
                            София, България
                        </div>
                    </div>

                </div>

                {/* Bottom bar */}
                <div className="footer__bottom">
                    <span className="footer__copy">© 2025 TopFinish Build. Всички права запазени.</span>
                    <span className="footer__copy">Изработено с внимание и грижа</span>
                </div>

            </div>
        </footer>
    );
}
