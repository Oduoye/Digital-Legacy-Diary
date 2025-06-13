import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { DiaryProvider } from './context/DiaryContext';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AuthPages from './pages/AuthPages';
import ResetPasswordPage from './pages/ResetPasswordPage';
import EmailVerificationCallbackPage from './pages/EmailVerificationCallbackPage';
import LegacyAccessPage from './pages/LegacyAccessPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import SubscriptionPage from './pages/SubscriptionPage';
import { 
  JournalListPage, 
  NewJournalEntryPage, 
  EditJournalEntryPage,
  ViewJournalEntryPage 
} from './pages/JournalPages';
import { 
  WillListPage, 
  ViewWillPage 
} from './pages/WillPages';
import ContactsPage from './pages/ContactsPage';
import SettingsPage from './pages/SettingsPage';
import LifeStoryPage from './pages/LifeStoryPage';
import MemoryConstellationPage from './pages/MemoryConstellationPage';
import WisdomChatbotPage from './pages/WisdomChatbotPage';

// Loading screen component
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
    <div className="text-center">
      <div className="h-12 w-12 bg-black rounded-full flex items-center justify-center p-1 shadow-2xl border border-white/20 mx-auto mb-4">
        <img 
          src="/DLD Logo with Navy Blue and Silver_20250601_034009_0000.png" 
          alt="Digital Legacy Diary"
          className="h-full w-full object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = '<span class="text-2xl font-serif font-bold text-white">D</span>';
            }
          }}
        />
      </div>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
      <p className="text-white/80">Loading your digital legacy...</p>
    </div>
  </div>
);

// Protected route component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  redirectTo?: string; 
}> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

// Public route component that redirects authenticated users
const PublicRoute: React.FC<{ 
  children: React.ReactNode;
  redirectTo?: string; 
}> = ({ 
  children, 
  redirectTo = '/dashboard' 
}) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <DiaryProvider>
          <Routes>
            {/* Public routes - redirect to dashboard if authenticated */}
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <HomePage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/about" 
              element={
                <PublicRoute>
                  <AboutPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/contact" 
              element={
                <PublicRoute>
                  <ContactPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/privacy" 
              element={
                <PublicRoute>
                  <PrivacyPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/terms" 
              element={
                <PublicRoute>
                  <TermsPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/how-it-works" 
              element={
                <PublicRoute>
                  <HowItWorksPage />
                </PublicRoute>
              } 
            />
            
            {/* Auth routes - redirect to dashboard if authenticated */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <AuthPages />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <AuthPages />
                </PublicRoute>
              } 
            />
            <Route 
              path="/reset-password" 
              element={
                <PublicRoute>
                  <ResetPasswordPage />
                </PublicRoute>
              } 
            />
            
            {/* Email verification callback - always accessible */}
            <Route path="/auth/callback" element={<EmailVerificationCallbackPage />} />
            
            {/* Legacy access route - public but requires access code */}
            <Route path="/legacy/:accessCode" element={<LegacyAccessPage />} />
            
            {/* Protected routes - require authentication */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/subscription" 
              element={
                <ProtectedRoute>
                  <SubscriptionPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/journal" 
              element={
                <ProtectedRoute>
                  <JournalListPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/journal/new" 
              element={
                <ProtectedRoute>
                  <NewJournalEntryPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/journal/:id" 
              element={
                <ProtectedRoute>
                  <ViewJournalEntryPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/journal/edit/:id" 
              element={
                <ProtectedRoute>
                  <EditJournalEntryPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wills" 
              element={
                <ProtectedRoute>
                  <WillListPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wills/:id" 
              element={
                <ProtectedRoute>
                  <ViewWillPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/contacts" 
              element={
                <ProtectedRoute>
                  <ContactsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/life-story" 
              element={
                <ProtectedRoute>
                  <LifeStoryPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/memory-constellation" 
              element={
                <ProtectedRoute>
                  <MemoryConstellationPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wisdom-chatbot" 
              element={
                <ProtectedRoute>
                  <WisdomChatbotPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DiaryProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;