import React, { useState, useEffect } from 'react';
import { exerciseApi } from '../api';
import { SearchIcon, DumbbellIcon, ActivityIcon } from './Icons';

export default function ExerciseLibraryView() {
  const [exercises, setExercises] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExercises();
  }, [selectedCategory, selectedMuscle, searchQuery]);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const data = await exerciseApi.getAll({
        category: selectedCategory || null,
        targetMuscle: selectedMuscle || null,
        query: searchQuery || null,
      });
      setExercises(data || []);
    } catch (err) {
      console.error("Failed to fetch exercises", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['ALL', 'STRENGTH', 'CARDIO', 'FLEXIBILITY', 'BODYWEIGHT'];
  const muscles = ['ALL', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardiovascular'];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <DumbbellIcon size={26} style={{ color: '#f59e0b' }} />
          Exercise Database
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>
          Explore seeded training exercises categorized by discipline and primary target muscle group.
        </p>
      </div>

      {/* Controls Header */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <SearchIcon size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '2.75rem' }}
            placeholder="Search exercises by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginRight: '0.5rem' }}>Category:</span>
          {categories.map((cat) => {
            const val = cat === 'ALL' ? '' : cat;
            const isSelected = selectedCategory === val;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(val)}
                style={{
                  background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  border: isSelected ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isSelected ? '#f59e0b' : '#94a3b8',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Muscle Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginRight: '0.5rem' }}>Target Muscle:</span>
          {muscles.map((m) => {
            const val = m === 'ALL' ? '' : m;
            const isSelected = selectedMuscle === val;
            return (
              <button
                key={m}
                onClick={() => setSelectedMuscle(val)}
                style={{
                  background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  border: isSelected ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isSelected ? '#60a5fa' : '#94a3b8',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Exercise Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading exercise library...</div>
      ) : exercises.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          No exercises match your search query or filter.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {exercises.map((ex) => (
            <div 
              key={ex.id}
              className="glass-panel"
              style={{
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#f59e0b',
                    letterSpacing: '0.05em',
                  }}>
                    {ex.category}
                  </span>

                  <span style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    color: '#cbd5e1',
                  }}>
                    {ex.equipment || 'Bodyweight'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
                  {ex.name}
                </h3>

                <div style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 600, marginBottom: '0.75rem' }}>
                  Target: {ex.targetMuscle}
                </div>

                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  {ex.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
