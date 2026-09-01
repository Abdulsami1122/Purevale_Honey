import React from 'react'
import ProductCard from './ProductCard'
import './ProductGrid.css'

const ProductGrid = ({ products, columns }) => (
  <div className="product-grid" style={{ '--cols': columns }}>
    {products.map((product, index) => (
      <div
        key={product.id}
        className="product-grid-item"
        style={{ '--stagger': `${Math.min(index, 8) * 60}ms` }}
      >
        <ProductCard product={product} />
      </div>
    ))}
  </div>
)

export default ProductGrid
