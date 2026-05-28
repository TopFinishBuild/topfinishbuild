import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { partners as staticPartners } from '../../data';

interface Partner {
    _id: string;
    name: string;
    url: string;
    urlSmall?: string;
}

export default function Partners() {
    const [partners, setPartners] = useState<{ name: string; logo: string }[]>(
        staticPartners.map(p => ({ name: p.name, logo: p.logo }))
    );

    useEffect(() => {
        api.get<{ partners: Partner[] }>('/partners').then(res => {
            if (res.partners.length > 0) {
                setPartners(res.partners.map(p => ({ name: p.name, logo: p.urlSmall ?? p.url })));
            }
        }).catch(() => { /* keep static fallback */ });
    }, []);

    return (
        <section id="partners" style={{ padding: '5rem 0', background: '#fff' }}>
            <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <span className="section-label">Сътрудничество</span>
                    <h2 className="section-title">Нашите <em>Партньори</em></h2>
                    <div className="divider" />
                    <p style={{ color: '#6b7280', fontSize: '1.0625rem', marginTop: '0.875rem' }}>Работим само с най-добрите в бранша</p>
                </div>

                <div className="partners-outer">
                    <div className="partners-track">
                        {[...partners, ...partners, ...partners].map((p, i) => (
                            <div key={i} className="partner-card">
                                <img src={p.logo} alt={p.name} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
