package com.gopi.workoutTracker.repository;

import com.gopi.workoutTracker.model.WorkoutExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutExerciseRepository extends JpaRepository<WorkoutExercise, Long> {
    List<WorkoutExercise> findByWorkoutIdOrderByOrderIndexAsc(Long workoutId);
}
