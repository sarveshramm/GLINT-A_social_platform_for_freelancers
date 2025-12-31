
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import { ThemeProvider } from './components/ThemeContext';
import { SplashScreen } from './components/SplashScreen';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { NotificationProvider } from './components/NotificationContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RoleSelectPage } from './pages/RoleSelectPage';
import { Dashboard } from './pages/Dashboard';
import { CreatePostPage } from './pages/CreatePostPage';
import { HirerDiscovery } from './pages/HirerDiscovery';
import { ProfilePage } from './pages/ProfilePage';
import { PostJobPage } from './pages/PostJobPage';
import { HirerJobsPage } from './pages/HirerJobsPage';
import { MessagesPage } from './pages/MessagesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ExploreJobsPage } from './pages/ExploreJobsPage';
import { MonetizationPage } from './pages/MonetizationPage';
import { HireManagementPage } from './pages/HireManagementPage';
import { UserRole } from './types';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: UserRole }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return (
    <div className="min-h-screen bg-darkBg flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-primary font-black tracking-widest text-xs uppercase animate-pulse">Shining your profile...</p>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  if (user.role === UserRole.UNSET && window.location.hash !== '#/role-select') return <Navigate to="/role-select" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={user.role === UserRole.CREATOR ? '/creator/dashboard' : '/hirer/dashboard'} /> : <LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<LoginPage />} />
      <Route path="/role-select" element={<RoleSelectPage />} />

      {/* Creator Routes */}
      <Route path="/creator/dashboard" element={<ProtectedRoute role={UserRole.CREATOR}><Dashboard /></ProtectedRoute>} />
      <Route path="/creator/create-post" element={<ProtectedRoute role={UserRole.CREATOR}><CreatePostPage /></ProtectedRoute>} />

      {/* Hirer Routes */}
      <Route path="/hirer/dashboard" element={<ProtectedRoute role={UserRole.HIRER}><Dashboard /></ProtectedRoute>} />
      <Route path="/hirer/discover" element={<ProtectedRoute role={UserRole.HIRER}><HirerDiscovery /></ProtectedRoute>} />
      <Route path="/hirer/jobs" element={<ProtectedRoute role={UserRole.HIRER}><HirerJobsPage /></ProtectedRoute>} />
      <Route path="/hirer/post-job" element={<ProtectedRoute role={UserRole.HIRER}><PostJobPage /></ProtectedRoute>} />

      {/* Common Protected Routes */}
      <Route path="/discover" element={<ProtectedRoute><HirerDiscovery /></ProtectedRoute>} />
      <Route path="/jobs" element={<ProtectedRoute><ExploreJobsPage /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><HireManagementPage /></ProtectedRoute>} />
      <Route path="/plans" element={<ProtectedRoute><MonetizationPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = React.useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        ) : (
          <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <ThemeProvider>
              <AuthProvider>
                <NotificationProvider>
                  <Router>
                    <AppRoutes />
                  </Router>
                </NotificationProvider>
              </AuthProvider>
            </ThemeProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default App;
