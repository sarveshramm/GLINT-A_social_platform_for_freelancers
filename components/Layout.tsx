
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';
import { useTheme } from './ThemeContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Search, Bell, Mail, PlusSquare,
  User as UserIcon, LogOut, Sun, Moon,
  Briefcase, Compass, TrendingUp, Menu, X, Rocket, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '../types';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label, notificationCount }: { to: string, icon: any, label: string, notificationCount?: number }) => (
    <Link
      to={to}
      onClick={() => setMobileMenuOpen(false)}
      className={`relative flex items-center space-x-3 p-3 rounded-xl transition-all ${isActive(to)
        ? 'bg-primary/10 text-primary font-semibold'
        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-darkCard dark:text-gray-400'
        }`}
    >
      <div className="relative">
        <Icon size={22} />
        {notificationCount && notificationCount > 0 && (
          <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#ff00ff] text-white text-[10px] font-bold shadow-[0_0_10px_#ff00ff] border border-white dark:border-darkBg z-10">
            <span className="animate-neon-blink">{notificationCount > 99 ? '99+' : notificationCount}</span>
          </span>
        )}
      </div>
      <span className="md:block hidden">{label}</span>
      <span className="md:hidden block">{label}</span>
    </Link>
  );

  const { messageCount, activityCount, profileCount } = useNotifications();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return <>{children}</>;

  const dashboardPath = user.role === UserRole.CREATOR ? '/creator/dashboard' : '/hirer/dashboard';

  return (
    <div className="min-h-screen bg-lightBg dark:bg-darkBg text-gray-900 dark:text-white transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-darkBg/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10 px-4 py-3">
        <div className="w-full max-w-[1600px] mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <span className="text-primary">GLINT</span>
          </Link>

          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-darkCard transition-all"
            >
              {theme === 'dark' ? <Sun size={20} className="text-primary" /> : <Moon size={20} className="text-secondary" />}
            </button>

            <div className="h-8 w-[1px] bg-gray-200 dark:bg-white/10 hidden md:block"></div>

            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold truncate max-w-[120px]">{user.name}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{user.role}</p>
              </div>
              <Link to="/profile">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary/20 hover:border-primary transition-colors"
                  alt="Avatar"
                />
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-darkCard"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <div className="w-full max-w-[1600px] mx-auto flex">
        {/* Sidebar Desktop */}
        <aside className="hidden md:flex flex-col w-[20%] min-w-[240px] max-w-[300px] h-[calc(100vh-64px)] sticky top-16 p-6 space-y-2 border-r border-gray-100 dark:border-white/5">
          <NavItem to={dashboardPath} icon={Home} label="Feed" />
          <NavItem to="/discover" icon={Compass} label="Discovery" />

          {user.role === UserRole.CREATOR ? (
            <NavItem to="/jobs" icon={Briefcase} label="Find Jobs" />
          ) : (
            <NavItem to="/hirer/jobs" icon={Briefcase} label="My Listings" />
          )}

          <NavItem to="/projects" icon={Zap} label="My Projects" />
          <NavItem to="/messages" icon={Mail} label="Messages" notificationCount={messageCount} />
          <NavItem to="/notifications" icon={Bell} label="Activity" notificationCount={activityCount} />
          <NavItem to="/plans" icon={Rocket} label="Glint Pro" />

          <div className="h-px bg-gray-100 dark:bg-white/5 my-4"></div>

          <NavItem to="/profile" icon={UserIcon} label="My Profile" notificationCount={profileCount} />

          <div className="pt-10 mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 p-3 w-full rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all font-medium"
            >
              <LogOut size={22} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="fixed inset-0 z-40 bg-white dark:bg-darkBg p-6 md:hidden flex flex-col pt-20"
            >
              <nav className="flex flex-col space-y-2">
                <NavItem to={dashboardPath} icon={Home} label="Feed" />
                <NavItem to="/discover" icon={Compass} label="Discovery" />
                <NavItem to="/jobs" icon={Briefcase} label="Jobs" />
                <NavItem to="/projects" icon={Zap} label="Projects" />
                <NavItem to="/messages" icon={Mail} label="Messages" notificationCount={messageCount} />
                <NavItem to="/notifications" icon={Bell} label="Notifications" notificationCount={activityCount} />
                <NavItem to="/plans" icon={Rocket} label="Plans" />
                <NavItem to="/profile" icon={UserIcon} label="Profile" notificationCount={profileCount} />
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 p-3 w-full rounded-xl text-red-500 font-medium"
                >
                  <LogOut size={22} />
                  <span>Sign Out</span>
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0 p-4 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Floating Action Button for Mobile Creators */}
      {user.role === UserRole.CREATOR && (
        <Link
          to="/creator/create-post"
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg glow-orange z-50"
        >
          <PlusSquare size={28} />
        </Link>
      )}
    </div>
  );
};
