import React, { useState } from 'react'
import { CheckCircle2, MapPin } from 'lucide-react'
import './NetworkSection.css'

const GLOBAL_PINS = [
  { id: 'us', name: 'USA', city: 'Boston / New York', top: '35%', left: '57%' },
  { id: 'ca', name: 'Canada', city: 'Toronto', top: '27%', left: '62%' },
  { id: 'uk', name: 'United Kingdom', city: 'Birmingham / London', top: '33%', left: '71%' },
  { id: 'sa', name: 'Saudi Arabia', city: 'Jeddah / Riyadh', top: '48%', left: '79%' },
  { id: 'uae', name: 'UAE & Bahrain', city: 'Dubai / Manama', top: '47%', left: '82%' },
  { id: 'au', name: 'Australia', city: 'Adelaide / Sydney', top: '64%', left: '91%' },
  { id: 'pk-hq', name: 'Peshawar (HQ)', city: 'Hayatabad Central Hub', top: '32%', left: '29%', isHQ: true },
  { id: 'pk-isb', name: 'Islamabad', city: 'Federal Capital', top: '37%', left: '33%' },
  { id: 'pk-lhr', name: 'Lahore', city: 'Punjab Hub', top: '44%', left: '36%' },
  { id: 'pk-khi', name: 'Karachi', city: 'Port & Southern Hub', top: '74%', left: '17%' },
  { id: 'pk-qta', name: 'Quetta', city: 'Balochistan Hub', top: '51%', left: '17%' },
]

const NetworkSection = () => {
  const [activePin, setActivePin] = useState(null)

  return (
    <section className="network-section section" id="our-network">
      <div className="container">
        
        {/* 1. Header (Centered Title, Text Directly Down Below) */}
        <div className="network-heading-wrap">
          <div className="network-title-row">
            <span className="network-line" />
            <h2 className="network-title">Our Network</h2>
            <span className="network-line" />
          </div>
          <p className="network-subtitle">
            In our years of pure dedication, we have built an extensive network across the globe. Living up to the expectations, our unmatched quality and customer care have led to a family of millions of customers out of Pakistan as well. Our branded outlets are based in Pakistan but we have wholesale presence worldwide.
          </p>
        </div>

        {/* 2. Proper Visual Map Display with Interactive Pins & Pulses */}
        <div className="network-map-stage">
          <div className="network-map-wrapper">
            <img
              src="/network-map.jpg"
              alt="Purevale Global Network - Pakistan to Worldwide Destinations"
              className="network-map-image"
            />

            {/* Interactive Pulse Hotspots */}
            {GLOBAL_PINS.map((pin) => (
              <div
                key={pin.id}
                className={`network-hotspot ${pin.isHQ ? 'is-hq' : ''} ${activePin === pin.id ? 'is-hovered' : ''}`}
                style={{ top: pin.top, left: pin.left }}
                onMouseEnter={() => setActivePin(pin.id)}
                onMouseLeave={() => setActivePin(null)}
              >
                <div className="hotspot-pulse" />
                <div className="hotspot-marker">
                  <MapPin size={pin.isHQ ? 16 : 12} strokeWidth={2.4} />
                </div>
                
                {/* Tooltip */}
                <div className="hotspot-tooltip">
                  <strong>{pin.name}</strong>
                  <span>{pin.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Bottom Key Highlights Bar */}
        <div className="network-stats-strip">
          <div className="network-stat-item">
            <div className="network-check-circle">
              <CheckCircle2 size={22} />
            </div>
            <span><strong>50+</strong> Branded Outlets</span>
          </div>

          <div className="network-stat-item">
            <div className="network-check-circle">
              <CheckCircle2 size={22} />
            </div>
            <span><strong>10 Years</strong> of Experience</span>
          </div>

          <div className="network-stat-item">
            <div className="network-check-circle">
              <CheckCircle2 size={22} />
            </div>
            <span>Reaching <strong>10K</strong> Customers Every Month</span>
          </div>
        </div>

      </div>
    </section>
  )
}

export default NetworkSection
