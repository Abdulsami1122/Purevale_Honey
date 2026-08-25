import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import './FilterDrawer.css'

const FilterDrawer = ({
  isOpen,
  onClose,
  inStockCount = 0,
  outOfStockCount = 0,
  selectedAvailability, // 'all' | 'inStock' | 'outOfStock'
  onAvailabilityChange,
  priceRange, // [min, max]
  maxPossiblePrice = 14000,
  onPriceChange,
  onApplyFilters,
  onResetFilters
}) => {
  const [tempAvailability, setTempAvailability] = useState(selectedAvailability || 'all')
  const [tempMaxPrice, setTempMaxPrice] = useState(priceRange ? priceRange[1] : maxPossiblePrice)

  useEffect(() => {
    setTempAvailability(selectedAvailability || 'all')
    setTempMaxPrice(priceRange ? priceRange[1] : maxPossiblePrice)
  }, [selectedAvailability, priceRange, maxPossiblePrice, isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleCheckboxClick = (type) => {
    if (tempAvailability === type) {
      setTempAvailability('all')
    } else {
      setTempAvailability(type)
    }
  }

  const handleApply = () => {
    onAvailabilityChange(tempAvailability)
    onPriceChange([0, tempMaxPrice])
    if (onApplyFilters) onApplyFilters()
    onClose()
  }

  // Calculate slider percentage for active golden track fill
  const sliderPercent = Math.min(100, Math.max(0, (tempMaxPrice / maxPossiblePrice) * 100))

  return (
    <div className="filter-drawer-overlay" onClick={onClose}>
      <div className="filter-drawer" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="filter-drawer-header">
          <h2 className="filter-drawer-title">FILTER</h2>
          <button
            type="button"
            className="filter-drawer-close"
            onClick={onClose}
            aria-label="Close Filter"
          >
            <X size={22} strokeWidth={1.8} />
          </button>
        </div>

        {/* Body Content */}
        <div className="filter-drawer-body">
          
          {/* 1. Availability Section */}
          <div className="filter-group">
            <div className="filter-group-header">
              <span className="filter-underlined-title">Availability</span>
            </div>

            <div className="filter-checkbox-list">
              <label 
                className={`filter-checkbox-item ${tempAvailability === 'inStock' ? 'is-selected' : ''}`} 
                onClick={() => handleCheckboxClick('inStock')}
              >
                <div className="filter-checkbox-custom">
                  {tempAvailability === 'inStock' && <span className="filter-check-mark">✓</span>}
                </div>
                <span className="filter-checkbox-text">In Stock ({inStockCount})</span>
              </label>

              <label 
                className={`filter-checkbox-item ${tempAvailability === 'outOfStock' ? 'is-selected' : ''}`} 
                onClick={() => handleCheckboxClick('outOfStock')}
              >
                <div className="filter-checkbox-custom">
                  {tempAvailability === 'outOfStock' && <span className="filter-check-mark">✓</span>}
                </div>
                <span className="filter-checkbox-text">Out Of Stock ({outOfStockCount})</span>
              </label>
            </div>
          </div>

          {/* 2. Price Section */}
          <div className="filter-group">
            <div className="filter-group-header">
              <span className="filter-underlined-title">Price</span>
            </div>

            <div className="filter-price-slider-wrap">
              {/* Interactive Golden Slider Track */}
              <div className="filter-slider-track-container">
                <input
                  type="range"
                  min="500"
                  max={maxPossiblePrice}
                  step="100"
                  value={tempMaxPrice}
                  onChange={(e) => setTempMaxPrice(Number(e.target.value))}
                  style={{
                    background: `linear-gradient(to right, #EAA82C 0%, #EAA82C ${sliderPercent}%, #E0E0E0 ${sliderPercent}%, #E0E0E0 100%)`
                  }}
                  className="filter-range-input"
                />
              </div>

              {/* Price Label */}
              <div className="filter-price-label">
                Price: <strong>Rs.0.00</strong> — <strong>Rs.{tempMaxPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
              </div>

              {/* Filter Submit Button */}
              <button
                type="button"
                className="filter-apply-pill-btn"
                onClick={handleApply}
              >
                FILTER
              </button>

              {(tempAvailability !== 'all' || tempMaxPrice < maxPossiblePrice) && (
                <button
                  type="button"
                  className="filter-reset-text-btn"
                  onClick={() => {
                    setTempAvailability('all')
                    setTempMaxPrice(maxPossiblePrice)
                    onResetFilters()
                    onClose()
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default FilterDrawer
