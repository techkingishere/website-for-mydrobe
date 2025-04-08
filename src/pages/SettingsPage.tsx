import React from 'react';
import './SettingsPage.css';

// Placeholder Icons (Replace with actual icons later if needed)

// Define specific icons based on the reference image (simplified placeholders)
const EditProfileIcon = () => <svg fill="currentColor" height={24} width={24} viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" stroke="currentColor" strokeWidth="0.5" fill="none"/><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" opacity="0.3"/></svg>; // Using a standard person icon
const NotificationsIcon = () => <svg fill="none" stroke="currentColor" strokeWidth="1.5" height={24} width={24} viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9m-4.27 13a2 2 0 01-3.46 0"/></svg>; // Bell
const ProfessionalIcon = () => <svg fill="none" stroke="currentColor" strokeWidth="1.5" height={24} width={24} viewBox="0 0 24 24"><path d="M10.8 4.8H7.2a2.4 2.4 0 00-2.4 2.4V21l4.8-3.6 4.8 3.6V7.2a2.4 2.4 0 00-2.4-2.4zM16.8 4.8a2.4 2.4 0 012.4 2.4V21l-4.8-3.6"/></svg>; // Storefront-like
const CreatorToolsIcon = () => <svg fill="none" stroke="currentColor" strokeWidth="1.5" height={24} width={24} viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg>; // Bar chart-like
const PrivacyIcon = () => <svg fill="none" stroke="currentColor" strokeWidth="1.5" height={24} width={24} viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>; // Lock
const CloseFriendsIcon = () => <svg fill="none" stroke="currentColor" strokeWidth="1.5" height={24} width={24} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>; // Star
const BlockedIcon = () => <svg fill="none" stroke="currentColor" strokeWidth="1.5" height={24} width={24} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>; // Circle with slash
const HideIcon = () => <svg fill="none" stroke="currentColor" strokeWidth="1.5" height={24} width={24} viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zm0 0l22 0"/></svg>; // Eye with slash (simplified)
const MessagesRepliesIcon = () => <svg fill="none" stroke="currentColor" strokeWidth="1.5" height={24} width={24} viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>; // Chat bubble
const TagsMentionsIcon = () => <svg fill="none" stroke="currentColor" strokeWidth="1.5" height={24} width={24} viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M16 8v8H8V8h8zm2-2H6v12h12V6z"/><path d="M12 2a10 10 0 00-7.07 17.07A10 10 0 1019.07 4.93 9.93 9.93 0 0012 2z"/></svg>; // @ symbol like
const CommentsIcon = () => <svg fill="none" stroke="currentColor" strokeWidth="1.5" height={24} width={24} viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>; // Speech bubble
const SharingReuseIcon = () => <svg fill="none" stroke="currentColor" strokeWidth="1.5" height={24} width={24} viewBox="0 0 24 24"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>; // Refresh/cycle arrows
const RestrictedIcon = () => <svg fill="none" stroke="currentColor" strokeWidth="1.5" height={24} width={24} viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/><path d="M4.93 4.93l14.14 14.14"/></svg>; // Person with slash

// New Icons from the second image
const HiddenWordsIcon = () => <svg fill="none" stroke="currentColor" strokeWidth="1.5" height={24} width={24} viewBox="0 0 24 24"><path d="M4 7V6a2 2 0 012-2h12a2 2 0 012 2v1M4 7h16M4 7l-.7 6.3a2 2 0 002 2.7h13.4a2 2 0 002-2.7L20 7M9 12h6"/><path d="M10 4h4"/></svg>; // Aa like icon
const MutedAccountsIcon = () => <svg fill="none" stroke="currentColor" strokeWidth="1.5" height={24} width={24} viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9m-4.27 13a2 2 0 01-3.46 0"/><path d="M6.5 6.5l11 11"/></svg>; // Bell with slash
const ContentPrefsIcon = () => <svg fill="none" stroke="currentColor" strokeWidth="1.5" height={24} width={24} viewBox="0 0 24 24"><path d="M12 2H4a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2V12"/><path d="M22 4H12a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2zm-8 6l4-2-4-2v4z"/></svg>; // Media/Play icon stack
const LikeShareCountIcon = () => <svg fill="none" stroke="currentColor" strokeWidth="1.5" height={24} width={24} viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/><path d="M4.93 4.93l14.14 14.14"/></svg>; // Heart with slash

const SettingsPage: React.FC = () => {
  return (
    <div className="settings-page">
      <div className="settings-section">
        <h2>How you use MyDrobe</h2> {/* Updated title */}
        <div className="settings-item edit-profile-item">
          <EditProfileIcon />
          <span>Edit profile</span>
        </div>
        <div className="settings-item">
          <NotificationsIcon />
          <span>Notifications</span>
        </div>
      </div>

      <div className="settings-section">
        <h2>For professionals</h2>
        <div className="settings-item">
          <ProfessionalIcon />
          <span>Professional account</span>
        </div>
        <div className="settings-item">
          <CreatorToolsIcon />
          <span>Creator tools and controls</span>
        </div>
      </div>

      <div className="settings-section">
        <h2>Who can see your content</h2>
        <div className="settings-item">
          <PrivacyIcon />
          <span>Account privacy</span>
        </div>
        <div className="settings-item">
          <CloseFriendsIcon />
          <span>Close Friends</span>
        </div>
        <div className="settings-item">
          <BlockedIcon />
          <span>Blocked</span>
        </div>
        <div className="settings-item">
          <HideIcon />
          <span>Hide story and live</span>
        </div>
      </div>

      <div className="settings-section">
        <h2>How others can interact with you</h2>
        <div className="settings-item">
          <MessagesRepliesIcon />
          <span>Messages and story replies</span>
        </div>
        <div className="settings-item">
          <TagsMentionsIcon />
          <span>Tags and mentions</span>
        </div>
        <div className="settings-item">
          <CommentsIcon />
          <span>Comments</span>
        </div>
        <div className="settings-item">
          <SharingReuseIcon />
          <span>Sharing and reuse</span>
        </div>
        <div className="settings-item">
          <RestrictedIcon />
          <span>Restricted accounts</span>
        </div>
        <div className="settings-item">
          <HiddenWordsIcon />
          <span>Hidden Words</span>
        </div>
      </div>

      <div className="settings-section">
        <h2>What you see</h2>
        <div className="settings-item">
          <MutedAccountsIcon />
          <span>Muted accounts</span>
        </div>
        {/* --- START TEST: Add dummy items to force scroll --- */}
        {[...Array(20)].map((_, i) => (
          <div key={`dummy-${i}`} className="settings-item">
             <MutedAccountsIcon />
             <span>Dummy Item {i + 1}</span>
           </div>
        ))}
         {/* --- END TEST --- */}
        <div className="settings-item">
          <ContentPrefsIcon />
          <span>Content preferences</span>
        </div>
        <div className="settings-item">
          <LikeShareCountIcon />
          <span>Like and share counts</span>
        </div>
      </div>

       {/* Add more sections as needed */}

    </div>
  );
};

export default SettingsPage; 
 
 
 
 
 
 
 
 