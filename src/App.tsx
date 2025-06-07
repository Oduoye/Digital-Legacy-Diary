import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { DiaryProvider } from './context/DiaryContext';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import AuthPages from './pages/AuthPages';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import SubscriptionPage from './pages/SubscriptionPage';
import { 
  JournalListPage, 
  NewJournalEntryPage, 
  EditJournalEntryPage,
  ViewJournalEntryPage 
} from './pages/JournalPages';
import ContactsPage from './pages/ContactsPage';
import SettingsPage from './pages/SettingsPage';
import LifeStoryPage from './pages/LifeStoryPage';
import MemoryConstellationPage from './pages/MemoryConstellationPage';
import WisdomChatbotPage from './pages/WisdomChatbotPage';

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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
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
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/login" element={<AuthPages />} />
            <Route path="/register" element={<AuthPages />} />
            
            {/* Protected routes */}
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