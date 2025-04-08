import React, { useState } from 'react';
import { Product } from '../pages/HomePage'; // Assuming Product type is exported
import './ProductItem.css'; // We'll create this next

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from bubbling up if item is link
    setCurrentImageIndex((prevIndex) => 
      (prevIndex - 1 + product.imageUrls.length) % product.imageUrls.length
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % product.imageUrls.length
    );
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent bubbling
    setIsLiked(!isLiked);
    // TODO: Add logic to actually save like status (e.g., API call)
    console.log("Liked toggled:", product.id, !isLiked);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent bubbling
    setIsSaved(!isSaved);
    // TODO: Add logic to actually save status (e.g., API call)
    console.log("Saved toggled:", product.id, !isSaved);
  };

  const handleAddToBag = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement add to bag logic
    console.log(`Adding product ${product.id} to bag`);
  };

  // Re-introduce BagIcon definition
  const BagIcon = () => (
    <svg aria-label="Add to bag" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24" stroke="currentColor" strokeWidth="1.5">
      {/* Simplified Bag Icon Paths */}
      <rect x="4" y="6" width="16" height="15" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 6C9 3.5 10.5 1.5 13 1.5C15.5 1.5 17 3.5 17 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  // Icons for vertical action bar
  const HeartIconOutline = () => (
    <svg aria-label="Like" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24">
      <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.227-3.04 2.695-3.803 2.695-.763 0-1.29-.468-3.803-2.695-2.545-2.263-5.197-4.15-5.197-7.222a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.118-1.763a4.21 4.21 0 0 1 3.675-1.94z" stroke="currentColor" strokeWidth="2"></path>
    </svg>
  );
  const CommentIconOutline = () => (
    <svg aria-label="Comment" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24">
      <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
    </svg>
  );
  const SendIconOutline = () => (
     <svg aria-label="Share Post" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24">
        <line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line>
        <polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon>
    </svg>
  );

  // Chevrons for Image Navigation
  const ChevronLeftIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );

  const ChevronRightIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );

  // Renamed BookmarkIconOutline from Sidebar for saving
  const SaveIconOutline = () => (
    <svg aria-label="Save" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24">
      <polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
    </svg>
  );
  // Removed unused old SaveIcon

  // Filled Heart Icon for Liked State
  const HeartIconFilled = () => (
    <svg aria-label="Unlike" fill="red" height="24" role="img" viewBox="0 0 48 48" width="24">
        <path d="M34.6 3.9c-4.8 0-7.9 2.1-10.6 5.6-2.7-3.5-5.8-5.6-10.6-5.6C6 3.9 0 9.9 0 17.6 0 25.8 6.9 31.5 15.4 39.4c2.6 2.4 5.3 4.5 7.6 6.5.2.1.3.2.5.2s.3-.1.5-.2c2.3-2 5-4.1 7.6-6.5C41.1 31.5 48 25.8 48 17.6c0-7.7-6-13.7-13.4-13.7z"></path>
    </svg>
);

  // Filled Save Icon (Blue)
  const SaveIconFilled = () => (
      <svg aria-label="Unsave" fill="#0095f6" height="24" role="img" viewBox="0 0 24 24" width="24">
           <polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21"></polygon>
       </svg>
  );

  const hasMultipleImages = product.imageUrls && product.imageUrls.length > 1;

  return (
    <div className="product-item">
      <div className="product-image-wrapper">
        <div className="image-progress-indicator">
            {product.imageUrls.map((_, index) => (
                <div
                    key={index}
                    className={`indicator-segment ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                 ></div>
             ))}
         </div>

        <img src={product.imageUrls[currentImageIndex]} alt={product.name} className="product-image" />
        {hasMultipleImages && (
          <>
            <button 
              className="img-nav-btn prev-btn"
              onClick={handlePrevImage}
              aria-label="Previous image"
            >
              <ChevronLeftIcon />
            </button>
            <button 
              className="img-nav-btn next-btn"
              onClick={handleNextImage}
              aria-label="Next image"
            >
              <ChevronRightIcon />
            </button>
          </>
        )}
        <button className="save-icon-btn" onClick={handleSaveClick}>
          {isSaved ? <SaveIconFilled /> : <SaveIconOutline />}
        </button>
        <div className="vertical-actions">
            <button className="action-icon-btn like-btn" onClick={handleLikeClick}>
                {isLiked ? <HeartIconFilled /> : <HeartIconOutline />}
            </button>
             <button className="action-icon-btn comment-btn">
                <CommentIconOutline />
            </button>
             <button className="action-icon-btn send-btn">
                <SendIconOutline />
            </button>
        </div>
      </div>
      {product.colors && product.colors.length > 0 && (
        <div className="color-swatches">
          {product.colors.map((color, index) => (
            <span
              key={index}
              className="color-swatch"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            ></span>
          ))}
        </div>
      )}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <div className="product-price-line">
           {/* Sale price first */}
           <p className="product-price">${product.price.toFixed(2)}</p>
           
           {/* Conditionally render original price AFTER sale price */}
           {product.isOnSale && product.originalPrice && (
             <span className="original-price">${product.originalPrice.toFixed(2)}</span>
           )}
        </div>
        {/* Add Bag button here, outside price line */}
        <button className="add-to-bag-btn" onClick={handleAddToBag} aria-label="Add to bag">
          <BagIcon />
        </button>
      </div>
    </div>
  );
};

export default ProductItem; 
 
 
 
 