import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth"; // <-- Import Firebase function
import { auth } from '../firebaseConfig'; // <-- Import auth object

// TODO: Import actual icons
const googleLogo = '[G]';
const appleLogo = '[A]';
const closeIcon = 'X'; // Placeholder

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  // State for combined Email/Password login (simplification for now)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Placeholder handlers
  const handleGoogleSignIn = () => console.log('Google Sign In');
  const handleAppleSignIn = () => console.log('Apple Sign In');
  
  // Combined Sign In handler
  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Sign-in successful.
      console.log('Sign In Successful');
      onClose(); // Close the modal on successful sign-in
      // Navigation to /app will happen automatically via AuthContext listener
    } catch (err) {
      console.error("Sign In Error:", err);
      setError("Invalid email or password. Please try again."); // Generic error for sign-in
      // You could add more specific error checks here if needed (e.g., 'auth/user-not-found', 'auth/wrong-password')
    }
  };
  
  const handleForgotPassword = () => console.log('Forgot Password');

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}> {/* Close on overlay click */} 
      <div className="modal-content sign-in-modal-content" onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside */} 
        <button className="close-modal-btn" onClick={onClose}>{closeIcon}</button>
        {/* <div className="modal-logo">X</div> Replace with mydrobe logo/icon */}
        <h2 className="modal-title">Sign in to mydrobe</h2>

        <button className="social-signup google" onClick={handleGoogleSignIn}>
          {googleLogo} Sign in with Google
        </button>
        <button className="social-signup apple" onClick={handleAppleSignIn}>
          {appleLogo} Sign in with Apple
        </button>

        <div className="divider"><span>or</span></div>

        <form onSubmit={handleSignIn}>
          <div className="form-group">
            <input
              type="email" // Changed type to email
              placeholder="Email" // Updated placeholder
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
           <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>} {/* Display error */} 
          <button type="submit" className="next-btn"> {/* Keep class, text changed */} 
            Sign In
          </button>
        </form>

        <button className="forgot-password-btn" onClick={handleForgotPassword}>
          Forgot password?
        </button>

        <p className="signup-prompt">
          Don't have an account? <Link to="/signup" onClick={onClose}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignInModal; 