interface TestimonialCardProps {
  text: string;
  name: string;
  subtitle: string;
  initials: string;
  stars?: number;
}

export default function TestimonialCard({ text, name, subtitle, initials, stars = 5 }: TestimonialCardProps) {
  return (
    <div className="testimonial-card">
      <div className="testimonial-card__top-bar" />
      <div className="testimonial-card__stars">
        {[1, 2, 3, 4, 5].map(i => (
          <span key={i} className={`testimonial-card__star${i <= stars ? '' : ' testimonial-card__star--empty'}`}>★</span>
        ))}
      </div>
      <p className="testimonial-card__text">"{text}"</p>
      <div className="testimonial-card__author">
        <div className="testimonial-card__avatar">{initials}</div>
        <div>
          <div className="testimonial-card__name">{name}</div>
          <div className="testimonial-card__sub">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}
