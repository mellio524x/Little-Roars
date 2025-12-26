import React, { useEffect, useState } from 'react'

export default function Home(){
  const [price, setPrice] = useState(10)
  const [feed, setFeed] = useState([])

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('profile') || 'null')
    if (profile) {
      if (profile.prices && profile.prices.base) setPrice(profile.prices.base)
      else if (profile.price_per_hour) setPrice(profile.price_per_hour)
    }
    const posts = JSON.parse(localStorage.getItem('feedPosts') || '[]')
    setFeed(posts)
  }, [])

  return (
    <section className="home">
      <div className="hero">
        <h1>Little Roars - Cubs of Joy</h1>
        <h2>Professional Childcare You Can Trust</h2>
        <p>Expert, compassionate care for your family. Transparent scheduling, real-time updates, and a commitment to your child's safety and happiness.</p>
        <div className="hero-stats">
          <div className="stat">
            <strong>${price}</strong>
            <span>/hour</span>
          </div>
          <div className="stat">
            <strong>5pm–Late</strong>
            <span>Mon–Fri</span>
          </div>
          <div className="stat">
            <strong>Weekend</strong>
            <span>Available</span>
          </div>
        </div>
        <div className="contact-cta">
          <a href="mailto:laurianakirk04@gmail.com" className="cta">Contact Lauriana: laurianakirk04@gmail.com</a>
        </div>
      </div>
      
      <div className="hero-image-section">
        <div className="image-container">
          <img src="/Laurie.png" alt="Laurie - Professional Childcare Provider" className="hero-image" />
          <div className="image-glow"></div>
        </div>
      </div>

      <div className="features">
        <div className="card">
          <div className="card-icon">✓</div>
          <div className="card-title">Trusted</div>
          <p>Always easy to work with</p>
        </div>
        <div className="card">
          <div className="card-icon">✓</div>
          <div className="card-title">Local</div>
          <p>Your Local Baby sitter</p>
        </div>
        <div className="card">
          <div className="card-icon">✓</div>
          <div className="card-title">Flexible Scheduling</div>
          <p>Fits your family's lifestyle</p>
        </div>
      </div>
      <div className="home-feed">
        <div className="accent-sparkle s1">💖</div>
        <div className="accent-sparkle s2">🌟</div>
        <div className="accent-sparkle s3">💕</div>
        <h3>✨ Latest Updates ✨</h3>
        {feed.length === 0 ? (
          <div className="feed-empty">No updates yet — check back soon! 🌈</div>
        ) : (
          <div className="feed-list">
            {feed.slice(0,5).map((p, i) => (
              <div className="feed-item" key={i}>
                <div className={`feed-type ${p.type}`}>{p.type}</div>
                <div className="feed-body">
                  <div className="feed-title">{p.title}</div>
                  <div className="feed-content">{p.content}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
