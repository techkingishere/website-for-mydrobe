import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SignInModal from '../components/SignInModal';
import { useAuth } from '../context/AuthContext';

// TODO: Import modal components later

// Placeholder data for logos (replace with actual imports/SVGs later)
const googleLogo = '[G]';
const appleLogo = '[A]';

const LoginPage: React.FC = () => {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && currentUser) {
      navigate('/app');
    }
  }, [currentUser, loading, navigate]);

  // Placeholder handlers - Implement actual logic later
  const handleGoogleSignup = () => console.log('Google Sign up clicked'); // Keep this type of handler
  const handleAppleSignup = () => console.log('Apple Sign up clicked'); // Keep this type of handler

  // Modal control functions
  const openSignInModal = () => setIsSignInModalOpen(true);
  const closeSignInModal = () => setIsSignInModalOpen(false);

  if (loading || currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="login-container"> {/* Use class from CSS */} 
        <header>
            <h1>mydrobe</h1>
            <p>Connect with your style</p>
        </header>
        <main>
            <h2>Join now</h2>
            {/* TODO: Replace handleSimulatedLogin with actual signup handlers */}
            <button className="social-signup google" onClick={handleGoogleSignup}>
                {googleLogo} Sign up with Google
            </button>
            <button className="social-signup apple" onClick={handleAppleSignup}>
                 {appleLogo} Sign up with Apple
            </button>
            <div className="divider"><span>or</span></div> {/* Ensure span is used */}
            {/* Change button back to Link */}
            <Link to="/signup" className="create-account button-link">
                Create account
            </Link>
            <p className="terms">By signing up, you agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.</p>
        </main>
        <footer>
            <p>Already have an account?</p>
            <button onClick={openSignInModal} className="sign-in-link">
              Sign in
            </button>
        </footer>

        <SignInModal isOpen={isSignInModalOpen} onClose={closeSignInModal} />
    </div>
  );
};

export default LoginPage; 