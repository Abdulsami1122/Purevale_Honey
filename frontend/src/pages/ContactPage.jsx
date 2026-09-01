import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Send, Clock } from 'lucide-react'
import './Pages.css'

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setForm({ name: '', phone: '', email: '', message: '' })
    }, 4000)
  }

  return (
    <div className="page-container">
      <div className="page-hero-banner">
        <div className="page-breadcrumbs">
          <Link to="/">Home</Link> / <span>Contact Us</span>
        </div>
        <h1 className="page-hero-title">Get in Touch With Durrani Harvest</h1>
        <p className="page-hero-subtitle">
          Have questions about our products, retail orders, or bulk export? Our Hayatabad Peshawar team is here to assist you.
        </p>
      </div>

      <div className="page-content-wrapper">
        <div className="contact-page-grid">
          {/* Contact Details */}
          <div className="contact-info-cards">
            <div className="contact-card-box">
              <div className="contact-icon-bubble">
                <MapPin size={24} />
              </div>
              <div className="contact-card-text">
                <h4>Main Office & Dispatch</h4>
                <p>Hayatabad, Peshawar, Khyber Pakhtunkhwa, Pakistan</p>
              </div>
            </div>

            <div className="contact-card-box">
              <div className="contact-icon-bubble">
                <Phone size={24} />
              </div>
              <div className="contact-card-text">
                <h4>Customer Support & Orders</h4>
                <p><a href="tel:+923339300672">+92 333 9300672</a></p>
                <p><a href="https://wa.me/923339300672" target="_blank" rel="noreferrer" style={{color: '#25D366', fontWeight: '600'}}>WhatsApp: 0333 9300672</a></p>
              </div>
            </div>

            <div className="contact-card-box">
              <div className="contact-icon-bubble">
                <Mail size={24} />
              </div>
              <div className="contact-card-text">
                <h4>Email Inquiries</h4>
                <p><a href="mailto:support@durraniharvest.com">support@durraniharvest.com</a></p>
              </div>
            </div>

            <div className="contact-card-box">
              <div className="contact-icon-bubble">
                <Clock size={24} />
              </div>
              <div className="contact-card-text">
                <h4>Working Hours</h4>
                <p>Monday – Saturday: 9:00 AM – 8:00 PM PKT</p>
                <p>Fast 24-hour dispatch for online orders</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-panel">
            <h3>Send Us a Direct Message</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="contact-input-field"
                placeholder="Full Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                type="tel"
                className="contact-input-field"
                placeholder="Phone Number (e.g. 0333 9300672)"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <input
                type="email"
                className="contact-input-field"
                placeholder="Email Address"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <textarea
                className="contact-input-field"
                rows="4"
                placeholder="How can we assist you with Durrani Harvest products?"
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              ></textarea>

              <button type="submit" className="contact-btn-submit">
                <Send size={18} /> Send Message
              </button>

              {sent && (
                <div className="contact-success-box">
                  ✓ Thank you! Your message has been sent. Our team in Hayatabad, Peshawar will contact you via phone or WhatsApp shortly.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
