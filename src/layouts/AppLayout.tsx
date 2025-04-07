import React from 'react';
import { Outlet, Link } from 'react-router-dom'; // Use Outlet for nested routes

const AppLayout: React.FC = () => {

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/'; // Redirect to login page route
  };

  // TODO: Migrate sidebar styles from app.html/style.css here or to a separate CSS module
  // TODO: Implement active link styling
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}> {/* Basic layout style */} 
      <aside className="sidebar"> {/* Reuse class names from previous CSS */} 
        <div className="sidebar-logo">mydrobe</div>
        <div className="sidebar-search">
             <span>🔍</span>
             <input type="text" placeholder="Search" />
        </div>
        <nav className="sidebar-nav">
            {/* Use Link component for navigation */}
            <Link to="/app" className="nav-link"> {/* Default app route */} 
                 <span className="icon">🏠</span> Home
            </Link>
            <Link to="/app/explore" className="nav-link">
                 <span className="icon">🧭</span> Explore
            </Link>
            <Link to="/app/messages" className="nav-link">
                 <span className="icon">✉️</span> Messages
            </Link>
            <Link to="/app/profile" className="nav-link">
                 <span className="icon">👤</span> Profile
            </Link>
        </nav>
        <div className="sidebar-footer">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <button onClick={handleLogout} className="logout-btn">Log Out</button>
            <p>© 2024 mydrobe</p>
        </div>
      </aside>
      <main className="main-content"> {/* Reuse class name */} 
        <Outlet /> {/* Nested routes render here */} 
      </main>
       {/* TODO: Add FAB here */} 
    </div>
  );
};

export default AppLayout; 