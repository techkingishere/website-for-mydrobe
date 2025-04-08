import React from 'react';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css'; // We'll create this next

// Placeholder Icons (replace with actual SVGs if available/needed)
const SettingsIcon = () => (
    <svg aria-label="Options" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
      <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"></path>
      <circle cx="12" cy="12" r="11.5" fill="none" stroke="currentColor" stroke-width="1"></circle> {/* This might need adjustment for exact IG look */} 
    </svg>
  );
const GridIcon = () => (
    <svg aria-label="Grid view" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12">
        <path d="M4 1H1v3h3V1zm4 0h3v3H8V1zm5 0h3v3h-3V1zM4 7H1v3h3V7zm4 0h3v3H8V7zm5 0h3v3h-3V7zM4 13H1v3h3v-3zm4 0h3v3H8v-3zm5 0h3v3h-3v-3zm5 0h3v3h-3v-3zm-5 6H8v3h3v-3zm5 0h3v3h-3v-3zm-5-6H8v3h3v-3zm5 0h3v3h-3v-3z" fillRule="evenodd"></path>
        {/* Fallback path if above isn't right */}
        {/* <path d="M3 3h18v18H3z" fill="none" stroke="currentColor" stroke-width="2"/> 
        <line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" stroke-width="2"/>
        <line x1="15" y1="3" x2="15" y2="21" stroke="currentColor" stroke-width="2"/>
        <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" stroke-width="2"/>
        <line x1="3" y1="15" x2="21" y2="15" stroke="currentColor" stroke-width="2"/> */} 
    </svg>
);
const SavedIcon = () => (
    <svg aria-label="Saved" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12">
        <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
    </svg>
);
const TaggedIcon = () => (
    <svg aria-label="Tagged" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12">
        <path d="M10.401 21.116a1.004 1.004 0 0 0-.017.044c.004.01.01.02.017.03l.04.108c.16.425.5.762.947.919l.097.034c.148.052.302.078.458.078h7.999c.48 0 .928-.189 1.263-.51a1.734 1.734 0 0 0 .526-1.235v-8.013c0-.477-.19-.92-.514-1.249a1.79 1.79 0 0 0-1.25-.517H12a1.75 1.75 0 0 0-.495.08l-1.32.418a2.13 2.13 0 0 1-.907.217H7.98c-.533 0-1.047.21-1.42.58-.374.37-.58.87-.58 1.394v6.03c0 .52.207 1.03.58 1.406.373.37.887.58 1.42.58h2.42zM8.982 8.988a3.001 3.001 0 1 1-5.982.48A3 3 0 0 1 8.982 8.988zM18 16a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fillRule="evenodd"></path>
    </svg>
);
const CameraIcon = () => (
    <svg aria-label="Camera" fill="currentColor" height="64" role="img" viewBox="0 0 96 96" width="64">
        <path d="M48 8C25.8 8 8 25.8 8 48s17.8 40 40 40 40-17.8 40-40S70.2 8 48 8zm0 72c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm18.5-43c-1.1 0-2 .9-2 2v6h-6c-1.1 0-2 .9-2 2s.9 2 2 2h6v6c0 1.1.9 2 2 2s2-.9 2-2v-6h6c1.1 0 2-.9 2-2s-.9-2-2-2h-6v-6c0-1.1-.9-2-2-2z" fill="none" stroke="currentColor" stroke-width="4"></path>
        <path d="M48 30a18 18 0 1 0 0 36 18 18 0 0 0 0-36zm0 28a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" fill="currentColor"></path>
    </svg>
);


const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();

  // Placeholder data - replace with fetched data later
  const user = {
    username: currentUser?.displayName?.split(' ').join('').toLowerCase() || 'username', // Crude username generation
    displayName: currentUser?.displayName || 'Full Name', 
    photoURL: currentUser?.photoURL || 'https://via.placeholder.com/150/000000/FFFFFF?text=?', // Placeholder avatar
    bio: 'This is a sample bio.', // Placeholder
    postsCount: 0,
    followersCount: 2969, // Placeholder
    followingCount: 5753, // Placeholder
    };

    return (
        <div className="profile-container">
      {/* Profile Header */}
      <header className="profile-header">
        <div className="profile-avatar-container">
          <img src={user.photoURL} alt={`${user.displayName} avatar`} className="profile-avatar" />
        </div>
        <section className="profile-info">
                    <div className="profile-title">
            <h2 className="profile-username">{user.username}</h2>
            <div className="profile-actions">
              <button className="profile-action-btn edit-btn">Edit profile</button>
              <button className="profile-action-btn">View archive</button>
              <button className="profile-action-btn icon-btn"><SettingsIcon /></button>
                    </div>
                </div>
          <ul className="profile-stats">
            <li><span className="stat-number">{user.postsCount}</span> posts</li>
            <li><span className="stat-number">{user.followersCount}</span> followers</li>
            <li><span className="stat-number">{user.followingCount}</span> following</li>
          </ul>
          <div className="profile-bio">
            <span className="profile-name">{user.displayName}</span>
            {/* <span className="pronouns">Optional pronouns</span> */} 
            <p>{user.bio}</p>
            {/* <a href="#">Optional link</a> */} 
            </div>
        </section>
      </header>

      {/* Highlights - Placeholder */}
            <div className="profile-highlights">
        <div className="highlight-item new-highlight">
          <div className="highlight-circle add-highlight">+
                    </div>
                    <span className="highlight-name">New</span>
                </div>
        {/* Add mapped real highlights here */}
            </div>

      {/* Content Tabs */}
            <div className="profile-content-tabs">
        <button className="tab-item active">
            <GridIcon /> POSTS
                </button>
        <button className="tab-item">
            <SavedIcon /> SAVED
                </button>
        <button className="tab-item">
            <TaggedIcon /> TAGGED
                </button>
            </div>

      {/* Content Area - Placeholder for no posts */}
      <div className="profile-content-area">
        <div className="no-posts-placeholder">
            <div className="camera-icon-container">
                <CameraIcon />
                        </div>
            <h2>Share Photos</h2>
            <p>When you share photos, they will appear on your profile.</p>
            <button className="share-first-photo-btn">Share your first photo</button>
        </div>
        {/* Or render the actual post grid here */}
      </div>

        </div>
    );
};

export default ProfilePage; 