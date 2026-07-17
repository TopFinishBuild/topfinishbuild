import { useState, useEffect } from 'react';
import BeforeAfterSlider from './BeforeAfterSlider';
import { api } from '../../api/client';
import { SectionLabel } from '../common/SectionLabel';

interface Pair {
    _id: string;
    title: string;
    beforeUrl: string;
    afterUrl: string;
}

interface Props {
    onNavigate: (href: string) => void;
}

export default function BeforeAfter({ onNavigate }: Props) {
    const [pair, setPair] = useState<Pair | null>(null);

    useEffect(() => {
        api.get<{ pairs: Pair[] }>('/beforeafter')
            .then(res => { if (res.pairs.length > 0) setPair(res.pairs[0]); })
            .catch(() => {});
    }, []);

    return (
        <section id="before-after" className="before-after">
            <div className="container">

                <div className="before-after__header">
                    <SectionLabel>Нашата работа</SectionLabel>
                    <h2 className="section-title">Преди и След</h2>
                    <div className="divider" />
                    <p style={{ fontFamily: 'var(--d7-fb)', fontSize: 16, color: 'var(--d7-gray)', marginTop: 8 }}>
                        {pair?.title ?? 'Вижте трансформацията с ваши очи'}
                    </p>
                </div>

                {pair
                    ? <BeforeAfterSlider beforeUrl={pair.beforeUrl} afterUrl={pair.afterUrl} />
                    : <div className="before-after__slider" style={{ background: '#eef1f5' }} aria-hidden="true" />
                }

                <p className="before-after__hint">Плъзнете наляво и надясно за да видите разликата</p>

                <div style={{ textAlign: 'center', marginTop: 40 }}>
                    <button
                        onClick={() => onNavigate('#predi-i-sled')}
                        style={{
                            background: '#f97316', color: '#fff', border: 'none',
                            borderRadius: 8, padding: '13px 36px', fontSize: 15, fontWeight: 700,
                            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10,
                            boxShadow: '0 4px 16px rgba(249,115,22,0.3)',
                        }}
                    >
                        Вижте всички трансформации
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                        </svg>
                    </button>
                </div>

            </div>
        </section>
    );
}
