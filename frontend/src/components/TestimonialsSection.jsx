import React, { useEffect, useMemo, useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../lib/api';
import './TestimonialsSection.css';

const AUTOPLAY_MS = 6000;

const Stars = ({ rating }) => (
  <div className="testi-stars" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        className="testi-star"
        style={{ '--i': n }}
        size={18}
        fill={n <= rating ? 'currentColor' : 'none'}
        strokeWidth={1.6}
      />
    ))}
  </div>
);

const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || '?';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState('next');
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    api
      .listTestimonials()
      .then((d) => setTestimonials(d.testimonials || []))
      .finally(() => setLoading(false));
  }, []);

  const count = testimonials.length;

  const goTo = (i, direction) => {
    const target = ((i % count) + count) % count;
    setDir(direction || (target > index ? 'next' : 'prev'));
    setIndex(target);
  };
  const next = () => goTo(index + 1, 'next');
  const prev = () => goTo(index - 1, 'prev');

  // Autoplay — restarts on every slide change, halts on hover / when only 1 slide.
  useEffect(() => {
    if (count < 2 || paused) return undefined;
    const t = setTimeout(() => {
      setDir('next');
      setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [count, paused, index]);

  const active = useMemo(() => testimonials[index], [testimonials, index]);

  if (loading || count === 0) return null;

  return (
    <section className="testi-section">
      <div className="container">
        <div className="testi-head">
          <span className="testi-kicker">Testimonials</span>
          <h2 className="testi-title">What Our Customers Say</h2>
          <p className="testi-subtitle">Real experiences from real Durrani Harvest customers.</p>
        </div>

        <div
          className="testi-carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {count > 1 && (
            <button type="button" className="testi-nav testi-nav-prev" onClick={prev} aria-label="Previous testimonial">
              <ChevronLeft size={22} />
            </button>
          )}

          <div className={`testi-slide testi-slide--${dir}`} key={active.id}>
            <span className="testi-bigquote" aria-hidden="true">&ldquo;</span>

            <Stars rating={active.rating} />

            <p className="testi-message">{active.message}</p>

            <span className="testi-divider" aria-hidden="true" />

            <div className="testi-author-row">
              {active.image ? (
                <img className="testi-avatar" src={active.image} alt={active.name} />
              ) : (
                <span className="testi-avatar testi-avatar-fallback">{initials(active.name)}</span>
              )}
              <span className="testi-author">
                <strong>{active.name}</strong>
                <span className="testi-author-sub">Verified customer</span>
              </span>
            </div>

            {count > 1 && (
              <span
                className="testi-progress"
                key={`p-${index}-${paused}`}
                style={{ animationPlayState: paused ? 'paused' : 'running' }}
                aria-hidden="true"
              />
            )}
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
