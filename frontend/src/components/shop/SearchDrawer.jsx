import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, Search } from 'lucide-react';
import {
  honeyProducts,
  datesProducts,
  jaggeryProducts,
  shilajitProducts,
  cosmeticsProducts,
  priceLabel
} from '../../data/products';
import './SearchDrawer.css';

// Map collections to their routes
const ALL_PRODUCTS = [
  ...honeyProducts.map(p => ({ ...p, route: '/honey' })),
  ...datesProducts.map(p => ({ ...p, route: '/dates' })),
  ...jaggeryProducts.map(p => ({ ...p, route: '/jaggery' })),
  ...shilajitProducts.map(p => ({ ...p, route: '/shilajit' })),
  ...cosmeticsProducts.map(p => ({ ...p, route: '/cosmetics' }))
];

const SearchDrawer = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('auth-drawer-open'); // Reusing this class to lock scroll and hide bee
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 300);
    } else {
      document.body.classList.remove('auth-drawer-open');
      setQuery(''); // Reset query on close
    }

    return () => {
      document.body.classList.remove('auth-drawer-open');
    };
  }, [isOpen]);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase().trim();
    return ALL_PRODUCTS.filter(product =>
      product.title.toLowerCase().includes(lowerQuery)
    ).slice(0, 10); // Limit to top 10 results
  }, [query]);

  if (!isOpen) return null;

  return (
    <>
      <div className="search-backdrop" onClick={onClose}></div>
      <div className={`search-drawer ${isOpen ? 'is-open' : ''}`}>
        <div className="search-drawer-header">
          <h2>SEARCH OUR STORE</h2>
          <button type="button" className="search-drawer-close" onClick={onClose} aria-label="Close">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div className="search-drawer-body">
          <div className="search-input-wrapper">
            <Search className="search-icon-inside" size={20} strokeWidth={1.5} />
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="What are you looking for?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear search">
                <X size={16} strokeWidth={2} />
              </button>
            )}
          </div>

          <div className="search-results">
            {query.trim() && filteredProducts.length === 0 && (
              <div className="search-no-results">
                No products found for "{query}".
              </div>
            )}

            {filteredProducts.map((product) => (
              <Link 
                key={product.id} 
                to={product.route} 
                className="search-result-item"
                onClick={onClose}
              >
                <div className="search-result-image">
                  <img src={product.image} alt={product.title} />
                </div>
                <div className="search-result-info">
                  <h4 className="search-result-title">{product.title}</h4>
                  <div className="search-result-price">{priceLabel(product)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchDrawer;
