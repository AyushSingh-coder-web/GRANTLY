import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Public pages
import { LandingPage } from './pages/public/LandingPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { PublicScholarshipsPage } from './pages/public/PublicScholarshipsPage';
import { ScholarshipDetailsPage } from './pages/public/ScholarshipDetailsPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Authenticated pages
import { OnboardingPage } from './pages/dashboard/OnboardingPage';
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { DiscoverScholarshipsPage } from './pages/dashboard/DiscoverScholarshipsPage';
import { EligibilityAnalysisPage } from './pages/dashboard/EligibilityAnalysisPage';
import { ApplicationsPage } from './pages/dashboard/ApplicationsPage';
import { DocumentsPage } from './pages/dashboard/DocumentsPage';
import { CalendarPage } from './pages/dashboard/CalendarPage';
import { AssistantPage } from './pages/dashboard/AssistantPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';
import { NotificationsPage } from './pages/dashboard/NotificationsPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';

import { SplashScreen } from './components/common/SplashScreen';

// Route protector (grants demo exploration or redirects to login)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <AppProvider>
      <SplashScreen />
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/scholarships" element={<PublicScholarshipsPage />} />
          <Route path="/scholarships/:id" element={<ScholarshipDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Authenticated Application Routes */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <OverviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/discover"
            element={
              <ProtectedRoute>
                <DiscoverScholarshipsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/scholarships/:id"
            element={
              <ProtectedRoute>
                <ScholarshipDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/eligibility/:id"
            element={
              <ProtectedRoute>
                <EligibilityAnalysisPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/applications"
            element={
              <ProtectedRoute>
                <ApplicationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/documents"
            element={
              <ProtectedRoute>
                <DocumentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/assistant"
            element={
              <ProtectedRoute>
                <AssistantPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
