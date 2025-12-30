
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios';
import { User, UserRole } from '../types';
import { Storage } from '../services/storage';
import { DataService } from '../services/dataService';

// Interfaces
interface AuthContextType {
  user: User | null;
  login: (provider: 'google' | 'apple') => Promise<void>;
  loginWithEmail: (email: string) => Promise<void>;
  logout: () => void;
  updateRole: (role: UserRole) => void;
  updateUser: (user: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from local storage on load
  useEffect(() => {
    const savedUser = Storage.get<User>('auth_user');
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  // Google Login Handler
  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        // 1. Get User Info from Google
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        const googleUser = userInfo.data;

        // 2. Check if user already exists in our "database"
        const users = Storage.get<User[]>('users') || [];
        let appUser = users.find(u => u.email === googleUser.email);

        // 3. Register if new
        if (!appUser) {
          appUser = {
            id: googleUser.sub, // Use Google ID as user ID
            email: googleUser.email,
            name: googleUser.name,
            username: googleUser.email.split('@')[0], // Generate username
            role: UserRole.UNSET,
            skillTags: [],
            avatar: googleUser.picture,
            following: [],
            followers: [],
            createdAt: Date.now()
          };
          // Save to "DB"
          Storage.set('users', [...users, appUser]);
        }

        // 4. Set Session
        setUser(appUser);
        Storage.set('auth_user', appUser);

      } catch (error) {
        console.error("Google verify failed", error);
        alert("Login failed. Please check your network or Client ID.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: error => {
      console.error('Login Failed:', error);
      setIsLoading(false);
      alert("Google Login popup closed or failed.");
    }
  });

  const loginWithEmail = async (email: string) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const users = Storage.get<User[]>('users') || [];
      let appUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!appUser) {
        // Register new user
        appUser = {
          id: `user_${Date.now()}`,
          email: email,
          name: email.split('@')[0],
          username: email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ''),
          role: UserRole.UNSET,
          skillTags: [],
          following: [],
          followers: [],
          createdAt: Date.now()
        };
        Storage.set('users', [...users, appUser]);
      }

      setUser(appUser);
      Storage.set('auth_user', appUser);
    } catch (error) {
      console.error("Email login failed", error);
      alert("Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (provider: 'google' | 'apple') => {
    if (provider === 'google') {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId || clientId.includes("YOUR_GOOGLE_CLIENT_ID")) {
        // Bypass for User who wants "Direct Fix" without keys
        const mockUser: User = {
          id: 'test-google-user',
          email: 'test@gmail.com',
          name: 'Test User',
          username: 'testuser',
          role: UserRole.UNSET,
          skillTags: [],
          avatar: 'https://ui-avatars.com/api/?name=Test+User',
          following: [],
          followers: [],
          createdAt: Date.now()
        };

        // Register mock user if not exists
        const users = Storage.get<User[]>('users') || [];
        if (!users.find(u => u.id === mockUser.id)) {
          Storage.set('users', [...users, mockUser]);
        }

        setUser(mockUser);
        Storage.set('auth_user', mockUser);
        return;
      }
      loginGoogle();
    } else {
      alert("Apple Login requires valid developer credentials. Please use Google for this demo.");
    }
  };

  const logout = () => {
    googleLogout();
    setUser(null);
    Storage.remove('auth_user');
  };

  const updateRole = (role: UserRole) => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    Storage.set('auth_user', updated);
    DataService.updateUser(updated);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    Storage.set('auth_user', updatedUser);
    DataService.updateUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithEmail, logout, updateRole, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
