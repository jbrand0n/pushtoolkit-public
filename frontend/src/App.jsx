import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import NewSite from './pages/NewSite';
import Notifications from './pages/Notifications';
import NotificationForm from './pages/NotificationForm';
import Subscribers from './pages/Subscribers';
import Campaigns from './pages/Campaigns';
import CampaignForm from './pages/CampaignForm';
import Segments from './pages/Segments';
import RSSFeeds from './pages/RSSFeeds';
import Settings from './pages/Settings';
import Help from './pages/Help';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        {/* Signup disabled until payment integration */}
        {/* <Route path="/signup" element={<Signup />} /> */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected Routes */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/sites/new"
          element={
            <ProtectedRoute>
              <NewSite />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Notifications />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications/new"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <NotificationForm />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications/:id/edit"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <NotificationForm />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/subscribers"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Subscribers />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/campaigns"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Campaigns />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/campaigns/new"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <CampaignForm />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/segments"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Segments />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/rss-feeds"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <RSSFeeds />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Help />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
