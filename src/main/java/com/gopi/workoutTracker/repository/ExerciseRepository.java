package com.gopi.workoutTracker.repository;

import com.gopi.workoutTracker.model.Exercise;
import com.gopi.workoutTracker.model.ExerciseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByCategory(ExerciseCategory category);
    List<Exercise> findByTargetMuscleIgnoreCase(String targetMuscle);
    List<Exercise> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String nameKeyword, String descKeyword);
}
