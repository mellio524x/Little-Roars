import React, { useEffect, useState } from 'react'

export default function Contact(){
  const [bio, setBio] = useState('')

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('profile') || 'null')
    if (profile && profile.bio) setBio(profile.bio)
    else setBio(`Laurie is a sweet, responsible caregiver who absolutely loves helping others. She’s exceptional with children — patient, playful, and wonderfully nurturing. A confident multitasker, Laurie stays calm and positive even during busy, noisy moments. She treats every child with warmth and care, creating a safe, joyful environment for them to thrive.`)
  }, [])

  return (
    <section className="contact">
      <h2>Get in Touch</h2>

      <div className="contact-decor" aria-hidden>
        <span className="sparkle" style={{left: '8%', top: '18%'}}></span>
        <span className="sparkle" style={{left: '22%', top: '64%'}}></span>
        <span className="sparkle" style={{left: '76%', top: '24%'}}></span>
        <span className="sparkle" style={{left: '62%', top: '72%'}}></span>
      </div>

      <div className="bio bio-cute contact-hero">
        <p>{bio}</p>
        <p className="direct-email">Email: <a href="mailto:laurianakirk04@gmail.com">laurianakirk04@gmail.com</a></p>
      </div>
    </section>
  )
}
