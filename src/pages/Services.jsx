import React, { useEffect, useState } from 'react'

export default function Services(){
  const [price, setPrice] = useState(10)

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('profile') || 'null')
    if (profile) {
      if (profile.prices) setPrice(profile.prices.base)
      else if (profile.price_per_hour) setPrice(profile.price_per_hour)
    }
  }, [])

  const services = [
    {id:1, name: 'Babysitting (evenings)', key: 'evenings' },
    {id:2, name: 'Weekend Care', key: 'weekend' },
    {id:3, name: 'Date Night Special', key: 'dateNight' }
  ]
  return (
    <section className="services">
      <h2>Services & Pricing</h2>
      <ul>
        {services.map(s => {
          const profile = JSON.parse(localStorage.getItem('profile') || 'null') || {}
          const p = (profile.prices && profile.prices[s.key]) ?? price
          return <li key={s.id}>{s.name} - ${p}/hour</li>
        })}
      </ul>
    </section>
  )
}
