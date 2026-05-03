interface D7TestimonialCardProps {
  text: string;
  name: string;
  subtitle: string;
  initials: string;
}

export default function D7TestimonialCard({ text, name, subtitle, initials }: D7TestimonialCardProps) {
  return (
    <div className="d7-testimonial-card">
      <div className="d7-testimonial-card__top-bar" />
      <div className="d7-testimonial-card__stars">
        {[1,2,3,4,5].map((i) => (
          <span key={i} className="d7-testimonial-card__star">★</span>
        ))}
      </div>
      <p className="d7-testimonial-card__text">"{text}"</p>
      <div className="d7-testimonial-card__author">
        <div className="d7-testimonial-card__avatar">{initials}</div>
        <div>
          <div className="d7-testimonial-card__name">{name}</div>
          <div className="d7-testimonial-card__sub">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}
