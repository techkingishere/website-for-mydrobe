import React, { useState } from 'react';
import './SearchPage.css'; // We'll create this next

// Placeholder Icon
const SearchIcon = () => (
  <svg aria-label="Search" fill="currentColor" height="18" role="img" viewBox="0 0 24 24" width="18">
    <path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22"></line>
  </svg>
);

// Define content type (adjust as needed)
interface GridItem {
  id: string;
  imageUrl: string;
  type: 'image' | 'video'; // Example type
}

const SearchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'popular' | 'following'>('popular');
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data (adjusted length for better 9 interval viz)
  const dummyGridItems: GridItem[] = Array.from({ length: 36 }, (_, i) => ({
    id: `item-${i + 1}`,
    imageUrl: `https://via.placeholder.com/400x400/${Math.floor(Math.random() * 1000000).toString(16)}/FFFFFF?text=Post${i + 1}`,
    type: Math.random() > 0.9 ? 'video' : 'image',
  }));

  // Logic for placing rectangles
  let rectangleOpportunityIndex = 0; // Count the opportunities

  return (
    <div className="search-page-container">
      {/* Search Bar Section */}
      <div className="search-bar-section">
        <div className="search-input-wrapper">
          <SearchIcon />
          <input 
            type="text" 
            placeholder="Search" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs Section */}
      <div className="search-tabs-section">
        <button 
          className={`tab-btn ${activeTab === 'popular' ? 'active' : ''}`}
          onClick={() => setActiveTab('popular')}
        >
          Popular
        </button>
        <button 
          className={`tab-btn ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => setActiveTab('following')}
        >
          Following
        </button>
      </div>

      {/* Content Grid Section */}
      <div className="search-content-grid">
        {dummyGridItems.map((item, index) => {
          let itemClass = 'grid-item';
          const columnIndex = index % 3; // 0 = left, 1 = middle, 2 = right

          // Define opportunity interval (every 9 items)
          const opportunityInterval = 9; 
          // Check if this index is the start of an interval block
          const isOpportunity = index % opportunityInterval === 0;

          if (isOpportunity) {
            rectangleOpportunityIndex++; // Increment the counter for this opportunity
            const targetEdge = (rectangleOpportunityIndex % 2 !== 0) ? 'left' : 'right'; // Alternate target edge

            // Place only if the opportunity item is in the correct edge column
            if (targetEdge === 'left' && columnIndex === 0) {
                itemClass += ' grid-item--medium';
            }
             else if (targetEdge === 'right' && columnIndex === 2) {
                itemClass += ' grid-item--medium';
            }
            // No else needed - if it's not the correct edge column, it remains a standard grid-item
          }

          return (
            <div key={item.id} className={itemClass}>
              <img src={item.imageUrl} alt={`Content ${item.id}`} />
              {item.type === 'video' && <span className="content-type-icon">▶️</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchPage; 