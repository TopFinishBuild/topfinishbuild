import { useState } from 'react';

interface ProjectCardProps {
  label: string;
  src: string;
  /** Image-search text — richer than the visible label when the caller knows more. */
  alt?: string;
}

export default function ProjectCard({ label, src, alt }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="project-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`project-card__img${hovered ? ' project-card__img--zoom' : ''}`}>
        <img src={src} alt={alt ?? label} loading="lazy" decoding="async" />
      </div>
      <div className={`project-card__overlay${hovered ? ' project-card__overlay--show' : ''}`}>
        <span className={`project-card__label${hovered ? ' project-card__label--show' : ''}`}>{label}</span>
      </div>
    </div>
  );
}
