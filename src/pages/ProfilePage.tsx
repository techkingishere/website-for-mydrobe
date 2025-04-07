import { useState } from 'react';

type TabName = 'posts' | 'saved' | 'tagged';

const ProfilePage = () => {
    // TODO: Fetch real profile data, posts, highlights
    const profileData = {
        username: 'my_username',
        avatar: 'https://via.placeholder.com/150x150/888/fff?text=Me',
        postsCount: 12,
        followersCount: 150,
        followingCount: 200,
        fullName: 'My Full Name',
        bio: 'This is my bio description. Sharing my style journey!',
        website: 'mylink.com'
    };
    const highlights = [
        { id: 1, img: 'https://via.placeholder.com/60x60/555/fff?text=H1', name: 'Looks' },
        { id: 2, img: 'https://via.placeholder.com/60x60/555/fff?text=H2', name: 'Trips' },
    ];
     const posts = [
        { id: 1, img: 'https://via.placeholder.com/300x300/666/fff?text=Post+1' },
        { id: 2, img: 'https://via.placeholder.com/300x300/666/fff?text=Post+2' },
        { id: 3, img: 'https://via.placeholder.com/300x300/666/fff?text=Post+3' },
    ];
    // Use state for the active tab
    const [activeTab, setActiveTab] = useState<TabName>('posts'); 

    const handleTabClick = (tabName: TabName) => {
        setActiveTab(tabName);
        // TODO: Fetch data for the selected tab if necessary
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img className="profile-avatar" src={profileData.avatar} alt={`${profileData.username} Avatar`} />
                <div className="profile-info">
                    <div className="profile-title">
                        <span className="username">{profileData.username}</span>
                        <button className="profile-action-btn">Edit Profile</button>
                        <button className="profile-action-btn icon-btn">⚙️</button>
                    </div>
                    <div className="profile-stats">
                        <span><strong>{profileData.postsCount}</strong> posts</span>
                        <span><strong>{profileData.followersCount}</strong> followers</span>
                        <span><strong>{profileData.followingCount}</strong> following</span>
                    </div>
                    <div className="profile-bio">
                        <p className="name">{profileData.fullName}</p>
                        <p>{profileData.bio}</p>
                        {profileData.website && <a href={`http://${profileData.website}`} target="_blank" rel="noopener noreferrer">{profileData.website}</a>}
                    </div>
                </div>
            </div>

            <div className="profile-highlights">
                {highlights.map(h => (
                     <div className="highlight-item" key={h.id}>
                        <div className="highlight-circle"><img src={h.img} alt={`Highlight ${h.id}`} /></div>
                        <span className="highlight-name">{h.name}</span>
                    </div>
                ))}
                 <div className="highlight-item"> {/* Add New Highlight */} 
                    <div className="highlight-circle add-highlight">➕</div>
                    <span className="highlight-name">New</span>
                </div>
            </div>

            <div className="profile-content-tabs">
                <button 
                    className={`tab-item ${activeTab === 'posts' ? 'active' : ''}`} 
                    onClick={() => handleTabClick('posts')}
                >
                    <span className="icon">▦</span> POSTS
                </button>
                <button 
                    className={`tab-item ${activeTab === 'saved' ? 'active' : ''}`} 
                    onClick={() => handleTabClick('saved')}
                >
                    <span className="icon">🔖</span> SAVED
                </button>
                <button 
                    className={`tab-item ${activeTab === 'tagged' ? 'active' : ''}`} 
                    onClick={() => handleTabClick('tagged')}
                >
                    <span className="icon">👤</span> TAGGED
                </button>
            </div>

            {/* Conditionally render grid based on activeTab state */}
            {activeTab === 'posts' && (
                 <div className="profile-posts-grid">
                    {posts.map(post => (
                         <div className="explore-item" key={post.id}>
                            <img src={post.img} alt={`Post ${post.id}`} />
                        </div>
                    ))}
                </div>
            )}
             {activeTab === 'saved' && (
                <div>{/* Placeholder for Saved Posts */}<h2>Saved Posts Grid Coming Soon...</h2></div>
            )}
             {activeTab === 'tagged' && (
                <div>{/* Placeholder for Tagged Posts */}<h2>Tagged Posts Grid Coming Soon...</h2></div>
            )}
        </div>
    );
};
export default ProfilePage; 