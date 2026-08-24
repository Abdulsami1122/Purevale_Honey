import React from 'react'
import ProductCard from './ProductCard'
import './ProductGrid.css'

const ProductGrid = ({ products, columns }) => (
  <div className="product-grid" style={{ '--cols': columns }}>
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
)

export default ProductGrid
