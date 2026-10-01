import { useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export function useAuth() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const current = authService.getCurrentUser();
        if (current && current.uid === fbUser.uid) {
          setUser(current);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password, extraProfile = {}) => {
    setLoading(true);
    try {
      const loggedUser = await authService.login(email, password, extraProfile);
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
}

