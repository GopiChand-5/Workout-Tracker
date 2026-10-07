import React, { useState, useEffect } from 'react';
import { reportApi, workoutApi } from '../api';
import { TrophyIcon, ActivityIcon, FlameIcon, CalendarIcon, PlusIcon, CheckIcon, DumbbellIcon, ClockIcon } from './Icons';

export default function DashboardView({ user, onNavigate, onOpenAuth }) {
  const [report, setReport] = useState(null);
  const [upcomingWorkouts, setUpcomingWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [repData, workData] = await Promise.all([
        reportApi.getSummary(),
        workoutApi.getAll('SCHEDULED')
      ]);
      setReport(repData);
      setUpcomingWorkouts(workData || []);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (workoutId) => {
    try {
      await workoutApi.updateStatus(workoutId, { status: 'COMPLETED' });
      fetchData();
    } catch (err) {
      alert("Failed to update workout status: " + err.message);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '3rem 1rem', textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
        <div className="glass-panel" style={{ padding: '3rem 2rem', background: 'rgba(19, 27, 46, 0.8)' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f59e0b',
            marginBottom: '1.25rem'
          }}>
            <TrophyIcon size={32} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
            Track Your Workouts with Precision
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            Sign in or create an account to log workout plans, schedule training sessions, track weight progression, and generate historical reports.
          </p>
          <button onClick={onOpenAuth} className="btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
            Get Started Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Welcome back, <span style={{ color: '#f59e0b' }}>{user.username}</span> 👋
          </h1>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>
            Here is an overview of your athletic progress and upcoming training plans.
          </p>
        </div>

        <button onClick={() => onNavigate('planner')} className="btn-primary">
          <PlusIcon size={18} />
          <span>New Workout Plan</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem'
      }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Workouts Done</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <TrophyIcon size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
            {loading ? '...' : (report?.completedWorkouts || 0)}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem' }}>
            out of {report?.totalWorkouts || 0} total sessions
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Lifted Volume</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <ActivityIcon size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
            {loading ? '...' : `${report?.totalVolumeLiftedKg || 0} kg`}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem' }}>
            Cumulative resistance weight
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Streak</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
              <FlameIcon size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
            {loading ? '...' : `${report?.currentStreakDays || 0} Days`}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem' }}>
            Consecutive training streak
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Upcoming Pending</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
              <CalendarIcon size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
            {loading ? '...' : upcomingWorkouts.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem' }}>
            Scheduled upcoming workouts
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Upcoming Workouts List */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarIcon size={18} style={{ color: '#f59e0b' }} />
              Upcoming Scheduled Workouts
            </h3>
            <button onClick={() => onNavigate('schedule')} className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
              View All
            </button>
          </div>

          {upcomingWorkouts.length === 0 ? (
            <div style={{ textTransform: 'none', padding: '2rem', textAlign: 'center', color: '#64748b', border: '1px dashed rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
              No upcoming scheduled workouts.
              <div style={{ marginTop: '0.75rem' }}>
                <button onClick={() => onNavigate('planner')} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
                  + Schedule a Workout
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {upcomingWorkouts.slice(0, 4).map((w) => (
                <div key={w.id} style={{
                  background: 'rgba(11, 15, 25, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}>
                  <div>
                    <h4 style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>{w.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <ClockIcon size={14} />
                        {new Date(w.scheduledAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <DumbbellIcon size={14} />
                        {w.exercises?.length || 0} exercises
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleMarkComplete(w.id)}
                    className="btn-secondary"
                    style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                  >
                    <CheckIcon size={16} />
                    <span>Complete</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Shortcuts & Tips */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
            Quick Actions
          </h3>

          <div 
            onClick={() => onNavigate('planner')}
            style={{
              padding: '1.25rem',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(19, 27, 46, 0.8) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>Create Workout Plan</div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.2rem' }}>Pick exercises, set target reps & weights</div>
            </div>
            <div style={{ color: '#f59e0b' }}>→</div>
          </div>

          <div 
            onClick={() => onNavigate('exercises')}
            style={{
              padding: '1.25rem',
              background: 'rgba(11, 15, 25, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>Browse Exercise Database</div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.2rem' }}>Explore strength, cardio, and mobility exercises</div>
            </div>
            <div style={{ color: '#94a3b8' }}>→</div>
          </div>

          <div 
            onClick={() => onNavigate('reports')}
            style={{
              padding: '1.25rem',
              background: 'rgba(11, 15, 25, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>View Analytics & Reports</div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.2rem' }}>Analyze muscle breakdowns and total weight trends</div>
            </div>
            <div style={{ color: '#94a3b8' }}>→</div>
          </div>
        </div>
      </div>
    </div>
  );
}
