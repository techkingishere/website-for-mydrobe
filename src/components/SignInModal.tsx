import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// TODO: Import actual icons
const googleLogo = '[G]';
const appleLogo = '[A]';
const closeIcon = 'X'; // Placeholder

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const [identifier, setIdentifier] = useState(''); // For phone, email, or username

  // Placeholder handlers
  const handleGoogleSignIn = () => console.log('Google Sign In');
  const handleAppleSignIn = () => console.log('Apple Sign In');
  const handleNext = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Next clicked with identifier:', identifier);
    // TODO: Implement logic to check identifier and potentially ask for password
    alert('Sign In Step 1 (Next) not fully implemented.');
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

        <form onSubmit={handleNext}>
          <div className="form-group">
            {/* No label shown in screenshot */}
            <input
              type="text"
              placeholder="Phone, email, or username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="next-btn">
            Next
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