import React from 'react';
import { DumbbellIcon, CalendarIcon, ActivityIcon, BookOpenIcon, BarChartIcon, ExternalLinkIcon, UserIcon, LogOutIcon, SparklesIcon } from './Icons';

export default function Navbar({ activeTab, setActiveTab, user, onOpenAuth, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: ActivityIcon },
    { id: 'planner', label: 'Workout Planner', icon: SparklesIcon },
    { id: 'schedule', label: 'Schedule & Logs', icon: CalendarIcon },
    { id: 'exercises', label: 'Exercise Library', icon: DumbbellIcon },
    { id: 'reports', label: 'Analytics', icon: BarChartIcon },
  ];

  return (
    <header style={{
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0.85rem 1.5rem',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            padding: '0.55rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
            color: '#000',
          }}>
            <DumbbellIcon size={22} />
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              OLYMPIA <span style={{ color: '#f59e0b', fontWeight: 600 }}>TRACKER</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Precision Fitness Engine
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  background: isActive ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
                  color: isActive ? '#f59e0b' : '#94a3b8',
                  padding: '0.5rem 0.9rem',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Swagger OpenAPI Link */}
          <a
            href="http://localhost:8080/swagger-ui/index.html"
            target="_blank"
            rel="noreferrer"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              padding: '0.5rem 0.9rem',
              borderRadius: '10px',
              fontSize: '0.88rem',
              fontWeight: 500,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
            }}
          >
            <BookOpenIcon size={16} />
            <span>OpenAPI Docs</span>
            <ExternalLinkIcon size={13} style={{ opacity: 0.7 }} />
          </a>
        </nav>

        {/* User Profile / Auth Action */}
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '9999px',
                padding: '0.35rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <UserIcon size={15} style={{ color: '#f59e0b' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                  {user.username}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="btn-secondary"
                title="Log Out"
                style={{ padding: '0.45rem 0.75rem' }}
              >
                <LogOutIcon size={15} />
              </button>
            </div>
          ) : (
            <button onClick={onOpenAuth} className="btn-primary">
              <UserIcon size={16} />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
