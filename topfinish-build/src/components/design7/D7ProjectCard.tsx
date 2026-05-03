import { useState } from 'react';

interface D7ProjectCardProps {
  label: string;
  src: string;
}

export default function D7ProjectCard({ label, src }: D7ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="d7-project-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`d7-project-card__img${hovered ? ' d7-project-card__img--zoom' : ''}`}>
        <img src={src} alt={label} />
      </div>
      <div className={`d7-project-card__overlay${hovered ? ' d7-project-card__overlay--show' : ''}`}>
        <span className={`d7-project-card__label${hovered ? ' d7-project-card__label--show' : ''}`}>{label}</span>
      </div>
    </div>
  );
}
