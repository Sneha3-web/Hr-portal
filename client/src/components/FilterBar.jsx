import React from 'react';
import { Search, X, LayoutGrid, List, SlidersHorizontal, RotateCcw } from 'lucide-react';

export default function FilterBar({
  search,
  onSearchChange,
  experience,
  onExperienceChange,
  location,
  onLocationChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  hasActiveFilters,
  totalResults
}) {
  return (
    <div className="tal-filter-container">
      <div className="tal-filter-bar">
        {/* Search input with clean modern styling */}
        <div className="tal-search-box">
          <Search size={16} className="tal-search-icon" />
          <input
            type="text"
            className="tal-search-input"
            placeholder="Search builders by name, skill (e.g. React, Python, AWS), or role..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button
              className="tal-search-clear"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters dropdowns / pills */}
        <div className="tal-filter-controls">
          {/* Location */}
          <div className="tal-select-wrapper">
            <select
              className="tal-filter-select"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
            >
              <option value="all">All Locations</option>
              <option value="Bangalore">Bengaluru</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Chennai">Chennai</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Experience with + and - Steppers */}
          <div className="tal-filter-exp-stepper-wrap">
            <button
              type="button"
              className="tal-filter-exp-step-btn"
              onClick={() => {
                const levels = ['all', 'fresher', '1-3', '3+'];
                const idx = levels.indexOf(experience);
                if (idx > 0) onExperienceChange(levels[idx - 1]);
              }}
              disabled={experience === 'all'}
              title="Decrease experience filter (-)"
              aria-label="Decrease experience filter"
            >
              -
            </button>
            <div className="tal-select-wrapper">
              <select
                className="tal-filter-select"
                value={experience}
                onChange={(e) => onExperienceChange(e.target.value)}
                aria-label="Filter candidates by experience"
              >
                <option value="all">All Experience</option>
                <option value="fresher">Fresher (2024-2025)</option>
                <option value="1-3">1 - 3 Years</option>
                <option value="3+">3+ Years</option>
              </select>
            </div>
            <button
              type="button"
              className="tal-filter-exp-step-btn"
              onClick={() => {
                const levels = ['all', 'fresher', '1-3', '3+'];
                const idx = levels.indexOf(experience);
                if (idx < levels.length - 1 && idx >= 0) {
                  onExperienceChange(levels[idx + 1]);
                } else if (idx === -1) {
                  onExperienceChange('fresher');
                }
              }}
              disabled={experience === '3+'}
              title="Increase experience filter (+)"
              aria-label="Increase experience filter"
            >
              +
            </button>
          </div>


          {/* Sort */}
          <div className="tal-select-wrapper">
            <select
              className="tal-filter-select"
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="name_asc">Name (A → Z)</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="score_desc">Top Assessment Score</option>
              <option value="experience_desc">Most Experienced</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="tal-view-mode-toggle">
            <button
              className={`tal-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => onViewModeChange('grid')}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              className={`tal-view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => onViewModeChange('table')}
              title="Table View"
            >
              <List size={15} />
            </button>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              className="tal-btn-reset-filters"
              onClick={onResetFilters}
              title="Reset all filters"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
