import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PhoneCall } from 'lucide-react'
import './FaqPage.css'

const FAQ_SECTIONS = [
  {
    category: 'Honey FAQ,s',
    subtitle: 'Frequently ask questions',
    items: [
      {
        id: 'honey-1',
        question: 'Can excess use of multiflower honey causes diabetes or rise sugar level in blood?',
        answer: 'Yes ofcourse, because multiflower honey has high levels of fructose and glucose that would ultimately causes the blood sugar level to spike.',
      },
      {
        id: 'honey-2',
        question: 'For skin allergies what product can be used Russian white honey or any sidr honey?',
        answer: 'Sidr honey is widely recommended for skin allergies due to its strong antibacterial and anti-inflammatory properties. Russian white honey can also be applied as a gentle soothing topical moisturizer.',
      },
      {
        id: 'honey-3',
        question: 'A patient undergoing dialysis can use sidr honey?',
        answer: 'Patients undergoing dialysis should strictly consult their nephrologist before consuming honey, as potassium and fluid intake need careful regulation.',
      },
      {
        id: 'honey-4',
        question: 'Why don’t have honey comb in sidr?',
        answer: 'Sidr honey is harvested during a very specific, short blossoming window of the Beri tree where liquid extraction ensures preservation of purity, whereas comb honey requires longer continuous hives.',
      },
      {
        id: 'honey-5',
        question: 'Ginger honey can be used by the patients with high uric acid levels or not?',
        answer: 'Yes, ginger honey has natural anti-inflammatory properties that can assist in reducing uric acid inflammation, but should be consumed in moderate daily quantities.',
      },
    ],
  },
  {
    category: 'Mixed Honey FAQ,S',
    subtitle: 'Frequently ask questions',
    items: [
      {
        id: 'mixed-1',
        question: 'Does blessed honey helps in liver improvement?',
        answer: 'Yes, because of its anti-inflammatory & antioxidant properties, honey is beneficial for improving liver disorders.',
      },
      {
        id: 'mixed-2',
        question: 'Does kalonji affect the liver and kidneys due to its warm nature?',
        answer: 'When taken in recommended dietary doses, Kalonji (Black Seed) supports organ detox. However, excessive unsupervised intake should be avoided.',
      },
      {
        id: 'mixed-3',
        question: 'What can patient with asthma and diabetes use instead of blessed honey?',
        answer: 'Patients with asthma and diabetes can consult our herbalists for sugar-free herbal formulations, pure black seed oil drops, and controlled micro-doses.',
      },
      {
        id: 'mixed-4',
        question: 'If a patient has genetically inherited asthma, can it be permanently cured with blessed honey?',
        answer: 'While it provides strong symptomatic relief, clears respiratory congestion, and boosts immunity, chronic genetic asthma requires holistic long-term care.',
      },
      {
        id: 'mixed-5',
        question: 'Does Moringa honey a permanent solution of piles?',
        answer: 'Moringa honey assists digestive motility, softens stools, and reduces vascular inflammation, significantly relieving piles symptoms over regular use.',
      },
    ],
  },
  {
    category: 'Dates FAQ,s',
    subtitle: 'Frequently ask questions',
    items: [
      {
        id: 'dates-1',
        question: 'Costly?',
        answer: 'Premium imported Ajwa and Medjool dates are carefully graded for size, moisture, and freshness without chemical preservatives, justifying their high nutritional value.',
      },
      {
        id: 'dates-2',
        question: 'Why Ajwa dates in large size?',
        answer: 'Our large size Ajwa dates are Grade-A jumbo picks sourced directly from trusted orchards in Madinah Munawwarah, offering meatier texture and richer flavor.',
      },
    ],
  },
]

const FaqPage = () => {
  // By default, open the first question of Honey FAQ and Mixed Honey FAQ just like in the screenshots!
  const [openItems, setOpenItems] = useState({
    'honey-1': true,
    'mixed-1': true,
  })

  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="faq-page-container">
      {/* Top Banner */}
      <div className="page-hero-banner">
        <div className="page-breadcrumbs">
          <Link to="/">Home</Link> / <span>Frequently Asked Questions</span>
        </div>
        <h1 className="page-hero-title">Frequently Asked Questions</h1>
        <p className="page-hero-subtitle">
          Find answers about our pure raw honeys, dates, and herbal wellness remedies.
        </p>
      </div>

      {/* Main FAQ Content */}
      <div className="faq-content-wrap">
        {FAQ_SECTIONS.map((section, sIdx) => (
          <div key={sIdx} className="faq-category-block">
            
            {/* Centered Heading with side horizontal lines */}
            <div className="faq-title-header">
              <span className="faq-side-rule"></span>
              <h2 className="faq-category-title">{section.category}</h2>
              <span className="faq-side-rule"></span>
            </div>
            <p className="faq-category-subtitle">{section.subtitle}</p>

            {/* Accordion List */}
            <div className="faq-accordion-list">
              {section.items.map((item) => {
                const isOpen = !!openItems[item.id]
                return (
                  <div 
                    key={item.id} 
                    className={`faq-accordion-card ${isOpen ? 'is-expanded' : ''}`}
                  >
                    <button
                      type="button"
                      className="faq-question-btn"
                      onClick={() => toggleItem(item.id)}
                      aria-expanded={isOpen}
                    >
                      <span className="faq-question-label">{item.question}</span>
                      <span className="faq-toggle-icon-wrap">
                        {isOpen ? (
                          <span className="faq-icon-minus">−</span>
                        ) : (
                          <span className="faq-icon-plus">+</span>
                        )}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="faq-answer-pane">
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

          </div>
        ))}

        {/* Contact Support Footer Box */}
        <div className="faq-helpline-box">
          <h3>Need More Information?</h3>
          <p>Our wellness specialists in Hayatabad, Peshawar are here to help you select the right honey and dosage.</p>
          <div className="faq-helpline-actions">
            <a href="tel:+923339300672" className="btn btn-primary">
              <PhoneCall size={18} style={{marginRight: '6px'}} /> Call: 0333 9300672
            </a>
            <a 
              href="https://wa.me/923339300672" 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-gold"
            >
              WhatsApp: 0333 9300672
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}

export default FaqPage
