const ExplorePage = () => {
    // TODO: Fetch real data
    const exploreItems = [
        { id: 1, type: 'normal', img: 'https://via.placeholder.com/300x300/555/fff?text=Explore+1' },
        { id: 2, type: 'tall', img: 'https://via.placeholder.com/300x600/555/fff?text=Explore+2+(Tall)' },
        { id: 3, type: 'normal', img: 'https://via.placeholder.com/300x300/555/fff?text=Explore+3' },
        { id: 4, type: 'normal', img: 'https://via.placeholder.com/300x300/555/fff?text=Explore+4' },
        { id: 5, type: 'wide', img: 'https://via.placeholder.com/600x300/555/fff?text=Explore+5+(Wide)' },
        { id: 6, type: 'normal', img: 'https://via.placeholder.com/300x300/555/fff?text=Explore+6' },
        { id: 7, type: 'normal', img: 'https://via.placeholder.com/300x300/555/fff?text=Explore+7' },
        { id: 8, type: 'normal', img: 'https://via.placeholder.com/300x300/555/fff?text=Explore+8' },
        { id: 9, type: 'normal', img: 'https://via.placeholder.com/300x300/555/fff?text=Explore+9' },
    ];

    const getItemClass = (type: string) => {
        switch (type) {
            case 'tall': return 'explore-item tall';
            case 'wide': return 'explore-item wide';
            // case 'large': return 'explore-item large'; // Example
            default: return 'explore-item';
        }
    };

    return (
        <div className="explore-grid">
            {exploreItems.map(item => (
                <div className={getItemClass(item.type)} key={item.id}>
                    <img src={item.img} alt={`Explore Item ${item.id}`} />
                </div>
            ))}
        </div>
    );
};
export default ExplorePage; 