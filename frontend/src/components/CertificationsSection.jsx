import React, { useEffect, useState } from 'react'
import { useShop } from './shop/ShopContext'
import './CertificationsSection.css'

const CertificationsSection = () => {
  const { siteSettings } = useShop()
  const certs = Array.isArray(siteSettings?.certifications) ? siteSettings.certifications : []
  const [zoom, setZoom] = useState(null)

  useEffect(() => {
    if (!zoom) return
    const onKey = (e) => e.key === 'Escape' && setZoom(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoom])

  if (certs.length === 0) return null

  return (
    <section className="section bg-white" id="certifications">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">Certifications</h2>
          <p className="section-subtitle">
            We prefer quality over quantity — our operations are certified in line with global health
            and food-safety standards.
          </p>
        </div>

        <div className="cert-grid">
          {certs.map((src, i) => (
            <button
              type="button"
              className="cert-item"
              key={`${src}-${i}`}
              onClick={() => setZoom(src)}
              aria-label={`View certificate ${i + 1}`}
            >
              <img src={src} alt={`Certificate ${i + 1}`} loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {zoom && (
        <div className="cert-lightbox" onClick={() => setZoom(null)} role="dialog" aria-modal="true">
          <button type="button" className="cert-lightbox-close" aria-label="Close">&times;</button>
          <img src={zoom} alt="Certificate" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  )
}

export default CertificationsSection
