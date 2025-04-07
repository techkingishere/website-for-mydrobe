import { Routes, Route, Navigate, Link } from 'react-router-dom';
import type { JSX } from 'react';
import LoginPage from './pages/LoginPage';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

// Simple protected route component simulation
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route 
        path="/app" 
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
         {/* Nested routes within AppLayout */}
         {/* Index route for /app */}
        <Route index element={<HomePage />} /> 
        <Route path="explore" element={<ExplorePage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="profile" element={<ProfilePage />} />
         {/* Add other nested routes here if needed */}
      </Route>
      {/* Optional: Add a 404 Not Found route */}
       <Route path="*" element={<div><h2>404 Not Found</h2><Link to="/">Go Home</Link></div>} />
    </Routes>
  );
}

export default App;
