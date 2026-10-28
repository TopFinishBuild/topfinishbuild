import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import ProjectCard from '../sections/ProjectCard';
import { buildSlug } from '../../utils/slug';
import { galleryImageAlt } from '../../utils/seo';
import { SectionLabel } from '../common/SectionLabel';

interface GalleryImage {
    _id: string;
    label: string;
    category: string;
    url: string;
    urlSmall?: string;
    city?: string;
}

interface ProjectsProps {
    onViewAll: () => void;
    onNavigate: (href: string) => void;
}

const Chevron = ({ points }: { points: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points={points} /></svg>
);

export default function Projects({ onViewAll, onNavigate }: ProjectsProps) {
    const [items, setItems] = useState<GalleryImage[]>([]);
    // Element in state, not a ref: a Suspense/StrictMode remount re-runs the effect on the live node.
    const [track, setTrack] = useState<HTMLDivElement | null>(null);
    /** Scroll position at either end — drives the arrows. Both true = everything fits. */
    const [edge, setEdge] = useState({ start: true, end: true });

    useEffect(() => {
        api.get<{ images: GalleryImage[] }>('/gallery?favorites=1')
            // No favorites picked yet — show the first three photos instead of an empty row.
            .then(res => res.images.length > 0
                ? res.images
                : api.get<{ images: GalleryImage[] }>('/gallery?limit=3').then(r => r.images))
            .then(setItems)
            .catch(() => { /* show empty */ });
    }, []);

    useEffect(() => {
        const el = track;
        if (!el) return;
        const update = () => {
            const start = el.scrollLeft <= 2;
            const end   = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
            setEdge(prev => prev.start === start && prev.end === end ? prev : { start, end });
        };
        // Fires on first layout, when the photos arrive and on every resize.
        const ro = new ResizeObserver(update);
        ro.observe(el);
        el.addEventListener('scroll', update, { passive: true });
        return () => { ro.disconnect(); el.removeEventListener('scroll', update); };
    }, [track]);

    const scroll = (dir: 1 | -1) => track?.scrollBy({ left: dir * track.clientWidth, behavior: 'smooth' });

    const scrollable = !(edge.start && edge.end);

    return (
        <section id="projects" className="projects">
            <div className="container">
                <div className="projects__header">
                    <SectionLabel>Портфолио</SectionLabel>
                    <h2 className="section-title">НАШИТЕ <em>ПРОЕКТИ</em></h2>
                    <div className="divider" />
                </div>

                <div className="projects-carousel" style={{ marginTop: 32 }}>
                    {scrollable && (
                        <button className={`projects-carousel__arrow${edge.start ? ' disabled' : ''}`} onClick={() => scroll(-1)} aria-label="Предишни проекти">
                            <Chevron points="15 18 9 12 15 6" />
                        </button>
                    )}

                    <div ref={setTrack} className="projects__scroller">
                        {items.map(img => (
                            <div
                                key={img._id}
                                className="projects__slide"
                                onClick={() => onNavigate(`/remont-snimki/${buildSlug(img.category, img.label, img.city)}`)}
                            >
                                <ProjectCard
                                    label={img.label}
                                    src={img.urlSmall ?? img.url}
                                    alt={galleryImageAlt({ label: img.label, cat: img.category, city: img.city })}
                                />
                            </div>
                        ))}
                    </div>

                    {scrollable && (
                        <button className={`projects-carousel__arrow${edge.end ? ' disabled' : ''}`} onClick={() => scroll(1)} aria-label="Следващи проекти">
                            <Chevron points="9 18 15 12 9 6" />
                        </button>
                    )}
                </div>

                <div className="projects__cta">
                    <button
                        onClick={onViewAll}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#f97316', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em' }}
                    >
                        Виж всички проекти
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
