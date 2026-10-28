import React from 'react';
import { Layers } from 'lucide-react';

export default function CategoryTabs({ categories, selectedCategory, onSelectCategory, totalCount }) {
  return (
    <div className="tal-domain-pills-bar">
      <div className="tal-domain-pills-scroll">
        {/* All Talents Pill */}
        <button
          className={`tal-domain-pill ${selectedCategory === 'All Domains' ? 'active' : ''}`}
          onClick={() => onSelectCategory('All Domains')}
        >
          <span>All Talents</span>
          <span className="tal-pill-badge">{totalCount}</span>
        </button>

        {/* Category Pills */}
        {categories.map((cat) => (
          <button
            key={cat.name}
            className={`tal-domain-pill ${selectedCategory === cat.name ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.name)}
          >
            <span>{cat.name}</span>
            <span className="tal-pill-badge">{cat.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
