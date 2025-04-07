import { Routes, Route, Navigate, Link } from 'react-router-dom';
import type { JSX } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';
import { useLocation } from 'react-router-dom';

// Simple protected route component simulation
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
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
    </AuthProvider>
  );
}

export default App;
