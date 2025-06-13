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

// Minimal loading component that doesn't block UI
const MinimalLoadingIndicator: React.FC = () => (
  <div className="fixed top-4 right-4 z-50">
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
    </div>
  </div>
);

// Protected route component with non-blocking loading
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  redirectTo?: string; 
}> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Don't block UI during auth initialization
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return (
    <>
      {loading && <MinimalLoadingIndicator />}
      {children}
    </>
  );
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
  
  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return (
    <>
      {loading && <MinimalLoadingIndicator />}
      {children}
    </>
  );
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