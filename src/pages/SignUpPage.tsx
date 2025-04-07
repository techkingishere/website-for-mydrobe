import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// TODO: Define form field interfaces if needed

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Example field

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Sign Up Submitted:', { email, password, username });
    // TODO: Implement actual sign-up logic (API call, validation, etc.)
    alert('Sign Up functionality not yet implemented.');
  };

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
            />
            {/* TODO: Add password requirements hint */}
          </div>
          {/* TODO: Add Date of Birth, etc. if needed */}
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