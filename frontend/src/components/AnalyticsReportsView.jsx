import React, { useState, useEffect } from 'react';
import { reportApi } from '../api';
import { BarChartIcon, TrophyIcon, FlameIcon, ActivityIcon } from './Icons';

export default function AnalyticsReportsView({ user, onOpenAuth }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReport();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await reportApi.getSummary();
      setReport(data);
    } catch (err) {
      console.error("Failed to load report analytics", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>Log in to view workout analytics and progress reports</h2>
        <button onClick={onOpenAuth} className="btn-primary">Sign In</button>
      </div>
    );
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Generating analytics report...</div>;
  }

  const categoryData = report?.categoryBreakdown || [];
  const progressData = report?.recentProgress || [];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <BarChartIcon size={26} style={{ color: '#f59e0b' }} />
          Performance & Analytics Reports
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>
          Historical data insights on volume load, completion rate, and discipline distribution.
        </p>
      </div>

      {/* Top Stat Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Completion Ratio</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: '0.5rem' }}>
            {report?.completedWorkouts || 0} / {report?.totalWorkouts || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#34d399', marginTop: '0.3rem' }}>
            {report?.totalWorkouts > 0 ? Math.round((report.completedWorkouts / report.totalWorkouts) * 100) : 0}% completion rate
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Volume Lifted</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.5rem' }}>
            {report?.totalVolumeLiftedKg || 0} kg
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.3rem' }}>
            Calculated across all completed sets
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Current Streak</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444', marginTop: '0.5rem' }}>
            {report?.currentStreakDays || 0} Days
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.3rem' }}>
            Consecutive active training days
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Discipline Breakdown */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>
            Training Category Distribution
          </h3>

          {categoryData.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
              No exercise category data logged yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {categoryData.map((cat, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                    <span style={{ color: '#fff' }}>{cat.category}</span>
                    <span style={{ color: '#f59e0b' }}>{cat.count} exercises ({cat.percentage}%)</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '10px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${cat.percentage}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
                      borderRadius: '9999px',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Volume Progress Over Time */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>
            Recent Completed Sessions Volume
          </h3>

          {progressData.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
              Complete workouts to generate volume progress trends.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {progressData.map((p, idx) => (
                <div key={idx} style={{
                  background: 'rgba(11, 15, 25, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>{p.workoutTitle}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{p.date} • {p.exercisesCount} Exercises</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b' }}>{p.volumeKg} kg</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Volume Load</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
