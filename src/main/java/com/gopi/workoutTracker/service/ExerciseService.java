package com.gopi.workoutTracker.service;

import com.gopi.workoutTracker.dto.ExerciseDto;
import com.gopi.workoutTracker.model.Exercise;
import com.gopi.workoutTracker.model.ExerciseCategory;
import com.gopi.workoutTracker.repository.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExerciseService {

    @Autowired
    private ExerciseRepository exerciseRepository;

    public List<ExerciseDto> getAllExercises(ExerciseCategory category, String targetMuscle, String query) {
        List<Exercise> exercises;

        if (category != null) {
            exercises = exerciseRepository.findByCategory(category);
        } else if (StringUtils.hasText(targetMuscle)) {
            exercises = exerciseRepository.findByTargetMuscleIgnoreCase(targetMuscle);
        } else if (StringUtils.hasText(query)) {
            exercises = exerciseRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
        } else {
            exercises = exerciseRepository.findAll();
        }

        return exercises.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ExerciseDto getExerciseById(Long id) {
        Exercise exercise = exerciseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Exercise not found with id: " + id));
        return mapToDto(exercise);
    }

    public ExerciseDto mapToDto(Exercise exercise) {
        return ExerciseDto.builder()
                .id(exercise.getId())
                .name(exercise.getName())
                .description(exercise.getDescription())
                .category(exercise.getCategory())
                .targetMuscle(exercise.getTargetMuscle())
                .equipment(exercise.getEquipment())
                .build();
    }
}
