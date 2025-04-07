const HomePage = () => {
    // TODO: Fetch real data
    const placeholderProducts = [
        { id: 1, img: 'https://via.placeholder.com/200x200/333/fff?text=Product+1', alt: 'Product 1', price: '$10', name: 'Cool Item 1' },
        { id: 2, img: 'https://via.placeholder.com/200x200/333/fff?text=Product+2', alt: 'Product 2', price: '$25', name: 'Another Thing' },
        { id: 3, img: 'https://via.placeholder.com/200x200/333/fff?text=Product+3', alt: 'Product 3', price: '$150', name: 'Expensive Gadget' },
        { id: 4, img: 'https://via.placeholder.com/200x200/333/fff?text=Product+4', alt: 'Product 4', price: '$5', name: 'Cheap Find' },
    ];
     const suggestedProducts = [
        { id: 5, img: 'https://via.placeholder.com/200x200/444/fff?text=Product+5', alt: 'Product 5', price: '$19.99', name: 'Suggested Item A' },
        { id: 6, img: 'https://via.placeholder.com/200x200/444/fff?text=Product+6', alt: 'Product 6', price: '$42', name: 'Suggested Item B' },
    ];

    return (
        <div>
            <div className="marketplace-header">
                 <h2>Marketplace</h2>
                 <div className="actions">
                     <button className="action-btn person-icon">👤</button>
                     <button className="action-btn search-icon">🔍</button>
                 </div>
             </div>
             <div className="marketplace-filters">
                 <button>Sell</button>
                 <button>Categories</button>
             </div>
             <h3 className="section-title">Today's Picks</h3>
             <div className="product-grid">
                 {placeholderProducts.map(product => (
                     <div className="product-item" key={product.id}>
                         <img src={product.img} alt={product.alt} />
                         <p className="price">{product.price}</p>
                         <p className="name">{product.name}</p>
                     </div>
                 ))}
             </div>
              <h3 className="section-title">Suggested For You</h3>
             <div className="product-grid">
                 {suggestedProducts.map(product => (
                     <div className="product-item" key={product.id}>
                         <img src={product.img} alt={product.alt} />
                         <p className="price">{product.price}</p>
                         <p className="name">{product.name}</p>
                     </div>
                 ))}
             </div>
        </div>
    );
}
export default HomePage; 