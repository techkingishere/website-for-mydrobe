// import React from 'react'; // Remove unused import
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import DrobesPage from './pages/DrobesPage';
import SettingsPage from './pages/SettingsPage';
import AppLayout from './layouts/AppLayout';
import ActionHandlerPage from './pages/ActionHandlerPage';
import './App.css';

// Import the context and provider from the dedicated file
import { AuthProvider, useAuth } from './context/AuthContext';

// Keep ProtectedRoute definition here, but ensure it uses the imported useAuth
const ProtectedRoute = () => {
  const { currentUser, loading, isVerified } = useAuth(); // Uses imported useAuth

  if (loading) {
    return <div>Loading...</div>; 
  }

  // Redirect to landing if not logged in OR if logged in but not verified
  if (!currentUser || !isVerified) {
    console.log('ProtectedRoute: Redirecting - User:', currentUser ? currentUser.uid : 'null', 'Verified:', isVerified);
    return <Navigate to="/" replace />; 
  }

  // Render the protected component if logged in AND verified
  return <Outlet />; 
};

function App() {
  return (
    // Use the imported AuthProvider
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        {/* Add route for handling Firebase actions */}
        <Route path="/auth/action" element={<ActionHandlerPage />} />
        {/* Add other public routes like /signup if needed outside the modal */}
        {/* <Route path="/signup" element={<SignUpPage />} /> */}

        {/* Protected Routes - Use AppLayout */}
        <Route element={<ProtectedRoute />}> 
          {/* Render AppLayout for /app and its children */}
          <Route path="/app" element={<AppLayout />}>
            {/* HomePage is the default view inside AppLayout */}
            <Route index element={<HomePage />} /> 
            <Route path="search" element={<SearchPage />} />
            <Route path="create" element={<DrobesPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            {/* Add other routes that should use AppLayout here */}
            {/* Example: <Route path="profile" element={<ProfilePage />} /> */}
          </Route>
        </Route>

        {/* Catch-all or 404 route? - Placed outside protected routes */}
        {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
