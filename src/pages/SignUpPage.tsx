import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';

// TODO: Define form field interfaces if needed

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Example field
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    if (!loading && currentUser) {
      navigate('/app');
    }
  }, [currentUser, loading, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    console.log('Attempting Sign Up:', { email, username });

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Sign Up Successful:', userCredential.user);
      // TODO: Optionally set user profile display name with username here
      navigate('/app');
    } catch (err) {
      // Handle Errors here.
      console.error("Sign Up Error:", err);
      // Type checking for error object
      if (err instanceof Error && 'code' in err && typeof err.code === 'string') {
        const errorCode = err.code;
        const errorMessage = err.message;
        // Provide user-friendly error messages
        if (errorCode === 'auth/email-already-in-use') {
          setError('This email address is already in use.');
        } else if (errorCode === 'auth/weak-password') {
          setError('Password should be at least 6 characters.');
        } else {
          setError('Failed to create account. Please try again.');
        }
        console.error(errorCode, errorMessage);
      } else {
        // Handle cases where the error is not in the expected format
        setError('An unexpected error occurred. Please try again.');
        console.error("Unexpected error format:", err);
      }
    }
  };

  if (loading || currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="signup-container"> {/* Reuse or create styles */}
      <header>
        <h1>Create your account</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-describedby="passwordHelp"
            />
            <small id="passwordHelp" className="form-text text-muted">Password should be at least 6 characters.</small>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-btn">
            Sign Up
          </button>
        </form>
        <p className="terms">
           By signing up, you agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>, including <a href="/cookies">Cookie Use</a>.
        </p>
      </main>
      <footer>
        <p>Already have an account?</p>
        <Link to="/login" className="sign-in-link">Sign in</Link>
      </footer>
    </div>
  );
};

export default SignUpPage; 