import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, CheckCircle2 } from 'lucide-react'
import './Pages.css'

const cosmeticsProducts = [
  {
    id: 'honey-beeswax-lip-balm',
    title: 'Natural Honey & Beeswax Lip Balm',
    price: 650,
    rating: 5,
    reviews: 14,
    description: 'Enriched with raw organic honey, royal jelly, and pure beeswax for deeply hydrated lips.'
  },
  {
    id: 'raw-honey-face-glow-mask',
    title: 'Pure Sidr Honey Face Glow Mask',
    price: 1850,
    rating: 4.8,
    reviews: 22,
    description: 'Natural enzyme-rich antibacterial face mask for radiant, clear, and glowing skin.'
  },
  {
    id: 'black-seed-hair-oil',
    title: 'Organic Black Seed & Honey Hair Elixir',
    price: 1450,
    rating: 5,
    reviews: 19,
    description: 'Cold-pressed Kalonji oil infused with botanical herbs to strengthen hair roots.'
  },
  {
    id: 'propolis-healing-salve',
    title: 'Bee Propolis Skin Healing Salve',
    price: 1250,
    rating: 4.9,
    reviews: 9,
    description: 'Potent natural remedy for soothing dry patches, eczema, and skin irritation.'
  }
]

const CosmeticsPage = () => {
  return (
    <div className="page-container">
      <div className="page-hero-banner">
        <div className="page-breadcrumbs">
          <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>Natural Cosmetics</span>
        </div>
        <h1 className="page-hero-title">Purevale Natural Cosmetics & Beauty</h1>
        <p className="page-hero-subtitle">
          Pure honey, royal jelly, and beeswax-infused skincare crafted directly from nature's purest harvest.
        </p>
      </div>

      <div className="page-content-wrapper">
        <div className="info-section-card">
          <h2>100% Organic & Chemical-Free Beauty</h2>
          <p>
            Our natural cosmetic line harnesses the bio-active antioxidants of raw wild honey, golden beeswax, and soothing herbal botanicals. Formulated with zero parabens, artificial fragrances, or harsh petrochemicals.
          </p>
          <ul className="info-list-styled">
            <li>
              <strong><CheckCircle2 size={16} color="#133827" style={{display: 'inline', marginRight: '6px'}} /> Bio-Active Bee Propolis:</strong> Promotes cellular repair and anti-aging protection.
            </li>
            <li>
              <strong><CheckCircle2 size={16} color="#133827" style={{display: 'inline', marginRight: '6px'}} /> Cold-Pressed Botanical Oils:</strong> Rich in essential fatty acids and Vitamin E.
            </li>
            <li>
              <strong><CheckCircle2 size={16} color="#133827" style={{display: 'inline', marginRight: '6px'}} /> Pure Mountain Beeswax:</strong> Creates a breathable protective moisture barrier.
            </li>
          </ul>
        </div>

        <div style={{marginTop: '2.5rem'}}>
          <h2 style={{fontSize: '1.6rem', color: '#133827', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)'}}>
            Featured Honey Cosmetics
          </h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem'}}>
            {cosmeticsProducts.map((item) => (
              <div key={item.id} style={{background: '#FFFFFF', padding: '1.5rem', borderRadius: '14px', border: '1px solid #EAEAEA', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <div>
                  <span style={{fontSize: '2rem', display: 'block', marginBottom: '0.5rem'}}>✨</span>
                  <h3 style={{fontSize: '1.1rem', color: '#133827', marginBottom: '0.4rem'}}>{item.title}</h3>
                  <p style={{fontSize: '0.88rem', color: '#666666', lineHeight: '1.45', marginBottom: '1rem'}}>{item.description}</p>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F0F0F0', paddingTop: '0.85rem'}}>
                  <span style={{fontSize: '1.1rem', fontWeight: '700', color: '#133827'}}>Rs.{item.price.toLocaleString()}</span>
                  <a href="https://wa.me/923339300672?text=Hello%20Purevale,%20I%20want%20to%20order%20Cosmetic:%20" target="_blank" rel="noreferrer" className="btn btn-primary" style={{padding: '0.45rem 0.9rem', fontSize: '0.8rem'}}>Order</a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default CosmeticsPage
