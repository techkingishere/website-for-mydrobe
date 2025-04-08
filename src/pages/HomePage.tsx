import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import ProductItem from '../components/ProductItem'; // We'll create this component
import MarketplaceHeader from '../components/MarketplaceHeader'; // Import the header
import FilterModal, { FilterOptions, ActiveFilters } from '../components/FilterModal'; // Import modal and types
import './HomePage.css'; // We'll create this CSS file

// Define Product type (adjust as needed)
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number; // This will be the SALE price if applicable
  originalPrice?: number; // Added original price
  imageUrls: string[]; // Array of image URLs
  colors?: { name: string; hex: string }[]; // Use object for colors
  sizes?: string[]; // Added sizes
  isOnSale?: boolean; // Added sale flag
}

// Function to get unique filter options from products
const getAvailableFilters = (products: Product[]): FilterOptions => {
    const categories = [...new Set(products.map(p => p.category))];
    const sizes = [...new Set(products.flatMap(p => p.sizes || []))];
    const colorsMap = new Map<string, string>();
    products.flatMap(p => p.colors || []).forEach(color => {
        if (!colorsMap.has(color.hex)) {
            colorsMap.set(color.hex, color.name);
        }
    });
    const colors = Array.from(colorsMap, ([hex, name]) => ({ name, hex }));

    return { categories, sizes, colors };
};

// Helper function to check if any filters are actually active (excluding default sort)
const checkFiltersActive = (filters: ActiveFilters): boolean => {
    return (
        filters.category !== null ||
        filters.sizes.length > 0 ||
        filters.colors.length > 0 ||
        filters.priceMin !== null ||
        filters.priceMax !== null
        // We might exclude sortBy === 'popular' depending on desired behavior
    );
};

const ITEMS_PER_PAGE = 100; // Number of items to load per "page"
const SCROLL_THRESHOLD = 500; // Load more when 500px from bottom

