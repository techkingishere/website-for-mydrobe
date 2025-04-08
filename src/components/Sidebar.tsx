import React from 'react';
import { NavLink } from 'react-router-dom';
import { signOut } from "firebase/auth"; // <-- Import Firebase signout
import { auth } from '../firebaseConfig'; // <-- Import auth
import './Sidebar.css'; // We will create this file next

// Updated Icons (using SVG paths for better control)
const HomeIconOutline = () => (
  <svg aria-label="Home" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    <path d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997h0A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
  </svg>
);

// New Filled Home Icon
const HomeIconFilled = () => (
  <svg aria-label="Home" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    <path d="M22 11.543V22h-7.005v-5.455a2.997 2.997 0 0 0-2.997-2.997h0A2.997 2.997 0 0 0 9.005 16.545V22H2V11.543L12 2l10 9.543Z"></path>
  </svg>
);

const SearchIconOutline = () => (
  <svg aria-label="Search" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24">
    <path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
    <line stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22"></line>
  </svg>
);
const SearchIconFilled = () => (
  <svg aria-label="Search" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    {/* Filled circle using outline path dimensions */}
    <path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z"></path>
    {/* Thicker Handle */}
    <line stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" x1="16.511" x2="22" y1="16.511" y2="22"></line>
  </svg>
);
const MessagesIconOutline = () => (
  <svg aria-label="Direct" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24">
    {/* Outline Path with thinner stroke */}
    <path d="M22 3H2a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM2.379 4h19.242L12 11.773 2.379 4zm19.088 16H2.533V6.227L12 13.227l9.467-7V20z" stroke="currentColor" strokeWidth="1.0"></path>
  </svg>
);
const MessagesIconFilled = () => (
  <svg aria-label="Direct" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    <path d="M1 19V5a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4zm19-14a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6.379l7.548 4.23a3 3 0 0 0 2.904 0L20 11.379V5z"/>
  </svg>
);
const BookmarkIconOutline = () => (
  <svg aria-label="Saved" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24">
    <polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
  </svg>
);
const BookmarkIconFilled = () => (
  <svg aria-label="Saved" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    {/* Updated polygon to be filled */}
    <polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21"></polygon> 
  </svg>
);
const ProfileIconFilled = () => (
  <svg aria-label="Profile" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fillRule="evenodd"></path>
  </svg>
);
// New Outline Icon
const ProfileIconOutline = () => (
  <svg aria-label="Profile" fill="none" height="24" role="img" viewBox="0 0 24 24" width="24">
    <path d="M12 11.815a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="1.5"></path>
    <path d="M4.093 20.361A8.994 8.994 0 0 1 12 15.5a8.994 8.994 0 0 1 7.907 4.861" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
  </svg>
);
const SettingsIcon = () => (
  <svg aria-label="Settings" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
    <path d="M19.04 12.15c0-.01 0-.01 0 0 .02-.21.03-.43.03-.65s-.01-.44-.03-.65c0 0 0-.01 0-.01l1.95-1.52a.82.82 0 0 0 .24-.99l-1.6-2.78a.82.82 0 0 0-.98-.41l-2.34.94a6.76 6.76 0 0 0-1.42-.81L14.4 3.5a.82.82 0 0 0-.82-.81H10.4a.82.82 0 0 0-.82.81l-.45 2.36a6.59 6.59 0 0 0-1.42.81l-2.34-.94a.82.82 0 0 0-.98.41L2.8 8.93a.82.82 0 0 0 .24.99l1.95 1.52c0 .01 0 .01 0 0-.02.21-.03.43-.03.65s.01.44.03.65c0 0 0 .01 0 .01l-1.95 1.52a.82.82 0 0 0-.24.99l1.6 2.78a.82.82 0 0 0 .98.41l2.34-.94a6.76 6.76 0 0 0 1.42.81l.45 2.36a.82.82 0 0 0 .82.81h3.2a.82.82 0 0 0 .82-.81l.45-2.36a6.59 6.59 0 0 0 1.42-.81l2.34.94a.82.82 0 0 0 .98-.41l1.6-2.78a.82.82 0 0 0-.24-.99zM12 15.5a3.5 3.5 0 1 1 3.5-3.5 3.5 3.5 0 0 1-3.5 3.5z" fillRule="evenodd"></path>
  </svg>
);
// Updated Logout Icon (Simple Door Outline)
const LogoutIcon = () => (
    <svg aria-label="Logout" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
        {/* Simple rectangle door path with thinner stroke */}
        <path d="M16 4h-6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 14h-6V6h6v12z" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
        {/* Optional Doorknob */}
        <circle cx="14.5" cy="12" r="1" fill="currentColor"></circle>
        {/* Previous paths commented out */}
        {/* 
        <path d="M16 4h-4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h4v10H8v-3a1 1 0 0 0-2 0v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"></path>
        <path d="M8 11H2a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2z"></path>
        <path d="M5.707 9.293a1 1 0 1 0-1.414 1.414L6.586 13l-2.293 2.293a1 1 0 1 0 1.414 1.414L8 14.414l1.293 1.293a1 1 0 1 0 1.414-1.414L9.414 13l2.293-2.293a1 1 0 1 0-1.414-1.414L8 11.586z" style={{ display: 'none' }}></path>
         */}
    </svg>
);

const Sidebar: React.FC = () => {

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully via Sidebar button');
      // Navigation back to '/' will happen automatically via AuthContext listener
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src="/mydrobe-logo.png" alt="Mydrobe Logo" className="logo-image" /> 
        <span className="sidebar-logo-text">MYDROBE</span>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/app" className={({ isActive }) => "nav-link home-link" + (isActive ? " active" : "")} end>
          {({ isActive }) => (
              <>
                  {isActive ? <HomeIconFilled /> : <HomeIconOutline />}
                  <span>Home</span>
              </>
          )}
        </NavLink>
        <NavLink to="/app/search" className={({ isActive }) => "nav-link search-link" + (isActive ? " active" : "")}>
          {({ isActive }) => (
              <>
                  {isActive ? <SearchIconFilled /> : <SearchIconOutline />}
                  <span>Explore</span>
              </>
          )}
        </NavLink>
        <NavLink to="/app/create" className={({ isActive }) => "nav-link drobes-link" + (isActive ? " active" : "")}>
          {({ isActive }) => (
              <>
                  {isActive ? <BookmarkIconFilled /> : <BookmarkIconOutline />}
                  <span>Drobes</span>
              </>
          )}
        </NavLink>
        <NavLink to="/app/messages" className={({ isActive }) => "nav-link messages-link" + (isActive ? " active" : "")}>
           {({ isActive }) => (
              <>
                  {isActive ? <MessagesIconFilled /> : <MessagesIconOutline />}
                  <span>Inbox</span>
              </>
          )}
        </NavLink>
        <NavLink to="/app/profile" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
          {({ isActive }) => (
              <>
                  {isActive ? <ProfileIconFilled /> : <ProfileIconOutline />}
                  <span>Profile</span>
              </>
          )}
        </NavLink>
      </nav>
      <div className="sidebar-footer">
         <NavLink to="/app/settings" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
            <SettingsIcon />
            <span>Settings</span>
         </NavLink>
         {/* Add Logout button */}
         <button onClick={handleLogout} className="nav-link logout-btn"> 
            <LogoutIcon />
            <span>Log out</span>
         </button>
      </div>
    </div>
  );
};

export default Sidebar; 
 
 
 
 
 
 
 
 