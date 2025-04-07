import React from 'react';
// TODO: Import modal components later

// Placeholder data for logos (replace with actual imports/SVGs later)
const googleLogo = '[G]';
const appleLogo = '[A]';

const LoginPage: React.FC = () => {
  
  const handleSimulatedLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = '/app'; 
  };
  
  // TODO: Implement modal opening/closing state and logic
  const openCreateAccountModal = () => alert('Open Create Account Modal (Not implemented)');
  const openSignInModal = () => alert('Open Sign In Modal (Not implemented)');

  return (
    <div className="login-container"> {/* Use class from CSS */} 
        <header>
            <h1>mydrobe</h1>
            <p>Connect with your style</p>
        </header>
        <main>
            <h2>Join now</h2>
            <button className="social-signup google" onClick={handleSimulatedLogin}>
                {googleLogo} Sign up with Google
            </button>
            <button className="social-signup apple" onClick={handleSimulatedLogin}>
                 {appleLogo} Sign up with Apple
            </button>
            <div className="divider">or</div>
            <button className="create-account" onClick={openCreateAccountModal}>Create account</button>
            <p className="terms">By signing up, you agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</p>
        </main>
        <footer>
            <p>Already have an account?</p>
            <button className="sign-in" onClick={openSignInModal}>Sign in</button>
        </footer>

        {/* TODO: Render Sign In / Create Account Modals here based on state */}
    </div>
  );
};

export default LoginPage; 