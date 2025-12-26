import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Ensure there are admin credentials in localStorage (default: admin / admin123)
  const ensureCreds = () => {
    const existing = localStorage.getItem('adminCreds')
    if (!existing) {
      localStorage.setItem('adminCreds', JSON.stringify({ username: 'admin', password: 'admin123' }))
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    ensureCreds()
    const creds = JSON.parse(localStorage.getItem('adminCreds'))
    if (username === creds.username && password === creds.password) {
      // simple local token to gate dashboard
      localStorage.setItem('token', 'local-admin-token')
      navigate('/dashboard')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <section className="login">
      <div className="login-form">
        <h2>Admin Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        <p style={{marginTop: '1rem', fontSize: '0.9rem'}}>Default admin: <strong>admin</strong> / <strong>admin123</strong></p>
      </div>
    </section>
  )
}
