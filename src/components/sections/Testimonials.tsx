import { useState, useEffect, useRef } from 'react';
import { api } from '../../api/client';
import { testimonials as staticTestimonials } from '../../data';
import TestimonialCard from '../sections/TestimonialCard';
import { useIsMobile } from '../../hooks/useIsMobile';
import { SectionLabel } from '../common/SectionLabel';
import { useSwipe } from '../../hooks/useSwipe';

interface Testimonial {
    _id?: string;
    text: string;
    name: string;
    subtitle: string;
    initials: string;
    stars?: number;
}

const FALLBACK: Testimonial[] = staticTestimonials.slice(0, 3);

export default function Testimonials() {
    const [all, setAll] = useState<Testimonial[]>(FALLBACK);
    const isMobile = useIsMobile();
    const [idx, setIdx] = useState(0);
    const [dir, setDir] = useState<1 | -1>(1);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        api.get<{ testimonials: Testimonial[] }>('/testimonials')
            .then(res => { if (res.testimonials.length > 0) setAll(res.testimonials); })
            .catch(() => { /* keep static fallback */ });
    }, []);

    // Always show exactly 3
    const shown = all.slice(0, 3);

    const goTo = (i: number) => { setDir(i > idx ? 1 : -1); setIdx(i); };

    const { setNode: swipeSetNode } = useSwipe(
        () => { if (timerRef.current) clearInterval(timerRef.current); setDir(1);  setIdx(i => (i + 1) % shown.length); },
        () => { if (timerRef.current) clearInterval(timerRef.current); setDir(-1); setIdx(i => (i - 1 + shown.length) % shown.length); }
    );

    useEffect(() => {
        if (!isMobile) return;
        timerRef.current = setInterval(() => {
            setDir(1);
            setIdx(i => (i + 1) % shown.length);
        }, 4000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isMobile, shown.length]);

    return (
        <section id="testimonials" className="testimonials">
            <div className="container">

                <div className="testimonials__header">
                    <SectionLabel>Отзиви</SectionLabel>
                    <h2 className="section-title">Доволни клиенти</h2>
                    <div className="divider" />
                    <p style={{ fontFamily: 'var(--d7-fb)', fontSize: 16, color: 'var(--d7-gray)', marginTop: 8 }}>
                        Доверието на нашите клиенти е най-голямата ни награда
                    </p>
                </div>

                {/* Desktop — 3-column grid */}
                <div className="testimonials__grid">
                    {shown.map((t, i) => (
                        <TestimonialCard key={t._id ?? i} text={t.text} name={t.name} subtitle={t.subtitle} initials={t.initials} stars={t.stars} />
                    ))}
                </div>

                {/* Mobile — slide carousel */}
                <div className="testimonials__carousel">
                    <div ref={swipeSetNode} style={{ overflow: 'hidden', borderRadius: 12 }}>
                        <div
                            key={`${idx}-${dir}`}
                            style={{ animation: `${dir > 0 ? 'slide-from-right' : 'slide-from-left'} 0.32s ease` }}
                        >
                            <TestimonialCard
                                text={shown[idx].text}
                                name={shown[idx].name}
                                subtitle={shown[idx].subtitle}
                                initials={shown[idx].initials}
                                stars={shown[idx].stars}
                            />
                        </div>
                    </div>

                    <div className="testimonials__dots">
                        {shown.map((_, i) => (
                            <button
                                key={i}
                                className={`testimonials__dot${i === idx ? ' testimonials__dot--active' : ''}`}
                                onClick={() => { if (timerRef.current) clearInterval(timerRef.current); goTo(i); }}
                                aria-label={`Отзив ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
