import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth'; // Import Firebase functions and signOut
import { auth } from '../firebaseConfig'; // Import auth
import { FirebaseError } from 'firebase/app';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Standard email validation regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

type SignUpStep = 1 | 2; // Re-introduce Step type

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<SignUpStep>(1); // Re-introduce step state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');
  const [verificationCode, setVerificationCode] = useState(''); // Re-introduce verification code state
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [passwordInputStarted, setPasswordInputStarted] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Can still use for errors in step 1
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for password rules validation
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasLetter, setHasLetter] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);

  const emailValidationTimeoutRef = useRef<number | null>(null);

  // Validation function
  const validateEmail = (emailToValidate: string): boolean => {
    return emailRegex.test(emailToValidate);
  };

  // Clear timeout on component unmount
  useEffect(() => {
    return () => {
      if (emailValidationTimeoutRef.current) {
        clearTimeout(emailValidationTimeoutRef.current);
      }
    };
  }, []);

  // Handle email input change with debounced validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentEmail = e.target.value;
    setEmail(currentEmail);
    if (emailError) setEmailError(null);
    if (generalError) setGeneralError(null);

    if (emailValidationTimeoutRef.current) {
      clearTimeout(emailValidationTimeoutRef.current);
    }
    emailValidationTimeoutRef.current = window.setTimeout(() => {
      if (currentEmail.trim() !== '' && !validateEmail(currentEmail)) {
        setEmailError('Please enter a valid email.');
      } else {
        setEmailError(null);
      }
    }, 400);
  };

  // Updated handlePasswordChange to check rules
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentPassword = e.target.value;
    setPassword(currentPassword);
    if (!passwordInputStarted) {
      setPasswordInputStarted(true);
    }

    // Clear errors
    if (passwordError) setPasswordError(null);
    if (generalError) setGeneralError(null);

    // Check rules
    setIsLengthValid(currentPassword.length >= 8 && currentPassword.length <= 20);
    setHasLetter(/[a-zA-Z]/.test(currentPassword)); // Check for any letter
    setHasNumber(/\d/.test(currentPassword)); // Check for any digit
    setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/ .test(currentPassword)); // Final Correction: Remove unnecessary escapes
  };

  // Password input focus handler
  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
    // Clear blur-related error when focusing again
    setPasswordError(null);
  };

  // Password input blur handler
  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
    // Set error state only on blur if typing started, field not empty, and rules not met
    if (passwordInputStarted && password !== '' && !isPasswordStrongEnough) {
      // Set a generic error state just to trigger the icon
      setPasswordError('Password does not meet requirements.');
    } else {
      // Clear error on blur if empty or valid
      setPasswordError(null);
    }
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Determine if the overall password criteria are met (for potentially disabling submit)
  const isPasswordStrongEnough = useMemo(() => {
    return isLengthValid && hasLetter && hasNumber && hasSpecialChar;
  }, [isLengthValid, hasLetter, hasNumber, hasSpecialChar]);

  // Update isFormValid to include password strength check (optional, depends on requirement)
  const isFormValid = useMemo(() => {
    const isEmailValid = email.trim() !== '' && validateEmail(email);
    // const isPasswordFormatValid = password.length >= 6; // Firebase min length
    return (
      name.trim() !== '' &&
      isEmailValid &&
      emailError === null &&
      isPasswordStrongEnough && // Use the detailed check now
      month !== '' &&
      day !== '' &&
      year !== ''
    );
  }, [name, email, password, month, day, year, emailError, isPasswordStrongEnough]); // Add password strength dep

  // Determine if the verification code format is potentially valid (e.g., 6 digits)
  const isVerificationCodeFormatValid = useMemo(() => {
    return /^\d{6}$/.test(verificationCode); // Check for exactly 6 digits
  }, [verificationCode]);

  // Renamed back from handleCreateAccount
  const handleProceed = async (event: React.FormEvent) => {
    event.preventDefault();
    // Clear previous errors/success
    setGeneralError(null);
    setSuccessMessage(null);

    if (step === 1) {
      // --- Step 1: Create User, Send Email, Sign Out --- 
      setEmailError(null);
      setPasswordError(null);

      let isValid = true;
      if (!validateEmail(email)) {
        setEmailError('Please enter a valid email.');
        isValid = false;
      }
      if (!isPasswordStrongEnough) { // Check overall strength
        setPasswordError('Password does not meet all requirements.');
        isValid = false;
      }
      if (!name.trim()) { // Check other required fields too
        isValid = false;
      }
      if (!month || !day || !year) {
        isValid = false;
      }

      if (!isValid || !isFormValid || isSubmitting) { // Use isFormValid which includes strength check
        if (!generalError && !emailError && !passwordError) {
          setGeneralError("Please fill out all fields correctly and ensure password meets requirements.");
        }
        return;
      }

      setIsSubmitting(true);

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Firebase User Created:", user.uid);
        await sendEmailVerification(user);
        console.log("Verification email sent to:", user.email);
        await signOut(auth); // <-- SIGN OUT IMMEDIATELY
        console.log("User signed out, proceeding to verification step.");
        setStep(2); // Move to step 2
        // No success message here, step 2 is the next part
      } catch (error) {
        console.error("Firebase Account Creation Error:", error);
        if (error instanceof FirebaseError) {
          switch (error.code) {
            case 'auth/email-already-in-use':
              setEmailError('This email address is already in use.');
              break;
            case 'auth/weak-password':
              setPasswordError('Password is too weak (Firebase check).');
              break;
            case 'auth/invalid-email':
              setEmailError('Please enter a valid email.');
              break;
            default:
              setGeneralError('Failed to create account. Please try again.');
          }
        } else {
          setGeneralError('An unexpected error occurred. Please try again.');
        }
        setIsSubmitting(false);
      }

    } else if (step === 2) {
      // --- Step 2: Verification Code Submission (Placeholder) --- 
      setVerificationError(null); 
      if (!isVerificationCodeFormatValid) {
        setVerificationError("Please enter a 6-digit code.");
        return;
      }
      setIsSubmitting(true); // Optional: disable button briefly
      console.log('Simulating Verification for code:', verificationCode);
      // TODO: Implement actual code verification later if needed.
      // For now, just close the modal and user needs to sign in manually.
      setSuccessMessage("Account created. Please check your email to verify and then sign in.");
      setTimeout(() => {
        onClose(); 
      }, 3500);
    }
  };

  // Function to go back to step 1 from step 2
  const handleGoBack = () => {
    if (step === 2 && !isSubmitting) { // Prevent going back while submitting
      setStep(1);
      setVerificationCode('');
      setVerificationError(null);
      // Maybe clear email/password too? Or keep them?
    }
  };

  // Reset state when modal closes or opens
  useEffect(() => {
    if (isOpen) {
      setStep(1); // Reset to step 1
      // ... (reset all fields: name, email, password, dob, rules, errors, flags) ...
      setVerificationCode('');
      setVerificationError(null);
      // ... 
    }
    // ... cleanup ...
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const shouldShowPasswordRules = isPasswordFocused || password !== '';

  return (
    <div className="modal-overlay">
      <div className="modal-content sign-up-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* --- Conditional Header --- */}
        {step === 1 && (
          <>
            <button className="close-modal-btn" onClick={onClose} disabled={isSubmitting}>✕</button>
            <h1 className="modal-brand-title">MYDROBE</h1>
          </>
        )}
        {step === 2 && (
          <>
            <button className="back-modal-btn" onClick={handleGoBack} disabled={isSubmitting}>←</button>
            <h1 className="modal-brand-title">MYDROBE</h1>
          </>
        )}

        {/* Display General Error/Success (mostly for step 2 now) */}
        {generalError && <p className="error-message modal-message">{generalError}</p>}
        {successMessage && <p className="success-message modal-message">{successMessage}</p>}

        {/* --- Step 1 Content --- */} 
        {step === 1 && (
          <>
            <h2>Create your account</h2>
            <form onSubmit={handleProceed}>
              {/* Name Input */}
              <div className="form-group">
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isSubmitting} />
              </div>
              {/* Email Input */}
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleEmailChange}
                  className={emailError ? 'input-error' : ''}
                  required
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error-message" : undefined}
                  disabled={isSubmitting}
                />
                {emailError && <p id="email-error-message" className="error-message field-error-message">{emailError}</p>}
              </div>
              {/* Password Input with Toggle Button & Warning Icon */}
              <div className="form-group password-input-group">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  onFocus={handlePasswordFocus}
                  onBlur={handlePasswordBlur}
                  className={passwordError && !isPasswordFocused ? 'input-error' : ''}
                  required
                  aria-invalid={!!passwordError && !isPasswordFocused}
                  aria-describedby={passwordError ? "password-error-message" : undefined}
                  disabled={isSubmitting}
                />
                {/* Conditionally render Warning Icon (only on blur if error exists) */}
                {!isPasswordFocused && passwordError && (
                  <span className="password-warning-icon" aria-hidden="true">
                    {/* Simple SVG Warning Triangle */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
                {/* Eye Icon Button */}
                <button 
                  type="button" 
                  className="password-toggle-btn" 
                  onClick={togglePasswordVisibility}
                  aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                  disabled={isSubmitting}
                >
                  {isPasswordVisible ? (
                    // SVG for Eye (Visible) - Using Heroicons outline 'eye'
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    // SVG for Crossed-Out Eye (Hidden) - Using Heroicons outline 'eye-slash'
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Rules Indicator - Conditionally render */}
              {shouldShowPasswordRules && (
                <div className="password-rules-list">
                  <p>Your password must have:</p>
                  <ul>
                    <li className={`password-rule ${ 
                      isLengthValid 
                        ? 'valid' 
                        : (!isPasswordFocused && passwordInputStarted && password !== '' ? 'invalid' : '') 
                    }`}>
                      <span className="rule-indicator">✓</span>
                      <span className="rule-text">8 to 20 characters</span>
                    </li>
                    <li className={`password-rule ${ 
                      (hasLetter && hasNumber && hasSpecialChar) 
                        ? 'valid' 
                        : (!isPasswordFocused && passwordInputStarted && password !== '' ? 'invalid' : '') 
                    }`}>
                      <span className="rule-indicator">✓</span>
                      <span className="rule-text">Letters, numbers, and special characters</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* Date of Birth Section */}
              <div className="form-group dob-section">
                <label>Date of birth</label>
                <p className="input-hint">
                  This will not be shown publicly. Confirm your own age.
                </p>
                <div className="dob-inputs">
                  <select value={month} onChange={(e) => setMonth(e.target.value)} required disabled={isSubmitting}>
                    <option value="" disabled>Month</option>
                    {/* Add month options */}
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                  <select value={day} onChange={(e) => setDay(e.target.value)} required disabled={isSubmitting}>
                    <option value="" disabled>Day</option>
                    {/* Add day options 1-31 */}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={String(d).padStart(2, '0')}>{d}</option>
                    ))}
                  </select>
                  <select value={year} onChange={(e) => setYear(e.target.value)} required disabled={isSubmitting}>
                    <option value="" disabled>Year</option>
                    {/* Add year options (e.g., last 100 years) */}
                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Submit Button */}
              <button type="submit" className="submit-btn next-btn" disabled={!isFormValid || isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Next'}
              </button>
            </form>
          </>
        )}

        {/* --- Step 2 Content --- */}
        {step === 2 && (
          <>
            <h2>We sent you a code</h2>
            <p className="info-text">Enter it below to verify {email}.</p>
            <form onSubmit={handleProceed}>
              <div className="form-group">
                <input
                  type="text" 
                  inputMode="numeric" 
                  pattern="[0-9]*" 
                  placeholder="Verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                  maxLength={6} 
                  className={verificationError ? 'input-error' : ''}
                  aria-invalid={!!verificationError}
                  aria-describedby={verificationError ? "verification-error-message" : undefined}
                  disabled={isSubmitting}
                />
                {verificationError && <p id="verification-error-message" className="error-message field-error-message">{verificationError}</p>}
              </div>
              <button type="button" className="link-button">Didn't receive email?</button>
              <button type="submit" className="submit-btn next-btn" disabled={!isVerificationCodeFormatValid || isSubmitting}> 
                {isSubmitting ? 'Verifying...' : 'Next'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUpModal; 