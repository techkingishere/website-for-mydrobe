import React, { useState } from 'react';
// import { Link } from 'react-router-dom'; <-- REMOVE unused import
import { signInWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from "firebase/auth"; // <-- Import Google provider and popup
import { auth } from '../firebaseConfig'; // <-- Import auth object
import GoogleLogo from '../assets/google_logo.svg?react'; 
// import AppleLogo from '../assets/apple_logo.svg?react';   
import { FirebaseError } from 'firebase/app';

// TODO: Import actual icons
// const googleLogo = '[G]'; // Remove placeholder
// const appleLogo = '[A]'; // Remove placeholder

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInSuccess: () => void; // Keep this prop
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onSignInSuccess }) => {
  // State for combined Email/Password login (simplification for now)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null); // <-- Google error state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Add visibility state

  // --- Forgot Password State --- 
  const [forgotPasswordViewActive, setForgotPasswordViewActive] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [isSendingReset, setIsSendingReset] = useState(false);

  // Determine button text based on state
  const closeButtonIcon = '✕'; // Use this variable

  // Google Sign In handler (same as in LoginPage)
  const handleGoogleSignIn = async () => {
    setGoogleError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Google Sign In Successful (Modal):', result.user);
      onSignInSuccess(); // Trigger success
      onClose(); // Close modal on success
      // Navigation happens via AuthContext
    } catch (error) {
      console.error("Google Auth Error (Modal):", error);
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/popup-closed-by-user') {
          console.log("Google sign-in cancelled by user.");
          setGoogleError(null); // Don't show error if cancelled
        } else {
          setGoogleError(`Google sign-in failed: ${error.message}`);
        }
      } else {
        setGoogleError('An unexpected error occurred during Google sign-in.');
        console.error("Unexpected Google Auth error format (Modal):", error);
      }
    }
  };

  // Placeholder handlers
  // const handleAppleSignIn = () => console.log('Apple Sign In clicked');
  
  // Combined Sign In handler
  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setGoogleError(null);
    setIsSubmitting(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setIsSubmitting(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Verification Check 
      if (!user.emailVerified) {
        console.warn("Sign-in attempt by unverified email:", user.email);
        setError("Your email address is not verified. Please check your inbox for the verification link (a new one was just sent).");
        try {
          await sendEmailVerification(user); 
          console.log("Verification email re-sent to:", user.email);
        } catch (verificationError) {
          console.error("Error resending verification email:", verificationError);
        }
        // Keep modal open
        setIsSubmitting(false);
        return; 
      }
      // Sign-in Success (Verified) 
      console.log("Sign-in successful for verified user:", user.email);
      setError(null);
      onSignInSuccess(); 
      onClose(); 
    } catch (error) {
      console.error("Firebase Sign-In Error:", error);
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            setError("Invalid email or password.");
            break;
          case 'auth/invalid-email':
            setError("Please enter a valid email address.");
            break;
          case 'auth/too-many-requests':
            setError("Too many sign-in attempts. Please try again later.");
            break;
          default:
            setError("An unexpected error occurred during sign-in.");
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // --- Handle Forgot Password Request --- 
  const handleSendResetEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    setForgotPasswordMessage(null);
    setError(null);
    setGoogleError(null);

    if (!forgotPasswordEmail) {
      setForgotPasswordMessage({ type: 'error', text: 'Please enter your email address.'});
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(forgotPasswordEmail)) {
       setForgotPasswordMessage({ type: 'error', text: 'Please enter a valid email address.'});
       return;
    }

    setIsSendingReset(true);
    try {
      await sendPasswordResetEmail(auth, forgotPasswordEmail);
      setForgotPasswordMessage({ 
        type: 'success', 
        text: `Password reset link sent to ${forgotPasswordEmail}. Please check your inbox.`
      });
      setForgotPasswordEmail('');
    } catch (error) {
      console.error("Send Password Reset Error:", error);
       if (error instanceof FirebaseError && error.code === 'auth/user-not-found') {
          setForgotPasswordMessage({ 
              type: 'success', 
              text: `If an account exists for ${forgotPasswordEmail}, a password reset link has been sent.`
          });
       } else {
          setForgotPasswordMessage({ type: 'error', text: 'Failed to send password reset email. Please try again.'});
       }
    } finally {
      setIsSendingReset(false);
    }
  };

  // --- View Toggling Functions --- 
  const showForgotPasswordView = () => {
    setForgotPasswordViewActive(true);
    setForgotPasswordMessage(null);
    setError(null);
    setGoogleError(null);
    setForgotPasswordEmail(email); // Pre-fill with sign-in email
  };

  const showSignInView = () => {
    setForgotPasswordViewActive(false);
    setForgotPasswordMessage(null);
    setError(null);
    setGoogleError(null);
  };

  // Add visibility toggle handler
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // --- Effect to Reset State on Open/Close --- 
  React.useEffect(() => {
    if (!isOpen) return; // Only reset when opening

    setEmail('');
    setPassword('');
    setError(null);
    setGoogleError(null);
    setIsSubmitting(false);
    setForgotPasswordViewActive(false);
    setForgotPasswordEmail('');
    setForgotPasswordMessage(null);
    setIsSendingReset(false);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content sign-in-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose} disabled={isSubmitting || isSendingReset}>{closeButtonIcon}</button>
        <h1 className="modal-brand-title">MYDROBE</h1>
        {/* <h2 className="modal-title">Sign in to mydrobe</h2> <-- REMOVED FROM HERE */}

        {/* REMOVE Google Button and Divider from here */}
        {/* <button className="social-signup google" ... </button> */}
        {/* <div className="divider"><span>or</span></div> */}


        {/* --- Conditional Rendering: Sign In vs Forgot Password --- */} 
        {!forgotPasswordViewActive ? (
          <> {/* Sign In View */}
            {/* MOVED Title, Google Button, and Divider INSIDE Sign In view */}
             <h2 className="modal-title">Sign in to MYDROBE</h2>
            <button className="social-signup google" onClick={handleGoogleSignIn} disabled={isSubmitting}>
                <GoogleLogo className="button-icon" /> Sign in with Google
            </button>
            {/* Display Google error if any */}
            {googleError && <p className="error-message">{googleError}</p>}
            <div className="divider"><span>or</span></div>

            <form onSubmit={handleSignIn}>
              <div className="form-group">
                <input
                  type="email" // Changed type to email
                  placeholder="Email" // Updated placeholder
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
               <div className="form-group password-input-group"> {/* Inner positioning context div */}
                    <input
                      type={isPasswordVisible ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                    <button 
                        type="button" 
                        onClick={togglePasswordVisibility}
                      className="password-toggle-btn" // Apply specific class
                      aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                      disabled={isSubmitting} // Disable if submitting
                    >
                      {/* Eye Icon SVG */}
                        {isPasswordVisible ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        )}
                    </button>
                </div>
              {error && <p className="error-message">{error}</p>}
            </form>

            <button 
              type="submit" 
              className="submit-btn next-btn" 
              onClick={handleSignIn} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
            <button onClick={showForgotPasswordView} className="forgot-password-btn link-button" disabled={isSubmitting}>
              Forgot password?
            </button>
            <div className="signup-prompt">
              Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onClose(); /* Open SignUpModal externally */ }}>Sign up</a> 
            </div>
          </>
        ) : (
          <> {/* Forgot Password View */}
            <h2 className="modal-title">Reset your password</h2> {/* <-- ADD Correct Title */} 
             <p className="info-text">Enter your email address and we'll send you a link to get back into your account.</p>
            <form onSubmit={handleSendResetEmail} className="forgot-password-view">
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required
                  disabled={isSendingReset}
                />
              </div>
               {/* Display success/error message */}
              {forgotPasswordMessage && (
                <p className={`modal-message ${forgotPasswordMessage.type}-message`}>
                  {forgotPasswordMessage.text}
                </p>
              )}
              <button 
                type="submit" 
                className="submit-btn next-btn" 
                disabled={isSendingReset}
              >
                {isSendingReset ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
             <button onClick={showSignInView} className="link-button back-link" disabled={isSendingReset}>
               Back to Sign In
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default SignInModal; 