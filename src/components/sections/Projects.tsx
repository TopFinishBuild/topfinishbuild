import { useState, useEffect } from 'react';
import { api } from '../../api/client';
import ProjectCard from '../sections/ProjectCard';

interface GalleryImage {
    _id: string;
    label: string;
    url: string;
    urlSmall?: string;
}

interface ProjectsProps {
    onViewAll: () => void;
}

export default function Projects({ onViewAll }: ProjectsProps) {
    const [items, setItems] = useState<GalleryImage[]>([]);

    useEffect(() => {
        api.get<{ images: GalleryImage[] }>('/gallery').then(res => {
            setItems(res.images.slice(0, 3));
        }).catch(() => { /* show empty */ });
    }, []);

    return (
        <section id="projects" className="projects">
            <div className="container">
                <div className="projects__header">
                    <span className="section-label">Портфолио</span>
                    <h2 className="section-title">НАШИТЕ <em>ПРОЕКТИ</em></h2>
                    <div className="divider" />
                </div>

                <div className="projects__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginTop: 32 }}>
                    {items.map(img => (
                        <ProjectCard key={img._id} label={img.label} src={img.urlSmall ?? img.url} />
                    ))}
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
