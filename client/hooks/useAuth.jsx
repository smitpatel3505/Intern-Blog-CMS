import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, githubProvider } from '../firebase';
import { toast } from 'sonner';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Store user info in localStorage
        const userInfo = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0],
          photoURL: user.photoURL
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo);
      } else {
        localStorage.removeItem('user');
        setUser(null);
      }
      setLoading(false);
    });

    // Check localStorage for existing user on app load
    const savedUser = localStorage.getItem('user');
    if (savedUser && !user) {
      setUser(JSON.parse(savedUser));
    }

    return unsubscribe;
  }, []);

  // Email/Password Sign Up
  const signUp = async (email, password) => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Account created successfully!');
      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Sign In
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully!');
      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // GitHub Sign In
  const signInWithGitHub = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, githubProvider);
      toast.success('Signed in with GitHub successfully!');
      return result;
    } catch (error) {
      console.error('GitHub sign in error:', error);
      toast.error(error.message || 'Failed to sign in with GitHub');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign Out
  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully!');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGitHub,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 