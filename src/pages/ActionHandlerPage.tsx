import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
    verifyPasswordResetCode, 
    confirmPasswordReset, 
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '../firebaseConfig';

// Re-use password validation logic/regex if possible (or redefine here)
const passwordLengthRegex = /.{8,}/;
const passwordLetterRegex = /[a-zA-Z]/;
const passwordNumberRegex = /\d/;
// Corrected regex for special chars (removed escapes for [], /)
const passwordSpecialCharRegex = /[!@#$%^&*()_+\-=[{};':"\\|,.<>/?]+/;


const ActionHandlerPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');
    // Remove unused continueUrl
    // const continueUrl = searchParams.get('continueUrl');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null); // Email associated with the code
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false); // Visibility for confirm field
    const [passwordInputStarted, setPasswordInputStarted] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false); // Add focus state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Password rule states (reused from SignUpModal)
    const [isLengthValid, setIsLengthValid] = useState(false);
    const [hasLetter, setHasLetter] = useState(false);
    const [hasNumber, setHasNumber] = useState(false);
    const [hasSpecialChar, setHasSpecialChar] = useState(false);

    // Derived state: is the password strong enough?
    const isPasswordStrongEnough = useMemo(() => {
        return isLengthValid && hasLetter && hasNumber && hasSpecialChar;
    }, [isLengthValid, hasLetter, hasNumber, hasSpecialChar]);

    // --- Effect to Verify Code on Load --- 
    useEffect(() => {
        if (!mode || !oobCode) {
            setError('Invalid request. Missing required parameters.');
            setLoading(false);
            return;
        }

        if (mode === 'resetPassword') {
            verifyPasswordResetCode(auth, oobCode)
                .then((verifiedEmail) => {
                    setEmail(verifiedEmail);
                    setLoading(false);
                })
                .catch((err: unknown) => {
                    console.error('Verify Password Reset Code Error:', err);
                    // Check error type before accessing code
                    if (err instanceof FirebaseError) { 
                        // err is now known to be FirebaseError here
                        if (err.code === 'auth/expired-action-code') { 
                             setError('This password reset link has expired. Please request a new one.');
                        } else if (err.code === 'auth/invalid-action-code') { 
                             setError('This password reset link is invalid or has already been used.');
                        } else {
                            setError('Could not verify password reset request. Please try again.');
                        }
                    } else {
                         setError('An unexpected error occurred during verification.');
                    }
                    setLoading(false);
                });
        } else if (mode === 'verifyEmail') {
             // Handle email verification if needed later
             setError('Email verification handling not yet implemented.');
             setLoading(false);
        } else {
            setError('Unsupported action mode.');
            setLoading(false);
        }

    }, [mode, oobCode]);

    // --- Handler for Password Input Change --- 
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const currentPassword = event.target.value;
        setNewPassword(currentPassword);
        setPasswordInputStarted(true); // User has started typing

        // Update validation flags
        setIsLengthValid(passwordLengthRegex.test(currentPassword));
        setHasLetter(passwordLetterRegex.test(currentPassword));
        setHasNumber(passwordNumberRegex.test(currentPassword));
        setHasSpecialChar(passwordSpecialCharRegex.test(currentPassword));
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };
    const toggleConfirmPasswordVisibility = () => {
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
    };

    // --- Add Focus/Blur Handlers --- 
    const handlePasswordFocus = () => {
        setIsPasswordFocused(true);
    };

    const handlePasswordBlur = () => {
        setIsPasswordFocused(false);
    };

    // --- Handler to Submit New Password --- 
    const handleConfirmReset = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setInfo(null);

        if (!oobCode) {
            setError('Missing code for password reset.');
            return;
        }
        if (!isPasswordStrongEnough) {
            setError('Password does not meet the requirements.');
            return;
        }
        // Add check for password confirmation match
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);
        try {
            await confirmPasswordReset(auth, oobCode, newPassword);
            setInfo('Your password has been successfully reset! You can now sign in with your new password.');
            // Clear fields on success
            setNewPassword('');
            setConfirmPassword('');
            setPasswordInputStarted(false); // Reset rule display state
            // Reset individual rule states
            setIsLengthValid(false);
            setHasLetter(false);
            setHasNumber(false);
            setHasSpecialChar(false);
            setTimeout(() => {
                navigate('/'); 
            }, 4000);
        } catch (err: unknown) {
            console.error('Confirm Password Reset Error:', err);
            // Check error type before accessing code
             if (err instanceof FirebaseError) {
                 // err is now known to be FirebaseError here
                 if (err.code === 'auth/expired-action-code') {
                     setError('This password reset link has expired while you were setting the password. Please request a new one.');
                } else if (err.code === 'auth/invalid-action-code') {
                     setError('This password reset link became invalid or was used elsewhere. Please request a new one.');
                } else if (err.code === 'auth/weak-password') { 
                     setError('The new password is not strong enough.');
                } else {
                     setError('An error occurred while resetting your password. Please try again.');
                 }
             } else {
                 setError('An unexpected error occurred during password reset.');
             }
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Render Logic --- 

    if (loading) {
        // Basic loading indicator
        return <div className="loading-overlay"><div className="loading-text">Loading...</div></div>;
    }

    return (
        // Use overlay and content structure similar to modals
        <div className="modal-overlay action-page-overlay"> {/* Add specific class if needed */} 
            <div className="modal-content action-page-content"> {/* Add specific class */} 
                {/* Add a back button/link if not an error/final success state? */} 
                {/* <button className="close-modal-btn">✕</button> // Maybe not a close button? */} 
                 <h1 className="modal-brand-title">MYDROBE</h1> {/* Reuse brand title */} 
                
                {mode === 'resetPassword' && <h2>Reset Password</h2>}
                {mode === 'verifyEmail' && <h2>Verify Email</h2>} {/* Placeholder */} 

                {error && (
                    <div className="error-message modal-message"> {/* Use modal message classes */} 
                        <p>{error}</p>
                        <Link to="/" className="link-button">Go to Sign In</Link>
                    </div>
                )}

                {info && (
                    <div className="success-message modal-message"> {/* Use modal message classes */} 
                        <p>{info}</p>
                         {/* Maybe only show link AFTER success message? */}
                        <Link to="/" className="link-button" style={{marginTop: '1rem'}}>Go to Sign In</Link>
                    </div>
                )}

                {/* Only show form if code was verified and no final info/error shown */} 
                {mode === 'resetPassword' && email && !error && !info && (
                    <form onSubmit={handleConfirmReset}>
                        <p className="info-text">Resetting password for: <strong>{email}</strong></p>
                        
                        {/* New Password Input - Add focus/blur handlers */}
                        <div className="form-group password-input-group"> 
                            <label htmlFor="new-password">New Password</label>
                            <input 
                                id="new-password"
                                type={isPasswordVisible ? 'text' : 'password'}
                                value={newPassword}
                                onChange={handlePasswordChange}
                                onFocus={handlePasswordFocus} // Add onFocus
                                onBlur={handlePasswordBlur}   // Add onBlur
                                placeholder="Enter new password"
                                required
                                disabled={isSubmitting}
                                // Remove basic error class, rely on rules list styling
                                // className={!isPasswordStrongEnough && passwordInputStarted ? 'input-error' : ''} 
                            />
                            <button 
                                type="button" 
                                onClick={togglePasswordVisibility}
                                className="password-toggle-btn" 
                                aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                                tabIndex={-1} // Prevent tabbing to toggle
                            >
                                {/* --- Use New SVG for Open Eye --- */}
                                {isPasswordVisible ? (
                                    // SVG approximating the provided image style
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        {/* Outer eye shape path */}
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12C2.5 12 5.5 5 12 5s9.5 7 9.5 7-2.5 7-9.5 7S2.5 12 2.5 12Z" />
                                        {/* Inner circle/pupil */}
                                        <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    // Keep existing SVG for Crossed-Out Eye (Hidden)
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L6.228 6.228" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Confirm Password Input */}
                         <div className="form-group password-input-group"> 
                            <label htmlFor="confirm-password">Confirm New Password</label>
                            <input 
                                id="confirm-password"
                                type={isConfirmPasswordVisible ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                required
                                disabled={isSubmitting}
                                className={(newPassword !== confirmPassword && confirmPassword !== '') ? 'input-error' : ''} // Basic mismatch indicator
                            />
                             <button 
                                type="button" 
                                onClick={toggleConfirmPasswordVisibility}
                                className="password-toggle-btn" 
                                aria-label={isConfirmPasswordVisible ? 'Hide password' : 'Show password'}
                                tabIndex={-1}
                            >
                                {/* --- Use New SVG for Open Eye --- */}
                                {isConfirmPasswordVisible ? (
                                    // SVG approximating the provided image style
                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        {/* Outer eye shape path */}
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12C2.5 12 5.5 5 12 5s9.5 7 9.5 7-2.5 7-9.5 7S2.5 12 2.5 12Z" />
                                        {/* Inner circle/pupil */}
                                        <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    // Keep existing SVG for Crossed-Out Eye (Hidden)
                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L6.228 6.228" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {/* Display password mismatch error specifically */}
                        {(newPassword !== confirmPassword && confirmPassword !== '') && 
                            <p className="error-message field-error-message">Passwords do not match.</p>
                        }

                        {/* Password Rules List - Update conditional class logic */}
                        {/* Show rules if focused OR if input started and not empty */}
                        {(isPasswordFocused || (passwordInputStarted && newPassword !== '')) && (
                            <div className="password-rules-list">
                                <ul>
                                    {/* Use the more complex logic from SignUpModal */}
                                    <li className={`password-rule ${ 
                                        isLengthValid 
                                          ? 'valid' 
                                          : (!isPasswordFocused && passwordInputStarted && newPassword !== '' ? 'invalid' : '') 
                                    }`}> 
                                        <span className="rule-indicator">{isLengthValid ? '✓' : '✕'}</span>
                                        <span className="rule-text">At least 8 characters</span>
                                    </li>
                                    <li className={`password-rule ${ 
                                        (hasLetter && hasNumber && hasSpecialChar) 
                                          ? 'valid' 
                                          : (!isPasswordFocused && passwordInputStarted && newPassword !== '' ? 'invalid' : '') 
                                    }`}> 
                                        <span className="rule-indicator">{(hasLetter && hasNumber && hasSpecialChar) ? '✓' : '✕'}</span>
                                        <span className="rule-text">Include letters, numbers, & special characters</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                        
                        <button 
                           type="submit" 
                           className="submit-btn" 
                           disabled={isSubmitting || !isPasswordStrongEnough || newPassword !== confirmPassword}
                        >
                            {isSubmitting ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                 {/* Link back to Sign In if form is not shown or before final success message */}
                 {!(mode === 'resetPassword' && email && !error && !info) && !info && (
                    <p style={{marginTop: '1rem'}}><Link to="/" className="link-button">Back to Sign In</Link></p>
                 )}

            </div>
        </div>
    );
};

export default ActionHandlerPage; 