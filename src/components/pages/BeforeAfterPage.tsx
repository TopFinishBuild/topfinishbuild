import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import BeforeAfterSlider from '../sections/BeforeAfterSlider';

interface Pair {
    _id: string;
    title: string;
    beforeUrl: string;
    afterUrl: string;
}

export default function BeforeAfterPage() {
    const [pairs, setPairs]   = useState<Pair[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<{ pairs: Pair[] }>('/beforeafter')
            .then(res => setPairs(res.pairs))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <main>
            {/* Page header */}
            <section style={{ background: '#0f172a', padding: '72px 0 56px' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <span className="section-label" style={{ color: '#fb923c' }}>Нашата работа</span>
                    <h1 style={{ fontFamily: 'var(--d7-fh)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#f1f5f9', margin: '12px 0 16px', fontWeight: 800 }}>
                        Преди и След
                    </h1>
                    <div className="divider" style={{ margin: '0 auto 24px' }} />
                    <p style={{ fontFamily: 'var(--d7-fb)', fontSize: 17, color: '#94a3b8', maxWidth: 500, margin: '0 auto' }}>
                        Реалните трансформации, постигнати от нашия екип
                    </p>
                </div>
            </section>

            {/* Pairs list */}
            <section style={{ padding: '64px 0 100px', background: 'var(--d7-white)' }}>
                <div className="container">
                    {loading ? (
                        <div style={{ textAlign: 'center', color: 'var(--d7-gray)', padding: '80px 0', fontFamily: 'var(--d7-fb)' }}>
                            Зареждане...
                        </div>
                    ) : pairs.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--d7-gray)', padding: '80px 0', fontFamily: 'var(--d7-fb)' }}>
                            Няма добавени трансформации.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 80 }}>
                            {pairs.map((pair, idx) => (
                                <div key={pair._id}>
                                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                                        <span style={{
                                            display: 'inline-block',
                                            background: 'rgba(249,115,22,0.1)',
                                            color: '#f97316',
                                            borderRadius: 6,
                                            padding: '3px 12px',
                                            fontSize: 12,
                                            fontWeight: 700,
                                            letterSpacing: '0.06em',
                                            fontFamily: 'var(--d7-fh)',
                                            marginBottom: 10,
                                        }}>
                                            #{idx + 1}
                                        </span>
                                        {pair.title && (
                                            <h2 style={{ fontFamily: 'var(--d7-fh)', fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', color: 'var(--d7-dark)', margin: '0 0 4px', fontWeight: 700 }}>
                                                {pair.title}
                                            </h2>
                                        )}
                                    </div>

                                    <BeforeAfterSlider beforeUrl={pair.beforeUrl} afterUrl={pair.afterUrl} />

                                    <p className="before-after__hint">Плъзнете наляво и надясно за да видите разликата</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
