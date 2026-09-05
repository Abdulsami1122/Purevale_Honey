import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import ProductGrid from './ProductGrid'
import { useShop } from './ShopContext'
import './CollectionSection.css'

const LIMIT = 12

const groupLabel = (p) =>
  p.categoryName || (p.collection ? p.collection[0].toUpperCase() + p.collection.slice(1) : 'Other')

// Interleaves products round-robin across every real category (honey, dates,
// jaggery… and any category an admin has since added) so the home page shows
// a genuine mix rather than one category dominating the top rows.
const mixByCategory = (products) => {
  const groups = new Map()
  for (const p of products) {
    const key = groupLabel(p)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(p)
  }
  const buckets = [...groups.values()]
  const mixed = []
  for (let round = 0; mixed.length < LIMIT && buckets.some((b) => b[round]); round += 1) {
    for (const bucket of buckets) {
      if (bucket[round]) mixed.push(bucket[round])
      if (mixed.length >= LIMIT) break
    }
  }
  return mixed
}

const FeaturedMixSection = () => {
  const { allProducts } = useShop()
  const mixed = useMemo(() => mixByCategory(allProducts), [allProducts])

  if (mixed.length === 0) return null

  return (
    <section className="collection-section section" id="featured-mix">
      <div className="container">
        <div className="collection-heading">
          <span className="collection-heading-line" />
          <h2>Our Collection</h2>
          <span className="collection-heading-line" />
        </div>
        <p className="collection-subtitle">
          A little bit of everything — pure honey, fresh dates, jaggery, and more.
        </p>

        <ProductGrid products={mixed} columns={4} />

        <div className="collection-load-row">
          <Link to="/shop" className="collection-load-btn">Shop All Products</Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedMixSection
