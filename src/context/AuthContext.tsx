import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebaseConfig';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  isVerified: boolean;
}

const AuthContext = createContext<AuthContextType>({ currentUser: null, loading: true, isVerified: false });

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    console.log("AuthProvider: Subscribing to auth state changes...");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("AuthProvider: onAuthStateChanged fired.");
      console.log("AuthProvider: User:", user ? user.uid : null);
      if (user) {
        console.log("AuthProvider: User Email Verified:", user.emailVerified);
        if (user.emailVerified) {
          setCurrentUser(user);
          setIsVerified(true);
        } else {
          setCurrentUser(user);
          setIsVerified(false);
        }
      } else {
        setCurrentUser(null);
        setIsVerified(false);
      }
      console.log("AuthProvider: Setting loading to false.");
      setLoading(false);
    });

    return () => {
        console.log("AuthProvider: Unsubscribing from auth state changes.");
        unsubscribe();
    }
  }, []);

  const value = {
    currentUser,
    loading,
    isVerified
  };

  console.log("AuthProvider: Rendering - Loading:", loading, "User:", currentUser ? currentUser.uid : null, "Verified:", isVerified);

  return (
    <AuthContext.Provider value={value}>
      {/* Temporarily render children even while loading to see if that helps debug */}
      {/* {!loading && children} */}
      {children} 
    </AuthContext.Provider>
  );
}; 