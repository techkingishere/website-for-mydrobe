import React, { useState, useEffect, useCallback } from 'react';
import './FilterModal.css';

// Define types for filters (adjust as needed)
export interface FilterOptions {
  categories: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  // Add brands, materials etc. later
}

export interface ActiveFilters {
  category: string | null;
  sizes: string[];
  colors: string[];
  priceMin: number | null;
  priceMax: number | null;
  sortBy: string; // e.g., 'popular', 'price_asc', 'price_desc', 'newest'
}

// Example Hierarchical Category Structure
interface CategoryNode {
  name: string;
  subcategories?: CategoryNode[];
}

// DEMO DATA - Replace with data fetched or passed via props
const dummyCategoryTree: CategoryNode[] = [
  { name: 'All Categories', subcategories: [ // Added 'All' option
      { name: 'Men', subcategories: [
          { name: 'Clothing', subcategories: [{ name: 'Tops' }, { name: 'Bottoms' }, { name: 'Outerwear' }, { name: 'Activewear'}] },
          { name: 'Shoes', subcategories: [{ name: 'Sneakers' }, { name: 'Boots' }, { name: 'Sandals' }] },
          { name: 'Accessories', subcategories: [{ name: 'Hats' }, { name: 'Bags' }, { name: 'Belts' }] }
      ]},
      { name: 'Women', subcategories: [
          { name: 'Clothing', subcategories: [{ name: 'Dresses' }, { name: 'Tops' }, { name: 'Jeans' }, { name: 'Skirts'}] },
          { name: 'Shoes', subcategories: [{ name: 'Heels' }, { name: 'Flats' }, { name: 'Sandals' }, { name: 'Boots'}] },
          { name: 'Bags', subcategories: [{ name: 'Handbags' }, { name: 'Totes' }] },
          { name: 'Jewelry' }
      ]},
      { name: 'Kids', subcategories: [{ name: 'Boys' }, { name: 'Girls' }] },
  ]}
];

