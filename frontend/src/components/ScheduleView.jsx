import React, { useState, useEffect } from 'react';
import { workoutApi } from '../api';
import { CalendarIcon, ClockIcon, CheckIcon, TrashIcon, DumbbellIcon, FlameIcon, PlusIcon } from './Icons';

export default function ScheduleView({ user, onNavigate, onOpenAuth }) {
  const [workouts, setWorkouts] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchWorkouts();
    } else {
      setLoading(false);
    }
  }, [user, statusFilter]);

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const statusParam = statusFilter === 'ALL' ? null : statusFilter;
      const data = await workoutApi.getAll(statusParam);
      setWorkouts(data || []);
    } catch (err) {
      console.error("Failed to fetch workouts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (workoutId, newStatus) => {
    try {
      await workoutApi.updateStatus(workoutId, { status: newStatus });
      fetchWorkouts();
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handleDelete = async (workoutId) => {
    if (!window.confirm("Are you sure you want to delete this workout plan?")) return;
    try {
      await workoutApi.delete(workoutId);
      fetchWorkouts();
    } catch (err) {
      alert("Failed to delete workout: " + err.message);
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>Log in to access your workout schedule</h2>
        <button onClick={onOpenAuth} className="btn-primary">Sign In</button>
      </div>
    );
  }

  const filterTabs = [
    { id: 'ALL', label: 'All Sessions' },
    { id: 'SCHEDULED', label: 'Scheduled / Pending' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'COMPLETED', label: 'Completed' },
    { id: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CalendarIcon size={26} style={{ color: '#f59e0b' }} />
            Schedule & Activity Logs
          </h1>
          <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>
            Active and pending workouts sorted chronologically by scheduled date & time.
          </p>
        </div>

        <button onClick={() => onNavigate('planner')} className="btn-primary">
          <PlusIcon size={18} />
          <span>New Workout</span>
        </button>
      </div>

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            style={{
              background: statusFilter === tab.id ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: statusFilter === tab.id ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
              color: statusFilter === tab.id ? '#f59e0b' : '#94a3b8',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: statusFilter === tab.id ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Workout Cards Stream */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading schedule...</div>
      ) : workouts.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          No workouts found matching the selected filter.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {workouts.map((w) => {
            const isExpanded = expandedId === w.id;
            return (
              <div 
                key={w.id} 
                className="glass-panel"
                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{w.title}</h3>
                      <span className={`badge badge-${w.status.toLowerCase()}`}>
                        {w.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.4rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <ClockIcon size={15} style={{ color: '#f59e0b' }} />
                        {new Date(w.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>

                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <DumbbellIcon size={15} />
                        {w.exercises?.length || 0} Exercises ({w.totalSets || 0} Sets)
                      </span>

                      {w.totalVolumeKg > 0 && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f8fafc', fontWeight: 600 }}>
                          <FlameIcon size={15} style={{ color: '#ef4444' }} />
                          {w.totalVolumeKg} kg volume
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Status Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {w.status !== 'COMPLETED' && (
                      <button
                        onClick={() => handleStatusChange(w.id, 'COMPLETED')}
                        className="btn-secondary"
                        style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                      >
                        <CheckIcon size={15} />
                        <span>Mark Done</span>
                      </button>
                    )}

                    {w.status === 'SCHEDULED' && (
                      <button
                        onClick={() => handleStatusChange(w.id, 'IN_PROGRESS')}
                        className="btn-secondary"
                        style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)' }}
                      >
                        <span>Start Now</span>
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : w.id)}
                      className="btn-secondary"
                    >
                      {isExpanded ? 'Hide Details' : 'View Exercises'}
                    </button>

                    <button
                      onClick={() => handleDelete(w.id)}
                      className="btn-danger"
                      title="Delete Workout"
                    >
                      <TrashIcon size={15} />
                    </button>
                  </div>
                </div>

                {w.notes && (
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', background: 'rgba(11, 15, 25, 0.4)', padding: '0.65rem 0.85rem', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
                    <strong>Notes:</strong> {w.notes}
                  </div>
                )}

                {/* Expanded Exercises Breakdown */}
                {isExpanded && (
                  <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <h4 style={{ fontSize: '0.9rem', color: '#f59e0b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Exercise Set Breakdown
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                      {w.exercises?.map((ex, idx) => (
                        <div 
                          key={idx}
                          style={{
                            background: 'rgba(11, 15, 25, 0.7)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            padding: '0.85rem',
                            borderRadius: '10px',
                          }}
                        >
                          <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>
                            {ex.exerciseName}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                            {ex.targetMuscle} • {ex.category}
                          </div>
                          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                            <span>{ex.sets} Sets</span>
                            <span>×</span>
                            <span>{ex.reps} Reps</span>
                            {ex.weightKg > 0 && <span style={{ color: '#f59e0b' }}>@ {ex.weightKg} kg</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
