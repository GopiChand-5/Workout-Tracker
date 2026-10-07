import React, { useState, useEffect } from 'react';
import { exerciseApi, workoutApi } from '../api';
import { PlusIcon, TrashIcon, SparklesIcon, CheckIcon, DumbbellIcon } from './Icons';

export default function WorkoutPlannerView({ user, onWorkoutCreated, onOpenAuth }) {
  const [exercisesList, setExercisesList] = useState([]);
  const [title, setTitle] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([
    { exerciseId: '', sets: 3, reps: 10, weightKg: 20, restSeconds: 60 }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    // Set default schedule time to tomorrow at 9 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    setScheduledAt(tomorrow.toISOString().slice(0, 16));

    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const data = await exerciseApi.getAll();
      setExercisesList(data || []);
      if (data && data.length > 0) {
        setSelectedExercises([
          { exerciseId: data[0].id, sets: 3, reps: 10, weightKg: 40, restSeconds: 60 }
        ]);
      }
    } catch (err) {
      console.error("Failed to fetch exercise library", err);
    }
  };

  const handleAddExerciseRow = () => {
    const defaultExId = exercisesList.length > 0 ? exercisesList[0].id : '';
    setSelectedExercises([
      ...selectedExercises,
      { exerciseId: defaultExId, sets: 3, reps: 10, weightKg: 20, restSeconds: 60 }
    ]);
  };

  const handleRemoveExerciseRow = (index) => {
    if (selectedExercises.length === 1) return;
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const handleRowChange = (index, field, value) => {
    const updated = [...selectedExercises];
    updated[index][field] = value;
    setSelectedExercises(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }

    if (!title.trim()) {
      setError('Please provide a workout title');
      return;
    }

    if (selectedExercises.some(ex => !ex.exerciseId)) {
      setError('Please select an exercise for each row');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const payload = {
        title,
        notes,
        scheduledAt: new Date(scheduledAt).toISOString(),
        status: 'SCHEDULED',
        exercises: selectedExercises.map((ex, i) => ({
          exerciseId: Number(ex.exerciseId),
          sets: Number(ex.sets),
          reps: Number(ex.reps),
          weightKg: Number(ex.weightKg),
          restSeconds: Number(ex.restSeconds),
          orderIndex: i + 1,
        }))
      };

      await workoutApi.create(payload);
      setSuccessMsg('Workout plan scheduled successfully!');
      setTitle('');
      setNotes('');
      if (onWorkoutCreated) onWorkoutCreated();
    } catch (err) {
      setError(err.message || 'Failed to create workout plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <SparklesIcon size={26} style={{ color: '#f59e0b' }} />
          Create Workout Plan
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>
          Design a custom training routine with target sets, repetitions, and weight progression.
        </p>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#fca5a5',
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
        }}>
          {error}
        </div>
      )}

      {successMsg && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <CheckIcon size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Workout Info Section */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem', fontWeight: 600 }}>
              Workout Routine Title *
            </label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="e.g., Hypertrophy Chest & Triceps Blast"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem', fontWeight: 600 }}>
              Scheduled Date & Time *
            </label>
            <input
              type="datetime-local"
              required
              className="input-field"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem', fontWeight: 600 }}>
              Comments / Notes
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., Focus on explosive concentric phase & 3s drop"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Exercises Table Section */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <DumbbellIcon size={20} style={{ color: '#f59e0b' }} />
              Routine Exercises ({selectedExercises.length})
            </h3>

            <button type="button" onClick={handleAddExerciseRow} className="btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
              <PlusIcon size={16} />
              <span>Add Exercise</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {selectedExercises.map((row, index) => (
              <div 
                key={index}
                style={{
                  background: 'rgba(11, 15, 25, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '1rem 1.25rem',
                  display: 'grid',
                  gridTemplateColumns: '3fr 1fr 1fr 1.2fr 1fr auto',
                  gap: '0.85rem',
                  alignItems: 'center',
                }}
              >
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Exercise</label>
                  <select
                    className="input-field"
                    style={{ padding: '0.5rem' }}
                    value={row.exerciseId}
                    onChange={(e) => handleRowChange(index, 'exerciseId', e.target.value)}
                  >
                    {exercisesList.map(ex => (
                      <option key={ex.id} value={ex.id} style={{ background: '#131b2e', color: '#fff' }}>
                        {ex.name} ({ex.targetMuscle} • {ex.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Sets</label>
                  <input
                    type="number"
                    min="1"
                    className="input-field"
                    style={{ padding: '0.5rem' }}
                    value={row.sets}
                    onChange={(e) => handleRowChange(index, 'sets', e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Reps</label>
                  <input
                    type="number"
                    min="1"
                    className="input-field"
                    style={{ padding: '0.5rem' }}
                    value={row.reps}
                    onChange={(e) => handleRowChange(index, 'reps', e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    className="input-field"
                    style={{ padding: '0.5rem' }}
                    value={row.weightKg}
                    onChange={(e) => handleRowChange(index, 'weightKg', e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Rest (sec)</label>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    className="input-field"
                    style={{ padding: '0.5rem' }}
                    value={row.restSeconds}
                    onChange={(e) => handleRowChange(index, 'restSeconds', e.target.value)}
                  />
                </div>

                <div style={{ paddingTop: '1.2rem' }}>
                  <button
                    type="button"
                    onClick={() => handleRemoveExerciseRow(index)}
                    className="btn-danger"
                    disabled={selectedExercises.length === 1}
                    style={{ padding: '0.5rem' }}
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
          >
            {loading ? 'Saving Plan...' : 'Save & Schedule Workout'}
          </button>
        </div>
      </form>
    </div>
  );
}
