import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

export default function Dashboard(){
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [pricePerHour, setPricePerHour] = useState(10)
  const [priceBase, setPriceBase] = useState(10)
  const [priceEvenings, setPriceEvenings] = useState(10)
  const [priceWeekend, setPriceWeekend] = useState(10)
  const [priceDateNight, setPriceDateNight] = useState(10)
  const [bio, setBio] = useState('')
  const [availabilityNotes, setAvailabilityNotes] = useState('')
  const [profileImage, setProfileImage] = useState(null)
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState({}) // { 'YYYY-MM-DD': { type: 'booked'|'available', note: '...' } }
  const [selectedDate, setSelectedDate] = useState(null)
  const [eventType, setEventType] = useState('booked')
  const [eventNote, setEventNote] = useState('')
  const [feedPosts, setFeedPosts] = useState([])
  const [postTitle, setPostTitle] = useState('')
  const [postTypeEditor, setPostTypeEditor] = useState('update')
  const [postContent, setPostContent] = useState('')
  const [editingIndex, setEditingIndex] = useState(-1)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    // load local profile
    const profile = JSON.parse(localStorage.getItem('profile') || 'null')
    if (profile) {
      setPricePerHour(profile.price_per_hour || 10)
      setAvailabilityNotes(profile.availability_notes || '')
      setProfileImage(profile.profileImage || null)
      const p = profile.prices || {}
      setPriceBase(p.base ?? profile.price_per_hour ?? 10)
      setPriceEvenings(p.evenings ?? profile.price_per_hour ?? 10)
      setPriceWeekend(p.weekend ?? profile.price_per_hour ?? 10)
      setPriceDateNight(p.dateNight ?? profile.price_per_hour ?? 10)
      setBio(profile.bio || '')
    }
    const galleryImages = JSON.parse(localStorage.getItem('galleryImages') || '[]')
    setGallery(galleryImages)
    const stored = JSON.parse(localStorage.getItem('calendarEvents') || '{}')
    setEvents(stored)
    const posts = JSON.parse(localStorage.getItem('feedPosts') || '[]')
    setFeedPosts(posts)
    setLoading(false)
  }, [token, navigate])

  const handleSaveProfile = () => {
    const profile = {
      price_per_hour: pricePerHour,
      availability_notes: availabilityNotes,
      profileImage,
      prices: {
        base: Number(priceBase) || 0,
        evenings: Number(priceEvenings) || 0,
        weekend: Number(priceWeekend) || 0,
        dateNight: Number(priceDateNight) || 0,
      }
    }
    profile.bio = bio
    localStorage.setItem('profile', JSON.stringify(profile))
    alert('Profile updated!')
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      // save to gallery
      const images = JSON.parse(localStorage.getItem('galleryImages') || '[]')
      images.unshift(dataUrl)
      localStorage.setItem('galleryImages', JSON.stringify(images))
      setGallery(images)
      setProfileImage(dataUrl)
      alert('Image saved to gallery!')
    }
    reader.readAsDataURL(file)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const dateKey = (d) => {
    const y = d.getFullYear()
    const m = String(d.getMonth()+1).padStart(2,'0')
    const day = String(d.getDate()).padStart(2,'0')
    return `${y}-${m}-${day}`
  }

  const handleDayClick = (date) => {
    const key = dateKey(date)
    setSelectedDate(key)
    const ev = events[key]
    setEventType(ev ? ev.type : 'booked')
    setEventNote(ev ? ev.note : '')
  }

  const saveEvent = () => {
    if (!selectedDate) return alert('Select a date')
    const updated = {...events, [selectedDate]: { type: eventType, note: eventNote }}
    setEvents(updated)
    localStorage.setItem('calendarEvents', JSON.stringify(updated))
    alert('Saved')
  }

  const removeEvent = (key) => {
    const copy = {...events}
    delete copy[key]
    setEvents(copy)
    localStorage.setItem('calendarEvents', JSON.stringify(copy))
  }

  const savePost = () => {
    if (!postTitle.trim() || !postContent.trim()) return alert('Please enter title and content')
    const post = { title: postTitle.trim(), type: postTypeEditor, content: postContent.trim(), created: new Date().toISOString() }
    let updated = []
    if (editingIndex >= 0) {
      updated = [...feedPosts]
      updated[editingIndex] = post
    } else {
      updated = [post, ...feedPosts]
    }
    setFeedPosts(updated)
    localStorage.setItem('feedPosts', JSON.stringify(updated))
    setPostTitle('')
    setPostContent('')
    setPostTypeEditor('update')
    setEditingIndex(-1)
  }

  const editPost = (i) => {
    const p = feedPosts[i]
    setPostTitle(p.title)
    setPostContent(p.content)
    setPostTypeEditor(p.type)
    setEditingIndex(i)
  }

  const deletePost = (i) => {
    if (!confirm('Delete this post?')) return
    const copy = [...feedPosts]
    copy.splice(i,1)
    setFeedPosts(copy)
    localStorage.setItem('feedPosts', JSON.stringify(copy))
  }

  if (loading) return <div>Loading...</div>

  function AdminAccount(){
    const [adminUser, setAdminUser] = useState('')
    const [adminPass, setAdminPass] = useState('')

    useEffect(() => {
      const creds = JSON.parse(localStorage.getItem('adminCreds') || 'null')
      if (creds) {
        setAdminUser(creds.username || '')
        setAdminPass(creds.password || '')
      }
    }, [])

    const handleSaveCreds = () => {
      if (!adminUser || !adminPass) {
        alert('Username and password cannot be empty')
        return
      }
      localStorage.setItem('adminCreds', JSON.stringify({ username: adminUser, password: adminPass }))
      alert('Admin credentials updated')
    }

    return (
      <div>
        <div className="form-group">
          <label>Admin Username:</label>
          <input type="text" value={adminUser} onChange={e => setAdminUser(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Admin Password:</label>
          <input type="text" value={adminPass} onChange={e => setAdminPass(e.target.value)} />
        </div>
        <button onClick={handleSaveCreds}>Save Admin Account</button>
      </div>
    )
  }

  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <h3>Profile & Pricing</h3>
          <div className="form-group">
            <label>Base Price ($):</label>
            <input type="number" value={priceBase} onChange={e => setPriceBase(e.target.value)} step="0.5" />
          </div>
          <div className="form-group">
            <label>Evenings Price ($):</label>
            <input type="number" value={priceEvenings} onChange={e => setPriceEvenings(e.target.value)} step="0.5" />
          </div>
          <div className="form-group">
            <label>Weekend Price ($):</label>
            <input type="number" value={priceWeekend} onChange={e => setPriceWeekend(e.target.value)} step="0.5" />
          </div>
          <div className="form-group">
            <label>Date Night Special ($):</label>
            <input type="number" value={priceDateNight} onChange={e => setPriceDateNight(e.target.value)} step="0.5" />
          </div>
          <div className="form-group">
            <label>Availability Notes:</label>
            <textarea value={availabilityNotes} onChange={e => setAvailabilityNotes(e.target.value)}></textarea>
          </div>
          <div className="form-group">
            <label>Contact Page Bio:</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={6} placeholder="Write a short, friendly bio that appears on the Contact page" />
          </div>
          <button onClick={handleSaveProfile}>Save Profile</button>
        </div>

        <div className="panel">
          <h3>Upload Images (adds to Gallery)</h3>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {profileImage && <img src={profileImage} alt="Profile" style={{maxWidth: '200px', marginTop: '1rem'}} />}
        </div>

        <div className="panel">
          <h3>Gallery Preview</h3>
          <div className="gallery-preview">
            {gallery.length === 0 && <p>No images yet.</p>}
            {gallery.slice(0,6).map((img, idx) => (
              <img key={idx} src={img} alt={`img-${idx}`} />
            ))}
          </div>
        </div>

        <div className="panel">
          <h3>Admin Account</h3>
          <AdminAccount />
        </div>

        <div className="panel">
          <h3>Feed / Updates</h3>
          <div className="form-group">
            <label>Title</label>
            <input value={postTitle} onChange={e=>setPostTitle(e.target.value)} placeholder="Short headline" />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select value={postTypeEditor} onChange={e=>setPostTypeEditor(e.target.value)}>
              <option value="update">Update</option>
              <option value="sale">Sale</option>
              <option value="event">Event</option>
            </select>
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea value={postContent} onChange={e=>setPostContent(e.target.value)} rows={4} />
          </div>
          <div style={{display:'flex', gap:8}}>
            <button onClick={savePost}>{editingIndex>=0? 'Save Changes' : 'Publish'}</button>
            {editingIndex>=0 && <button onClick={()=>{ setEditingIndex(-1); setPostTitle(''); setPostContent(''); setPostTypeEditor('update') }}>Cancel</button>}
          </div>

          <div style={{marginTop:12}}>
            {feedPosts.length===0 && <div>No posts yet.</div>}
            {feedPosts.map((p, i) => (
              <div key={i} style={{padding:'0.5rem 0', borderBottom:'1px solid rgba(0,0,0,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                  <div style={{fontWeight:800}}>{p.title} <small style={{fontWeight:700, color:'#666', marginLeft:8}}>({p.type})</small></div>
                  <div style={{fontSize:'0.95rem', color:'#444'}}>{p.content}</div>
                </div>
                <div>
                  <button onClick={()=>editPost(i)}>Edit</button>
                  <button onClick={()=>deletePost(i)} style={{marginLeft:8}}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3>Calendar</h3>
          <Calendar onClickDay={handleDayClick}
            tileContent={({date, view}) => {
              const key = dateKey(date)
              const ev = events[key]
              if (!ev) return null
              const color = ev.type === 'booked' ? '#D63447' : '#00D4FF'
              return (<div style={{marginTop:4}}><span style={{display:'inline-block', width:10, height:10, background: color, borderRadius:6, boxShadow:'0 2px 6px rgba(0,0,0,0.12)'}}></span></div>)
            }}
          />
          <p style={{marginTop: '1rem', fontSize: '0.9rem'}}>Click a date to add a booking or mark available.</p>

          <div style={{marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap:'wrap'}}>
            <div style={{minWidth: 220}}>
              <label style={{fontWeight:800}}>Selected Date</label>
              <div style={{padding:'0.6rem 0.5rem', background:'#fff', borderRadius:8, marginTop:6}}>{selectedDate || '— pick a date'}</div>
            </div>
            <div style={{minWidth:220}}>
              <label style={{fontWeight:800}}>Type</label>
              <select value={eventType} onChange={e => setEventType(e.target.value)} style={{width:'100%', padding:'0.5rem', marginTop:6}}>
                <option value="booked">Booked (job)</option>
                <option value="available">Available</option>
              </select>
            </div>
          </div>
          <div style={{marginTop:12}}>
            <label style={{fontWeight:800}}>Note (optional)</label>
            <textarea value={eventNote} onChange={e => setEventNote(e.target.value)} style={{width:'100%', padding:'0.6rem', marginTop:6, borderRadius:8}} />
          </div>
          <div style={{marginTop:10, display:'flex', gap:8}}>
            <button onClick={saveEvent}>Save Date</button>
            <button onClick={() => { if (!selectedDate) return alert('Select a date'); removeEvent(selectedDate); setSelectedDate(null); }}>Remove Date</button>
          </div>

          <div style={{marginTop:16}}>
            <h4 style={{marginBottom:8}}>Upcoming marked dates</h4>
            {Object.keys(events).length === 0 && <div>No dates marked yet.</div>}
            {Object.entries(events).sort().map(([k,v]) => (
              <div key={k} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.5rem 0', borderBottom:'1px solid rgba(0,0,0,0.04)'}}>
                <div>
                  <div style={{fontWeight:800}}>{k} — {v.type}</div>
                  {v.note && <div style={{fontSize:'0.9rem', color:'#444'}}>{v.note}</div>}
                </div>
                <div>
                  <button onClick={() => { setSelectedDate(k); setEventType(v.type); setEventNote(v.note || '') }}>Edit</button>
                  <button onClick={() => removeEvent(k)} style={{marginLeft:8}}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
