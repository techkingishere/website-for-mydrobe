import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom'; // Link is no longer used
import { useNavigate } from 'react-router-dom'; // Only import useNavigate
import SignInModal from '../components/SignInModal';
import SignUpModal from '../components/SignUpModal'; // Import the new modal
import { useAuth } from '../context/AuthContext';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../firebaseConfig';
import GoogleLogo from '../assets/google_logo.svg?react';
// import appleLogoBlack from '../assets/apple_logo_black.png';
import { FirebaseError } from 'firebase/app';

// TODO: Import modal components later

// Placeholder data for logos (replace with actual imports/SVGs later)
// const googleLogo = '[G]'; // Remove placeholder
// const appleLogo = '[A]'; // Remove placeholder

const LoginPage: React.FC = () => {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const [googleError, setGoogleError] = useState<string | null>(null);

  console.log("LoginPage: Rendering - Loading:", loading, "User:", currentUser ? currentUser.uid : null);

  useEffect(() => {
    console.log("LoginPage: useEffect running - Loading:", loading, "User:", currentUser ? currentUser.uid : null);
    if (!loading && currentUser) {
      console.log("LoginPage: Redirecting to /app");
      navigate('/app');
    }
  }, [currentUser, loading, navigate]);

  // Effect to ensure body class is correct for login page
  useEffect(() => {
    document.body.classList.remove('in-app-view');
    console.log('LoginPage mounted: Removed in-app-view class from body (if present)');
  }, []); // Run only once on mount

  // Updated Google Signup/Signin handler
  const handleGoogleAuth = async () => {
    setGoogleError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google Sign-In Success:", result.user);
      // Navigation handled by AuthContext
    } catch (error) {
      console.error("Google sign-in error:", error);
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/popup-closed-by-user') {
          console.log("Google sign-in cancelled by user.");
          setGoogleError(null);
        } else {
          setGoogleError("Google sign-in failed. Please try again.");
        }
      } else {
        setGoogleError("An unexpected error occurred during Google sign-in.");
        console.error("Unexpected Google Auth error format (LoginPage):", error);
      }
    }
  };

  // Modal control functions
  const openSignInModal = () => setIsSignInModalOpen(true);
  const closeSignInModal = () => setIsSignInModalOpen(false);
  const openSignUpModal = () => setIsSignUpModalOpen(true);
  const closeSignUpModal = () => setIsSignUpModalOpen(false);

  return (
    <div className="login-container">
      <div className="login-content-wrapper">
        <header>
            <h1 className="brand-title">MYDROBE</h1>
            <p className="brand-tagline">Connect with your style</p>
        </header>
        <main>
            <h2 className="join-heading">Join now</h2>
            <button className="social-signup google" onClick={handleGoogleAuth}>
                <GoogleLogo className="button-icon" /> Sign up with Google
            </button>
            {/* REMOVE Apple Button */}
            {/* 
            <button className="social-signup apple" onClick={handleAppleSignup}>
                 <img src={appleLogoBlack} alt="Apple logo" className="button-icon apple-icon" /> Sign up with Apple
            </button>
            */}
            {/* Display Google specific error if any */}
            {googleError && <p className="error-message">{googleError}</p>}
            <div className="divider"><span>or</span></div> {/* Ensure span is used */}
            <button onClick={openSignUpModal} className="create-account button-link">
                Create account
            </button>
            <p className="terms">By signing up, you agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.</p>
        </main>
        <footer>
            <p>Already have an account?</p>
            <button onClick={openSignInModal} className="sign-in-link">
              Sign in
            </button>
        </footer>
      </div>

      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={closeSignInModal} 
        onSignInSuccess={() => { console.log("Sign in success callback triggered from LoginPage."); }}
      />
      <SignUpModal isOpen={isSignUpModalOpen} onClose={closeSignUpModal} />
    </div>
  );
};

export default LoginPage; 