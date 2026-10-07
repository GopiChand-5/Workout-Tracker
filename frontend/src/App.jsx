import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import DashboardView from './components/DashboardView';
import WorkoutPlannerView from './components/WorkoutPlannerView';
import ScheduleView from './components/ScheduleView';
import ExerciseLibraryView from './components/ExerciseLibraryView';
import AnalyticsReportsView from './components/AnalyticsReportsView';
import { authApi, getStoredUser, setStoredUser, removeAuthToken, removeStoredUser } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(getStoredUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    // Validate session on launch
    const checkUser = async () => {
      try {
        const currentUser = await authApi.me();
        setUser(currentUser);
        setStoredUser(currentUser);
      } catch (err) {
        // Token expired or invalid
        setUser(null);
        removeStoredUser();
      }
    };

    if (localStorage.getItem('wt_jwt')) {
      checkUser();
    }
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    removeStoredUser();
    setUser(null);
    setActiveTab('dashboard');
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <main style={{
        flex: 1,
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        padding: '2rem 1.5rem 4rem 1.5rem',
      }}>
        {activeTab === 'dashboard' && (
          <DashboardView
            user={user}
            onNavigate={setActiveTab}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {activeTab === 'planner' && (
          <WorkoutPlannerView
            user={user}
            onWorkoutCreated={() => setActiveTab('schedule')}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleView
            user={user}
            onNavigate={setActiveTab}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {activeTab === 'exercises' && (
          <ExerciseLibraryView />
        )}

        {activeTab === 'reports' && (
          <AnalyticsReportsView
            user={user}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}
      </main>

      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '1.5rem',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: '#64748b',
        background: '#070a12',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong>Olympia Workout Tracker Engine</strong> • Powered by Spring Boot 3.4 & React 18
          </div>
          <div>
            OpenAPI Specs interactive UI available at{' '}
            <a href="http://localhost:8080/swagger-ui/index.html" target="_blank" rel="noreferrer" style={{ color: '#f59e0b', textDecoration: 'none' }}>
              /swagger-ui/index.html
            </a>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
