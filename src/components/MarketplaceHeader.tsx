import React, { useState } from 'react';
import './MarketplaceHeader.css'; // We'll create this next

// Placeholder Icons (Replace with actual SVGs)
const BackIcon = () => (
  <svg aria-label="Back" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    <path d="M19 11H7.414l3.293-3.293a1 1 0 1 0-1.414-1.414l-5 5a1 1 0 0 0 0 1.414l5 5a1 1 0 0 0 1.414-1.414L7.414 13H19a1 1 0 0 0 0-2z"></path>
  </svg>
);
const SearchIcon = () => (
  <svg aria-label="Search" fill="currentColor" height="18" role="img" viewBox="0 0 24 24" width="18">
    <path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22"></line>
  </svg>
);
const CameraIcon = () => (
    <svg aria-label="Visual Search" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        {/* Camera Body */}
        <rect x="2" y="7" width="20" height="15" rx="4"/>
        {/* Lens */}
        <circle cx="12" cy="14.5" r="4.5"/>
        {/* Flash */}
        <circle cx="18.5" cy="10.5" r="1" fill="currentColor"/> 
        {/* Top part (cutout simulation) - This might need adjustment based on stroke */}
        {/* <path d="M17 7V5.5C17 4.11929 15.8807 3 14.5 3H9.5C8.11929 3 7 4.11929 7 5.5V7"/> */} 
    </svg>
);
// const SortIcon = () => <span>↑↓</span>; // Removed unused icon
const FilterIcon = () => <span>▼</span>; // Simple placeholder

// Add props interface
interface MarketplaceHeaderProps {
  onFilterClick: () => void;
  isFilterActive: boolean;
  isSaleActive: boolean;
  onSaleToggle: () => void;
}

const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({ 
  onFilterClick, 
  isFilterActive, 
  isSaleActive,
  onSaleToggle
}) => { // Destructure prop
  const [searchTerm, setSearchTerm] = useState(''); // State for search input

  return (
    <div className="marketplace-header-container">
      {/* Top Row: Back, Search, Camera, Logo */}
      <div className="header-top-row">
        {searchTerm.length > 0 && (
             <button className="header-icon-btn back-btn" onClick={() => setSearchTerm('')}>
                <BackIcon />
            </button>
        )}
        <div className="search-bar">
          <SearchIcon />
          <input 
            type="text" 
            placeholder="Looking for something?" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="header-icon-btn camera-btn">
            <CameraIcon />
          </button>
        </div>
      </div>
      {/* Bottom Row: Filters */}
      <div className="header-bottom-row">
        {/* Removed Sort button */}
        {/* 
        <button className="filter-btn sort-btn">
          Sort <SortIcon />
        </button>
        */}
        <button 
          className={`filter-btn filter-dropdown-btn ${isFilterActive ? 'active' : ''}`}
          onClick={onFilterClick}
        >
          Filter <FilterIcon />
        </button>
        <button 
          className={`filter-btn sale-btn ${isSaleActive ? 'active' : ''}`}
          onClick={onSaleToggle}
        >
          Sale
        </button>
      </div>
    </div>
  );
};

export default MarketplaceHeader; 
 
 
 
 
 