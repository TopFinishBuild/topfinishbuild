import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { SectionLabel } from '../common/SectionLabel';

interface Partner {
    _id: string;
    name: string;
    url: string;
    urlSmall?: string;
}

const SKELETON_COUNT = 6;

export default function Partners() {
    const [partners, setPartners] = useState<{ name: string; logo: string }[]>([]);
    const [loaded, setLoaded]     = useState(false);

    useEffect(() => {
        api.get<{ partners: Partner[] }>('/partners')
            .then(res => setPartners(res.partners.map(p => ({ name: p.name, logo: p.urlSmall ?? p.url }))))
            .catch(() => { /* leave empty — section hides itself */ })
            .finally(() => setLoaded(true));
    }, []);

    // Nothing to advertise once we know the list is empty.
    if (loaded && partners.length === 0) return null;

    const cards = loaded
        ? [...partners, ...partners, ...partners]
        : Array.from({ length: SKELETON_COUNT }, () => null);

    return (
        <section id="partniori" style={{ padding: '5rem 0', background: '#fff' }}>
            <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <SectionLabel>Сътрудничество</SectionLabel>
                    <h2 className="section-title">Нашите <em>Партньори</em></h2>
                    <div className="divider" />
                    <p style={{ color: '#6b7280', fontSize: '1.0625rem', marginTop: '0.875rem' }}>Работим само с най-добрите в бранша</p>
                </div>

                <div className="partners-outer">
                    <div className="partners-track" style={loaded ? undefined : { animation: 'none' }}>
                        {cards.map((p, i) => (
                            <div key={i} className="partner-card" aria-hidden={p ? undefined : true}>
                                {/* Eager: only 5 small logos, and the marquee repeats them — lazy buys nothing here. */}
                                {p && <img src={p.logo} alt={`${p.name} – партньор на TopFinish Build`} decoding="async" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
