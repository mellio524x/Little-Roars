import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Gallery(){
  const [images, setImages] = useState([])

  useEffect(() => {
    const imgs = JSON.parse(localStorage.getItem('galleryImages') || '[]')
    setImages(imgs)
  }, [])

  return (
    <section className="gallery-page">
      <h2>Gallery</h2>
      {images.length === 0 ? (
        <div className="gallery-coming-soon">
          <div className="cs-decor">
            <span className="cs-star">✨</span>
            <span className="cs-star">🌟</span>
            <span className="cs-star">🌸</span>
          </div>
          <h3>Lovely Photos Coming Soon!</h3>
          <p className="cs-lead">We're preparing a sweet little gallery of Laurie's moments — check back soon.</p>
          <div className="cs-actions">
            <Link to="/dashboard" className="btn-primary">Upload Photos</Link>
            <Link to="/" className="btn-link">Back to Home</Link>
          </div>
        </div>
      ) : (
        <div className="gallery-grid">
          {images.map((src, idx) => (
            <div className="gallery-item" key={idx}>
              <img src={src} alt={`gallery-${idx}`} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
