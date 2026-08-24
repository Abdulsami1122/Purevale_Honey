import React, { useState } from 'react'
import Toolbar from './Toolbar'
import ProductGrid from './ProductGrid'
import './CollectionSection.css'

const PAGE_SIZE = 6

const CollectionSection = ({ id, title, subtitle, products }) => {
  const [columns, setColumns] = useState(4)
  const [viewId, setViewId] = useState('4')
  const [sort, setSort] = useState('featured')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price-asc') return a.priceMin - b.priceMin
    if (sort === 'price-desc') return b.priceMin - a.priceMin
    if (sort === 'best-selling') return b.reviews - a.reviews
    if (sort === 'newest') return b.featured - a.featured
    return a.featured - b.featured
  })

  const visibleProducts = sorted.slice(0, visible)
  const hasMore = visible < sorted.length

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
        />

        <div className="collection-load-row">
          <button
            type="button"
            className="collection-load-btn"
            disabled={visible <= PAGE_SIZE}
            onClick={() => setVisible((v) => Math.max(PAGE_SIZE, v - PAGE_SIZE))}
          >
            Load Previous
          </button>
        </div>

        <ProductGrid products={visibleProducts} columns={columns} />

        {hasMore && (
          <div className="collection-load-row">
            <button
              type="button"
              className="collection-load-btn"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default CollectionSection
