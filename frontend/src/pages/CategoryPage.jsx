import React, { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import CollectionSection from '../components/shop/CollectionSection'
import { useShop } from '../components/shop/ShopContext'
import './Pages.css'

const titleFromSlug = (slug = '') =>
  slug
    .split('-')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')

const CategoryPage = () => {
  const { slug } = useParams()
  const { allProducts } = useShop()

  const products = useMemo(
    () =>
      allProducts.filter(
        (p) => p.categorySlug === slug || p.collection === slug,
      ),
    [allProducts, slug],
  )

  const heading = products[0]?.categoryName || titleFromSlug(slug)

  return (
    <div className="page-container">
      <div className="page-hero-banner">
        <div className="page-breadcrumbs">
          <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>{heading}</span>
        </div>
        <h1 className="page-hero-title">{heading}</h1>
        <p className="page-hero-subtitle">
          {products.length
            ? `Browse our ${heading} range.`
            : 'This collection is coming soon.'}
        </p>
      </div>

      {products.length ? (
        <CollectionSection
          id={`category-${slug}`}
          title={heading}
          subtitle={`${products.length} product${products.length === 1 ? '' : 's'}`}
          products={products}
        />
      ) : (
        <div className="page-content-wrapper">
          <p style={{ textAlign: 'center', color: '#666', padding: '2rem 0' }}>
            No products in this category yet. <Link to="/shop">See all products →</Link>
          </p>
        </div>
      )}
    </div>
  )
}

export default CategoryPage
