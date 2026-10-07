import React, { useState } from 'react';
import { authApi, setAuthToken, setStoredUser } from '../api';
import { CloseIcon, UserIcon, LockIcon, SparklesIcon } from './Icons';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let res;
      if (isSignUp) {
        res = await authApi.register({ username, email, password });
      } else {
        res = await authApi.login({ usernameOrEmail: username, password });
      }

      setAuthToken(res.accessToken);
      setStoredUser(res.user);
      onAuthSuccess(res.user);
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(5, 8, 15, 0.8)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div 
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2.25rem',
          position: 'relative',
          background: 'rgba(19, 27, 46, 0.95)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
          }}
        >
          <CloseIcon size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f59e0b',
            marginBottom: '0.75rem',
          }}>
            <SparklesIcon size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
            {isSignUp ? 'Create Olympia Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '0.25rem' }}>
            {isSignUp ? 'Sign up to track workouts and access custom analytics' : 'Sign in to sync your scheduled sessions and progress'}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.4rem', fontWeight: 500 }}>
              {isSignUp ? 'Username' : 'Username or Email'}
            </label>
            <input
              type="text"
              required
              className="input-field"
              placeholder={isSignUp ? 'johndoe' : 'johndoe or john@example.com'}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {isSignUp && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.4rem', fontWeight: 500 }}>
                Email Address
              </label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.4rem', fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#94a3b8' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            style={{
              background: 'none',
              border: 'none',
              color: '#f59e0b',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