// Helper to find node in tree (can be optimized)
const findNode = (path: string[], tree: CategoryNode[]): CategoryNode | undefined => {
    if (!path || path.length === 0) return undefined; // No path, no specific node
    let currentNode: CategoryNode | undefined = { name: 'root', subcategories: tree }; // Start with root wrapper
    for (const name of path) {
        currentNode = currentNode?.subcategories?.find(cat => cat.name === name);
        if (!currentNode) return undefined;
    }
    return currentNode;
};

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableFilters: FilterOptions;
  initialFilters: ActiveFilters; // Filters currently applied
  onApplyFilters: (filters: ActiveFilters) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ 
  isOpen,
  onClose,
  availableFilters,
  initialFilters,
  onApplyFilters 
}) => {

  // Internal state for temporary selections
  const [tempFilters, setTempFilters] = useState<ActiveFilters>(initialFilters);
  const [categoryPath, setCategoryPath] = useState<string[]>([]); // State for drilldown path

  // Reset temporary filters when modal opens or initial filters change
  useEffect(() => {
    if (isOpen) {
        console.log("Modal Opened. Initial Filters:", initialFilters); // Log initial
        setTempFilters(initialFilters);
        setCategoryPath([]); // Always start path fresh for simplicity on open
        console.log("Modal State after reset:", initialFilters, "Path:", []); // Log after reset
    }
  }, [isOpen, initialFilters]);

  // Get current category options based on path
  const getCurrentCategoryOptions = useCallback((): CategoryNode[] => {
    const currentNode = findNode(categoryPath, dummyCategoryTree);
    return currentNode?.subcategories || dummyCategoryTree;
  }, [categoryPath]);

  const handleCategoryClick = (category: CategoryNode) => {
     console.log("Category Clicked:", category.name); // Log click
     if (category.name === 'All Categories') { // Handle selecting 'All'
         setTempFilters(prev => {
             const newState = { ...prev, category: null };
             console.log("Setting state (All):", newState); // Log state set
             return newState;
         });
         setCategoryPath([]); 
     } else if (category.subcategories && category.subcategories.length > 0) {
          setCategoryPath(prev => {
              const newPath = [...prev, category.name];
              console.log("Setting path (Drilldown):", newPath); // Log path set
              return newPath;
          }); // Drill down
      } else {
          // Leaf node selected - set filter and reset path for simplicity
          setTempFilters(prev => {
              const newState = { ...prev, category: category.name };
              console.log("Setting state (Leaf):", newState); // Log state set
              return newState;
          });
          setCategoryPath([]); 
          console.log("Resetting path after leaf selection"); // Log path reset
          // Optionally keep path for display: setCategoryPath([]); // Remove this line
      }
  };

  const handleCategoryBack = () => {
      setCategoryPath(prev => prev.slice(0, -1));
  };

  const handleCheckboxChange = (filterType: 'sizes' | 'colors', value: string) => {
     setTempFilters(prev => {
            const currentValues = prev[filterType] as string[];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(item => item !== value) // Remove if exists
                : [...currentValues, value]; // Add if not exists
            return { ...prev, [filterType]: newValues };
        });
  };

 const handleRadioChange = (filterType: 'sortBy', value: string) => { // Removed category handling here
     setTempFilters(prev => ({ ...prev, [filterType]: value }));
 };

  const handleApply = () => {
    onApplyFilters(tempFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: ActiveFilters = {
        category: null,
        sizes: [],
        colors: [],
        priceMin: null,
        priceMax: null,
        sortBy: 'popular' // Default sort
    };
    setTempFilters(clearedFilters);
    setCategoryPath([]); // Reset category path
  };

  if (!isOpen) return null;

  // Dynamically generate category options UI
  const currentCategoryOptions = getCurrentCategoryOptions();
  const showCategoryBackButton = categoryPath.length > 0;
  const selectedCategoryDisplay = tempFilters.category || 'All Categories'; // Show selected leaf or All

  return (
    <div className="filter-modal-overlay" onClick={onClose}>
      <div className="filter-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="filter-modal-header">
          <h2>Filters</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="filter-modal-body">
          {/* Sort By Section (Example) */}
          <div className="filter-section">
            <h3>Sort By</h3>
            <div className="filter-options">
               {['popular', 'newest', 'price_asc', 'price_desc'].map(option => (
                    <label key={option}>
                        <input 
                            type="radio" 
                            name="sortBy"
                            value={option}
                            checked={tempFilters.sortBy === option}
                            onChange={() => handleRadioChange('sortBy', option)}
                        /> 
                        {/* Simple capitalization for display */}
                        {option.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                ))}
            </div>
          </div>

          {/* Category Section (Drill-Down) */}
          <div className="filter-section category-section">
            <div className="category-header">
              {showCategoryBackButton && (
                <button onClick={handleCategoryBack} className="category-back-btn">‹ Back</button>
              )}
              <h3>Category</h3>
              <span className="selected-category-display">{selectedCategoryDisplay}</span>
            </div>
            <div className="filter-options category-options">
               {currentCategoryOptions.map(cat => (
                   <button 
                       key={cat.name} 
                       className="category-option-btn" 
                       onClick={() => handleCategoryClick(cat)}
                    >
                       {cat.name}
                       {/* Show arrow if it has subcategories */} 
                       {cat.subcategories && cat.subcategories.length > 0 && (
                           <span className="category-arrow">›</span>
                       )}
                   </button>
               ))}
            </div>
          </div>

           {/* Sizes Section (Example) */}
           <div className="filter-section">
            <h3>Size</h3>
            <div className="filter-options checkbox-group">
              {(availableFilters.sizes || []).map(size => (
                <label key={size}>
                  <input 
                    type="checkbox" 
                    value={size} 
                    checked={tempFilters.sizes.includes(size)}
                    onChange={() => handleCheckboxChange('sizes', size)}
                  /> {size}
                </label>
              ))}
            </div>
          </div>
          
           {/* Colors Section (Example) */}
           <div className="filter-section">
               <h3>Color</h3>
               <div className="filter-options color-swatch-group">
                   {(availableFilters.colors || []).map(color => (
                       <button 
                           key={color.hex} 
                           className={`color-swatch-btn ${tempFilters.colors.includes(color.hex) ? 'selected' : ''}`}
                           style={{ backgroundColor: color.hex }}
                           onClick={() => handleCheckboxChange('colors', color.hex)}
                           aria-label={color.name}
                       ></button>
                   ))}
               </div>
           </div>

          {/* Price Range Section (Placeholder) */}
          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="filter-options price-range">
                <input type="number" placeholder="Min" value={tempFilters.priceMin ?? ''} onChange={e => setTempFilters({...tempFilters, priceMin: e.target.value ? Number(e.target.value) : null })} />
                <span>-</span>
                <input type="number" placeholder="Max" value={tempFilters.priceMax ?? ''} onChange={e => setTempFilters({...tempFilters, priceMax: e.target.value ? Number(e.target.value) : null })} />
            </div>
          </div>

        </div>

        <div className="filter-modal-footer">
          <button onClick={handleClear} className="clear-btn">Clear All</button>
          <button onClick={handleApply} className="apply-btn">Apply Filters</button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal; 
 
 
 
 
 
 
 
 