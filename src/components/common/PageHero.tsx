import type { ReactNode } from 'react';
import { SectionLabel } from './SectionLabel';

interface PageHeroProps {
    label: string;
    title: ReactNode;
    description?: string;
}

/**
 * Shared dark hero strip used on every sub-page (Gallery, Pricing, About, Преди/След…).
 * Does NOT affect the homepage hero.
 */
export function PageHero({ label, title, description }: PageHeroProps) {
    return (
        <div className="page-hero">
            <div className="container page-hero__inner">
                <SectionLabel>{label}</SectionLabel>
                <h1 className="section-title page-hero__title">{title}</h1>
                <div className="divider page-hero__divider" />
                {description && (
                    <p className="page-hero__desc">{description}</p>
                )}
            </div>
        </div>
    );
}
