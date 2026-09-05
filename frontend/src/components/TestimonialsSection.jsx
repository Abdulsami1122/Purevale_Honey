import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../lib/api';
import './TestimonialsSection.css';

const AUTOPLAY_MS = 6000;

const StaticStars = ({ rating }) => (
  <div className="testi-stars" aria-hidden="true">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} size={16} fill={n <= rating ? 'currentColor' : 'none'} strokeWidth={1.6} />
    ))}
  </div>
);

const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || '?';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    api
      .listTestimonials()
      .then((d) => setTestimonials(d.testimonials || []))
      .finally(() => setLoading(false));
  }, []);

  const count = testimonials.length;

  const goTo = (i) => setIndex(((i % count) + count) % count);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  // Autoplay — pauses whenever the tab / hover interaction stops it via clearInterval below.
  useEffect(() => {
    if (count < 2) return undefined;
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [count]);

  const pause = () => clearInterval(timerRef.current);
  const resume = () => {
    if (count < 2) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
  };

  const active = useMemo(() => testimonials[index], [testimonials, index]);

  if (loading || count === 0) return null;

  return (
    <section className="testi-section">
      <div className="container">
        <div className="testi-head">
          <h2 className="testi-title">What Our Customers Say</h2>
          <p className="testi-subtitle">Real experiences from real Durrani Harvest customers.</p>
        </div>

        <div className="testi-carousel" onMouseEnter={pause} onMouseLeave={resume}>
          {count > 1 && (
            <button type="button" className="testi-nav testi-nav-prev" onClick={prev} aria-label="Previous testimonial">
              <ChevronLeft size={22} />
            </button>
          )}

          <div className="testi-slide" key={active.id}>
            <Quote className="testi-quote-icon" size={30} strokeWidth={1.5} />
            <StaticStars rating={active.rating} />
            <p className="testi-message">&ldquo;{active.message}&rdquo;</p>
            <div className="testi-author-row">
              {active.image ? (
                <img className="testi-avatar" src={active.image} alt={active.name} />
              ) : (
                <span className="testi-avatar testi-avatar-fallback">{initials(active.name)}</span>
              )}
              <span className="testi-author">{active.name}</span>
            </div>
          </div>

          {count > 1 && (
            <button type="button" className="testi-nav testi-nav-next" onClick={next} aria-label="Next testimonial">
              <ChevronRight size={22} />
            </button>
          )}
        </div>

        {count > 1 && (
          <div className="testi-dots" role="tablist" aria-label="Testimonials">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                className={`testi-dot ${i === index ? 'is-active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Show testimonial ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
