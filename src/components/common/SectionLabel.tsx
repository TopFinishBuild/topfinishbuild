import type { ReactNode } from 'react';

interface Props { children: ReactNode; }

/** Unified orange pill badge used as section/page label. */
export function SectionLabel({ children }: Props) {
    return <span className="section-label">{children}</span>;
}
