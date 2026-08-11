import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import BeforeAfterSlider from '../sections/BeforeAfterSlider';
import { PageHero } from '../common/PageHero';

interface Pair {
    _id: string;
    title: string;
    beforeUrl: string;
    afterUrl: string;
    beforeUrlSmall?: string;
    afterUrlSmall?: string;
}

export default function BeforeAfterPage() {
    const [pairs, setPairs]     = useState<Pair[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<{ pairs: Pair[] }>('/beforeafter')
            .then(res => setPairs(res.pairs))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <main>
            <PageHero
                label="Нашата работа"
                title="Преди и След"
                description="Реалните трансформации, постигнати от нашия екип"
            />

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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {pairs.map((pair, idx) => (
                                <div key={pair._id}>
                                    {/* Decorative divider between pairs */}
                                    {idx > 0 && (
                                        <div style={{ margin: '72px 0 64px', display: 'flex', justifyContent: 'center' }}>
                                            <div className="divider" />
                                        </div>
                                    )}

                                    {pair.title && (
                                        <h2 style={{
                                            fontFamily: 'var(--d7-fh)',
                                            fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
                                            color: 'var(--d7-dark)',
                                            margin: idx === 0 ? '0 0 24px' : '0 0 24px',
                                            fontWeight: 700,
                                            textAlign: 'center',
                                        }}>
                                            {pair.title}
                                        </h2>
                                    )}

                                    <BeforeAfterSlider
                                        beforeUrl={pair.beforeUrl}
                                        afterUrl={pair.afterUrl}
                                        beforeUrlSmall={pair.beforeUrlSmall}
                                        afterUrlSmall={pair.afterUrlSmall}
                                        title={pair.title}
                                    />
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