const HomePage: React.FC = () => {
  // --- State --- 
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSaleFilterActive, setIsSaleFilterActive] = useState(false); // State for Sale filter
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    category: null,
    sizes: [],
    colors: [],
    priceMin: null,
    priceMax: null,
    sortBy: 'popular' // Default sort
  });

  // State for infinite scroll
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Holds ALL potential products (multiplied)
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]); // Products currently rendered
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const throttleTimeoutRef = useRef<number | null>(null); // Ref for throttling (use number for timeout ID)

  // Dummy Product Data - updated with colors as objects and sizes
  const dummyProducts: Product[] = [
    {
      id: '1', name: 'UA Tech™ Polo', category: "Men's Polo", price: 35, // Sale price
      originalPrice: 45, // Original price
      imageUrls: [
        'https://via.placeholder.com/400x400/CCCCCC/000000?text=Polo1',
        'https://via.placeholder.com/400x400/CDCDCD/000000?text=Polo2',
        'https://via.placeholder.com/400x400/DCDCDC/000000?text=Polo3',
      ],
      colors: [{name: 'Pink', hex:'#FFC0CB'}, {name:'Black', hex:'#363636'}, {name:'Grey', hex:'#A9A9A9'}, {name:'Blue', hex:'#1E90FF'}, {name:'White', hex:'#FFFFFF'}],
      sizes: ['S', 'M', 'L', 'XL'],
      isOnSale: true // Mark this one as on sale
    },
    {
      id: '2', name: 'UA Tech™ 2.0 Sleeve', category: "Men's Short Sleeve", price: 25,
      imageUrls: [
          'https://via.placeholder.com/400x400/B0E0E6/000000?text=Tee1',
          'https://via.placeholder.com/400x400/B1E1E7/000000?text=Tee2',
          'https://via.placeholder.com/400x400/A0D0D6/000000?text=Tee3',
      ],
      colors: [{name:'Light Blue', hex:'#B0E0E6'}, {name:'Black', hex:'#000000'}, {name:'Grey', hex:'#808080'}, {name:'White', hex:'#FFFFFF'}],
      sizes: ['S', 'M', 'L']
    },
    {
      id: '3', name: 'UA Vanish Energy', category: "Men's Short Sleeve", price: 45,
       imageUrls: [
          'https://via.placeholder.com/400x400/FFFFFF/000000?text=Tee2.1',
          'https://via.placeholder.com/400x400/FAFAFA/000000?text=Tee2.2',
          'https://via.placeholder.com/400x400/F0F0F0/000000?text=Tee2.3',
      ],
      colors: [{name:'White', hex:'#FFFFFF'}, {name:'Black', hex:'#000000'}, {name:'Grey', hex:'#808080'}, {name:'Green', hex:'#90EE90'}, {name:'Dark Grey', hex:'#A9A9A9'}],
       sizes: ['M', 'L', 'XL']
    },
    {
      id: '4', name: 'Essential Black Tee', category: "Men's Short Sleeve", price: 20, // Sale price
      originalPrice: 30, // Original price
      imageUrls: [
          'https://via.placeholder.com/400x400/000000/FFFFFF?text=Tee3.1',
          'https://via.placeholder.com/400x400/111111/FFFFFF?text=Tee3.2',
          'https://via.placeholder.com/400x400/222222/FFFFFF?text=Tee3.3',
      ],
      colors: [{name:'Black', hex:'#000000'}],
       sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
       isOnSale: true // Mark this one as on sale
    },
     {
      id: '5', name: 'Performance 1/4 Zip', category: "Men's Long Sleeve", price: 55,
      imageUrls: [
          'https://via.placeholder.com/400x400/4682B4/FFFFFF?text=Zip1',
          'https://via.placeholder.com/400x400/4783B5/FFFFFF?text=Zip2',
          'https://via.placeholder.com/400x400/4884B6/FFFFFF?text=Zip3',
      ],
      colors: [{name:'Steel Blue', hex:'#4682B4'}, {name:'White', hex:'#FFFFFF'}],
       sizes: ['M', 'L']
    },
     {
      id: '6', name: 'Core Long Sleeve', category: "Men's Long Sleeve", price: 40,
      imageUrls: [
          'https://via.placeholder.com/400x400/111111/FFFFFF?text=LS1',
          'https://via.placeholder.com/400x400/121212/FFFFFF?text=LS2',
          'https://via.placeholder.com/400x400/131313/FFFFFF?text=LS3',
      ],
      colors: [{name:'Dark Grey', hex:'#111111'}, {name:'Black', hex:'#000000'}],
       sizes: ['S', 'M', 'L', 'XL']
    },
    ];

    // --- Dummy Data Generation (Run Once) ---
    useEffect(() => {
      // Multiply the base products to simulate a large dataset
       const multiplied = Array.from({ length: 10 }, (_, i) => // Generate 10x = 60 products for demo
          dummyProducts.map(p => ({...p, id: `${p.id}-${i}-${Math.random()}`})) // More unique ID
      ).flat();
      setAllProducts(multiplied);
    }, []); // Empty dependency array ensures this runs only once

    // --- Memoized Values --- 
    const availableFilters = useMemo(() => getAvailableFilters(allProducts), [allProducts]);
    const isFilterActive = useMemo(() => checkFiltersActive(activeFilters), [activeFilters]); // Calculate active status

    // Filtered and Sorted Full List
    const filteredSortedAllProducts = useMemo(() => {
      console.log("Recalculating filtered/sorted list with filters:", activeFilters, "Sale:", isSaleFilterActive);
      let products = [...allProducts];

      // Apply Sale Filter FIRST if active
      if (isSaleFilterActive) {
        products = products.filter(p => p.isOnSale === true);
      }

      // Apply Other Filters
      if (activeFilters.category) {
            products = products.filter(p => p.category === activeFilters.category);
        }
        if (activeFilters.sizes.length > 0) {
            products = products.filter(p => 
                p.sizes && p.sizes.some(size => activeFilters.sizes.includes(size))
            );
        }
        if (activeFilters.colors.length > 0) {
             products = products.filter(p => 
                p.colors && p.colors.some(color => activeFilters.colors.includes(color.hex))
            );
        }
        if (activeFilters.priceMin !== null) {
            products = products.filter(p => p.price >= activeFilters.priceMin!);
        }
        if (activeFilters.priceMax !== null) {
            products = products.filter(p => p.price <= activeFilters.priceMax!);
        }
      // Apply Sorting
      switch (activeFilters.sortBy) {
          case 'price_asc':
              products.sort((a, b) => a.price - b.price);
              break;
          case 'price_desc':
              products.sort((a, b) => b.price - a.price);
              break;
          case 'newest':
              products.sort((a, b) => parseInt(b.id.split('-')[1]) - parseInt(a.id.split('-')[1])); // Sort by multiplier index for demo
              break;
          case 'popular':
          default:
              break;
      }
      console.log(`Filtered list size: ${products.length}`);
      return products;
    }, [allProducts, activeFilters, isSaleFilterActive]);

    // --- Effect for Initial Load & Filter/Sort Changes ---
    useEffect(() => {
      console.log("Setting initial displayed products");
      const initialBatch = filteredSortedAllProducts.slice(0, ITEMS_PER_PAGE);
      setDisplayedProducts(initialBatch);
      setCurrentPage(1);
      setHasMore(filteredSortedAllProducts.length > ITEMS_PER_PAGE);
      setIsLoading(false); // Ensure loading is false initially
    }, [filteredSortedAllProducts]); // Rerun whenever the filtered/sorted list changes

    // --- Handlers ---
    const openFilterModal = () => setIsFilterModalOpen(true);
    const closeFilterModal = () => setIsFilterModalOpen(false);

    const handleApplyFilters = (newFilters: ActiveFilters) => {
        console.log("Applying filters:", newFilters);
        setActiveFilters(newFilters); // This will trigger the useEffect above to reset displayed products
    };

    // Handler for Sale button toggle
    const handleSaleToggle = () => {
        setIsSaleFilterActive(prevState => !prevState);
        // Optionally reset other filters when toggling sale? Depends on desired UX
        // handleApplyFilters({ ...initialFilterState, sortBy: activeFilters.sortBy }); 
    };

    // --- Load More Logic ---
    const loadMoreProducts = useCallback(() => {
        if (isLoading || !hasMore) return;

        console.log("Attempting to load more...");
        setIsLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            const nextPage = currentPage + 1;
            const startIndex = currentPage * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            const nextBatch = filteredSortedAllProducts.slice(startIndex, endIndex);

            console.log(`Loading page ${nextPage}, Start: ${startIndex}, End: ${endIndex}, Batch size: ${nextBatch.length}`);

            if (nextBatch.length > 0) {
                setDisplayedProducts(prev => [...prev, ...nextBatch]);
                setCurrentPage(nextPage);
                setHasMore(filteredSortedAllProducts.length > endIndex);
            } else {
                 setHasMore(false);
            }
            setIsLoading(false);
             console.log("Loading finished. HasMore:", filteredSortedAllProducts.length > endIndex);
        }, 500); // Simulate 500ms network delay

    }, [isLoading, hasMore, currentPage, filteredSortedAllProducts]);

    // --- Scroll Listener Effect ---
    useEffect(() => {
        const handleScroll = () => {
            // Simple throttle mechanism
            if (throttleTimeoutRef.current) {
                return; // Already waiting
            }

            throttleTimeoutRef.current = setTimeout(() => {
                throttleTimeoutRef.current = null; // Clear timeout ref
                
                // Check if near bottom
                if (
                    window.innerHeight + window.scrollY >=
                    document.documentElement.offsetHeight - SCROLL_THRESHOLD
                ) {
                    loadMoreProducts();
                }
            }, 200); // Throttle check every 200ms
        };

        window.addEventListener('scroll', handleScroll);
        console.log("Scroll listener added");

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (throttleTimeoutRef.current) {
                clearTimeout(throttleTimeoutRef.current);
            }
             console.log("Scroll listener removed");
        };
    }, [loadMoreProducts]); // Dependency includes loadMoreProducts

    // --- Render --- 
    return (
    <div className="homepage-container">
      <MarketplaceHeader 
        onFilterClick={openFilterModal} 
        isFilterActive={isFilterActive} 
        isSaleActive={isSaleFilterActive} // Pass sale state
        onSaleToggle={handleSaleToggle} // Pass sale toggle handler
      /> 

        {/* New wrapper div */}
        <div className="products-area">
            {/* Conditional Rendering for Product Grid / No Results */}
            {isLoading && displayedProducts.length === 0 ? ( // Show loading indicator only on initial load
                <div className="loading-indicator">Loading products...</div>
            ) : !isLoading && displayedProducts.length === 0 ? ( // Show no results message
                <div className="no-products-message">
                    No products found matching your criteria.
                 </div>
            ) : ( // Render the grid if there are products
             <div className="product-grid">
                {displayedProducts.map((product) => (
                    <ProductItem key={product.id} product={product} />
                 ))}
             </div>
            )}

            {/* Optional: Keep loading indicator at bottom during infinite scroll */}
            {isLoading && displayedProducts.length > 0 && (
                <div className="loading-indicator bottom-loader">Loading more...</div>
            )}
        </div> {/* End of products-area wrapper */}

        {/* Render Filter Modal */}
        <FilterModal 
            isOpen={isFilterModalOpen}
            onClose={closeFilterModal}
            availableFilters={availableFilters}
            initialFilters={activeFilters}
            onApplyFilters={handleApplyFilters}
        />
        </div>
    );
};

export default HomePage; 