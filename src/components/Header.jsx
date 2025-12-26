import React from 'react'
import { Link } from 'react-router-dom'

export default function Header(){
  return (
    <header className="site-header">
      <div className="brand">Little Roars - Cubs of Joy</div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/gallery">Gallery</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  )
}
