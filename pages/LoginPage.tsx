
import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Github, Chrome, Apple } from 'lucide-react';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const { login, loginWithEmail, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    await loginWithEmail(email);

    // Check user role and redirect
    // We can fetch the user from storage since state update might be async/batched
    setTimeout(() => {
      const user = JSON.parse(localStorage.getItem('glint_auth_user') || '{}');
      if (user && user.role) {
        if (user.role === UserRole.UNSET) {
          navigate('/role-select');
        } else {
          navigate(user.role === UserRole.CREATOR ? '/creator/dashboard' : '/hirer/dashboard');
        }
      }
    }, 500);
  };

  const handleLoginWithProvider = async (provider: 'google' | 'apple') => {
    await login(provider);
    // Redirect is now handled by AuthContext state change or manually here
    // But since `login` is now async void, we should wait for state change ideally.
    // However, AuthContext sets the user. We can check localStorage or wait.
    // Let's rely on the global navigation in App.tsx or just manual redirect here after a small delay if needed.
    // The previous code had a checkUser logic.
    setTimeout(() => {
      const user = JSON.parse(localStorage.getItem('glint_auth_user') || '{}');
      if (user && user.role) {
        if (user.role === UserRole.UNSET) {
          navigate('/role-select');
        } else {
          navigate(user.role === UserRole.CREATOR ? '/creator/dashboard' : '/hirer/dashboard');
        }
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-darkBg text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-darkCard border border-white/5 p-8 rounded-[32px] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl"></div>

        <button onClick={() => navigate('/')} className="mb-8 text-gray-500 hover:text-white flex items-center space-x-2 text-sm font-medium">
          <ArrowLeft size={16} />
          <span>Back to home</span>
        </button>

        <h2 className="text-3xl font-black mb-2 tracking-tight">Welcome Back</h2>
        <p className="text-gray-500 mb-8">Choose your preferred sign-in method</p>

        <div className="space-y-3 mb-8">
          <button
            onClick={() => handleLoginWithProvider('google')}
            className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center space-x-3 transition-all"
          >
            <Chrome size={20} />
            <span className="font-bold">Continue with Google</span>
          </button>
          <button
            onClick={() => handleLoginWithProvider('apple')}
            className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center space-x-3 transition-all"
          >
            <Apple size={20} />
            <span className="font-bold">Continue with Apple</span>
          </button>
        </div>

        <div className="relative mb-8 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
          <span className="relative bg-darkCard px-4 text-xs text-gray-500 uppercase font-black tracking-widest">or email</span>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-primary text-black font-black rounded-2xl flex items-center justify-center glow-orange disabled:opacity-50 transition-all"
          >
            {isLoading ? 'SIGNING IN...' : 'CONTINUE'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-600">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};
