import React from 'react'
import { AlignJustify, ChevronDown, Columns2, Columns3, Grid2x2, Grid3x3, SlidersHorizontal } from 'lucide-react'
import './Toolbar.css'

const VIEW_MODES = [
  { id: 'list', label: 'List view', Icon: AlignJustify, cols: 1 },
  { id: '2', label: '2 columns', Icon: Columns2, cols: 2 },
  { id: '3', label: '3 columns', Icon: Columns3, cols: 3, hideOnMobile: true },
  { id: '4', label: '4 columns', Icon: Grid2x2, cols: 4, hideOnMobile: true },
  { id: '5', label: '5 columns', Icon: Grid3x3, cols: 5, hideOnMobile: true },
  { id: '6', label: '6 columns', Icon: Grid3x3, cols: 6, hideOnMobile: true },
]

const Toolbar = ({ activeView, onViewChange, sort, onSortChange, onOpenFilter, hasActiveFilter }) => (
  <div className="toolbar">
    <button
      type="button"
      className={`toolbar-filter ${hasActiveFilter ? 'is-filtering' : ''}`}
      onClick={onOpenFilter}
    >
      <SlidersHorizontal size={18} strokeWidth={1.8} />
      <span>Filter</span>
      {hasActiveFilter && <span className="toolbar-filter-dot" />}
    </button>

    <div className="toolbar-views">
      {VIEW_MODES.map(({ id, label, Icon, cols, hideOnMobile }) => (
        <button
          key={id}
          type="button"
          aria-label={label}
          className={`toolbar-view-btn ${activeView === id ? 'is-active' : ''} ${hideOnMobile ? 'hide-on-mobile' : ''}`}
          onClick={() => onViewChange(cols, id)}
        >
          <Icon size={16} strokeWidth={2} />
        </button>
      ))}
    </div>

    <div className="toolbar-sort">
      <select value={sort} onChange={(event) => onSortChange(event.target.value)}>
        <option value="featured">Featured</option>
        <option value="best-selling">Best selling</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="newest">Newest</option>
      </select>
      <ChevronDown size={16} strokeWidth={2} className="toolbar-sort-caret" />
    </div>
  </div>
)

export default Toolbar
