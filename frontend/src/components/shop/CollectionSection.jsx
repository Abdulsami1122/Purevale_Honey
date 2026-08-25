import React, { useState, useMemo } from 'react'
import { X } from 'lucide-react'
import Toolbar from './Toolbar'
import ProductGrid from './ProductGrid'
import FilterDrawer from './FilterDrawer'
import './CollectionSection.css'

const PAGE_SIZE = 8

const CollectionSection = ({ id, title, subtitle, products = [] }) => {
  const [columns, setColumns] = useState(4)
  const [viewId, setViewId] = useState('4')
  const [sort, setSort] = useState('featured')
  const [visible, setVisible] = useState(PAGE_SIZE)
  
  // Calculate max price from available products in this collection
  const maxCollectionPrice = useMemo(() => {
    if (!products.length) return 14000
    const highest = Math.max(...products.map((p) => p.priceMax || p.priceMin || 1000))
    return Math.ceil(highest / 1000) * 1000 || 14000
  }, [products])

  // Filter States
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [availability, setAvailability] = useState('all') // 'all' | 'inStock' | 'outOfStock'
  const [priceRange, setPriceRange] = useState([0, maxCollectionPrice])

  // Compute In-Stock and Out-Of-Stock counts
  const inStockCount = useMemo(() => {
    return products.filter((p) => p.available !== false).length
  }, [products])

  const outOfStockCount = useMemo(() => {
    return products.filter((p) => p.available === false).length
  }, [products])

  // Filter & Sort Products
  const filteredAndSorted = useMemo(() => {
    return products
      .filter((p) => {
        // Availability Filter
        if (availability === 'inStock' && p.available === false) return false
        if (availability === 'outOfStock' && p.available !== false) return false
        
        // Price Filter (check if minimum price is within upper range)
        if (p.priceMin > priceRange[1]) return false
        return true
      })
      .sort((a, b) => {
        if (sort === 'price-asc') return a.priceMin - b.priceMin
        if (sort === 'price-desc') return b.priceMin - a.priceMin
        if (sort === 'best-selling') return (b.reviews || 0) - (a.reviews || 0)
        if (sort === 'newest') return (b.featured || 0) - (a.featured || 0)
        return (a.featured || 0) - (b.featured || 0)
      })
  }, [products, availability, priceRange, sort])

  const visibleProducts = filteredAndSorted.slice(0, visible)
  const hasMore = visible < filteredAndSorted.length
  const hasActiveFilter = availability !== 'all' || priceRange[1] < maxCollectionPrice

  const handleResetFilters = () => {
    setAvailability('all')
    setPriceRange([0, maxCollectionPrice])
  }

  return (
    <section className="collection-section section" id={id}>
      <div className="container">
        <div className="collection-heading">
          <span className="collection-heading-line" />
          <h2>{title}</h2>
          <span className="collection-heading-line" />
        </div>
        {subtitle && <p className="collection-subtitle">{subtitle}</p>}

        <Toolbar
          activeView={viewId}
          onViewChange={(cols, view) => {
            setColumns(cols)
            setViewId(view)
          }}
          sort={sort}
          onSortChange={setSort}
          onOpenFilter={() => setIsFilterOpen(true)}
          hasActiveFilter={hasActiveFilter}
        />

        {/* Active Filter Chips / Badges */}
        {hasActiveFilter && (
          <div className="collection-active-chips">
            <span className="collection-chips-label">Active Filters:</span>
            {availability === 'inStock' && (
              <button 
                type="button" 
                className="collection-chip"
                onClick={() => setAvailability('all')}
              >
                In Stock <X size={14} />
              </button>
            )}
            {availability === 'outOfStock' && (
              <button 
                type="button" 
                className="collection-chip"
                onClick={() => setAvailability('all')}
              >
                Out of Stock <X size={14} />
              </button>
            )}
            {priceRange[1] < maxCollectionPrice && (
              <button 
                type="button" 
                className="collection-chip"
                onClick={() => setPriceRange([0, maxCollectionPrice])}
              >
                Max Price: Rs.{priceRange[1].toLocaleString()} <X size={14} />
              </button>
            )}
            <button 
              type="button" 
              className="collection-chip-clear"
              onClick={handleResetFilters}
            >
              Clear all
            </button>
          </div>
        )}

        {/* Product Grid or Empty State */}
        {visibleProducts.length > 0 ? (
          <ProductGrid products={visibleProducts} columns={columns} />
        ) : (
          <div className="collection-empty-filter">
            <p>No products match your selected filter criteria.</p>
            <button
              type="button"
              className="collection-reset-btn"
              onClick={handleResetFilters}
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="collection-load-row">
            <button
              type="button"
              className="collection-load-btn"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
            >
              Load More ({filteredAndSorted.length - visible} remaining)
            </button>
          </div>
        )}

        {/* Slide-out Filter Drawer */}
        <FilterDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          inStockCount={inStockCount}
          outOfStockCount={outOfStockCount}
          selectedAvailability={availability}
          onAvailabilityChange={setAvailability}
          priceRange={priceRange}
          maxPossiblePrice={maxCollectionPrice}
          onPriceChange={setPriceRange}
          onResetFilters={handleResetFilters}
        />
      </div>
    </section>
  )
}

export default CollectionSection
