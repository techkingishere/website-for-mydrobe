import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
// TODO: Import modal components later

// TODO: Import actual icons later
const googleLogo = '[G]';
const appleLogo = '[A]';

const LoginPage: React.FC = () => {
  
  // Placeholder handlers - Implement actual logic later
  const handleGoogleSignup = () => console.log('Google Sign up clicked');
  const handleAppleSignup = () => console.log('Apple Sign up clicked');
  // No handler needed for the Sign in Link component

  return (
    <div className="login-container"> {/* Use class from CSS */} 
        <header>
            <h1>mydrobe</h1>
            <p>Connect with your style</p>
        </header>
        <main>
            <h2>Join now</h2>
            <button className="social-signup google" onClick={handleGoogleSignup}>
                {googleLogo} Sign up with Google
            </button>
            <button className="social-signup apple" onClick={handleAppleSignup}>
                 {appleLogo} Sign up with Apple
            </button>
            <div className="divider">
                <span>or</span>
            </div>
            <Link to="/signup" className="create-account button-link">
                Create account
            </Link>
            <p className="terms">
                By signing up, you agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
            </p>
        </main>
        <footer>
            <p>Already have an account?</p>
            {/* Use Link for internal navigation */}
            <Link to="/login" className="sign-in-link">Sign in</Link>
        </footer>

        {/* TODO: Render Sign In / Create Account Modals here based on state */}
    </div>
  );
};

export default LoginPage; 