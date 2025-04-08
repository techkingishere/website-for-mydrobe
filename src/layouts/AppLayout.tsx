import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // Import the Sidebar
import FloatingActionButton from '../components/FloatingActionButton'; // Import the FAB
import './AppLayout.css'; // We will create this CSS file next

const AppLayout: React.FC = () => {
  const location = useLocation(); // Get location info

  useEffect(() => {
    // Add class when entering app layout
    document.body.classList.add('in-app-view');
    console.log('Added in-app-view class to body');

    // Cleanup function to remove class when leaving app layout
    return () => {
      document.body.classList.remove('in-app-view');
      console.log('Removed in-app-view class from body');
    };
  }, [location]); // Re-run if location changes (might not be needed, but safe)

  // Define the click handler for the FAB
  const handleFabClick = () => {
    if (location.pathname === '/app/drobes') {
      // TODO: Implement actual "Create Drobe" logic (e.g., open modal)
      console.log('FAB Clicked on Drobes page - Initiate Create Drobe!');
    } else {
      // Handle clicks on other pages (optional)
      // For now, maybe a general action or log
      console.log(`FAB Clicked on page: ${location.pathname}`);
      // TODO: Implement default action or context-specific actions for other pages
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Outlet /> {/* Child routes like HomePage will render here */}
        </div>
      <FloatingActionButton onClick={handleFabClick} />
    </div>
  );
};

export default AppLayout; 