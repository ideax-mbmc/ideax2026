import { useState, useEffect, useRef } from 'react'
import { testimonials } from '../utils/testimonialsData'
import './Testimonials.css'

export default function Testimonials({ onReturn }) {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)

  const startTimer = (idx) => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % testimonials.length)
    }, 4000)
  }

  useEffect(() => {
    startTimer(current)
    return () => clearInterval(timerRef.current)
  }, [current])

  const goTo = (idx) => setCurrent(idx)
  const prev = () => setCurrent((current - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((current + 1) % testimonials.length)

  const touchX = useRef(null)
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev() }
    touchX.current = null
  }

  return (
    <div className="testimonials-stage">
      <div className="crt-overlay" />
      <div className="fullscreen-vignette" />

      <div className="testimonials-container">
        <h1 className="testimonials-title">Testimonials</h1>
        <p className="testimonials-subtitle">hear from past participants</p>

        <div className="testimonials-slider">
          <button className="testimonials-arrow testimonials-arrow-left" onClick={prev} aria-label="previous">
            &#x276E;
          </button>

          <div
            className="testimonials-viewport"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="testimonials-track"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((t, i) => (
                <div key={i} className="testimonials-slide">
                  <div className="testimonials-card">
                    <div className="testimonials-card-header">
                      <img
                        className="testimonials-avatar"
                        src={t.image}
                        alt={t.name}
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                      <div>
                        <div className="testimonials-name">{t.name}</div>
                        <div className="testimonials-role">{t.role}</div>
                      </div>
                    </div>
                    <p className="testimonials-quote">{t.quote}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="testimonials-arrow testimonials-arrow-right" onClick={next} aria-label="next">
            &#x276F;
          </button>
        </div>

        <div className="testimonials-dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`testimonials-dot ${i === current ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {onReturn && (
        <button className="return-btn" onClick={onReturn}>
          &#x2190; back to terminal
        </button>
      )}
    </div>
  )
}
