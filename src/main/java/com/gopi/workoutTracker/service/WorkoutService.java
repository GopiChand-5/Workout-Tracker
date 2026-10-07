package com.gopi.workoutTracker.service;

import com.gopi.workoutTracker.dto.*;
import com.gopi.workoutTracker.model.*;
import com.gopi.workoutTracker.repository.ExerciseRepository;
import com.gopi.workoutTracker.repository.UserRepository;
import com.gopi.workoutTracker.repository.WorkoutRepository;
import com.gopi.workoutTracker.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkoutService {

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private AuthService authService;

    @Transactional
    public WorkoutResponse createWorkout(WorkoutRequest request, UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Workout workout = Workout.builder()
                .title(request.getTitle())
                .notes(request.getNotes())
                .scheduledAt(request.getScheduledAt())
                .status(request.getStatus() != null ? request.getStatus() : WorkoutStatus.SCHEDULED)
                .user(user)
                .workoutExercises(new ArrayList<>())
                .build();

        if (request.getExercises() != null) {
            int order = 1;
            for (WorkoutExerciseDto exDto : request.getExercises()) {
                Exercise exercise = exerciseRepository.findById(exDto.getExerciseId())
                        .orElseThrow(() -> new IllegalArgumentException("Exercise not found with id: " + exDto.getExerciseId()));

                WorkoutExercise workoutExercise = WorkoutExercise.builder()
                        .exercise(exercise)
                        .sets(exDto.getSets())
                        .reps(exDto.getReps())
                        .weightKg(exDto.getWeightKg() != null ? exDto.getWeightKg() : 0.0)
                        .restSeconds(exDto.getRestSeconds() != null ? exDto.getRestSeconds() : 60)
                        .orderIndex(exDto.getOrderIndex() != null ? exDto.getOrderIndex() : order++)
                        .build();

                workout.addWorkoutExercise(workoutExercise);
            }
        }

        Workout savedWorkout = workoutRepository.save(workout);
        return mapToResponse(savedWorkout);
    }

    public List<WorkoutResponse> getWorkoutsForUser(UserPrincipal currentUser, WorkoutStatus status) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Workout> workouts;
        if (status != null) {
            workouts = workoutRepository.findByUserAndStatusOrderByScheduledAtAsc(user, status);
        } else {
            workouts = workoutRepository.findByUserOrderByScheduledAtAsc(user);
        }

        return workouts.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public WorkoutResponse getWorkoutById(Long id, UserPrincipal currentUser) {
        Workout workout = getWorkoutAndVerifyUser(id, currentUser);
        return mapToResponse(workout);
    }

    @Transactional
    public WorkoutResponse updateWorkout(Long id, WorkoutRequest request, UserPrincipal currentUser) {
        Workout workout = getWorkoutAndVerifyUser(id, currentUser);

        workout.setTitle(request.getTitle());
        workout.setNotes(request.getNotes());
        workout.setScheduledAt(request.getScheduledAt());
        if (request.getStatus() != null) {
            workout.setStatus(request.getStatus());
        }

        // Clear existing exercise associations
        workout.getWorkoutExercises().clear();

        if (request.getExercises() != null) {
            int order = 1;
            for (WorkoutExerciseDto exDto : request.getExercises()) {
                Exercise exercise = exerciseRepository.findById(exDto.getExerciseId())
                        .orElseThrow(() -> new IllegalArgumentException("Exercise not found with id: " + exDto.getExerciseId()));

                WorkoutExercise workoutExercise = WorkoutExercise.builder()
                        .exercise(exercise)
                        .sets(exDto.getSets())
                        .reps(exDto.getReps())
                        .weightKg(exDto.getWeightKg() != null ? exDto.getWeightKg() : 0.0)
                        .restSeconds(exDto.getRestSeconds() != null ? exDto.getRestSeconds() : 60)
                        .orderIndex(exDto.getOrderIndex() != null ? exDto.getOrderIndex() : order++)
                        .build();

                workout.addWorkoutExercise(workoutExercise);
            }
        }

        Workout updatedWorkout = workoutRepository.save(workout);
        return mapToResponse(updatedWorkout);
    }

    @Transactional
    public WorkoutResponse updateWorkoutStatus(Long id, WorkoutStatusUpdateRequest request, UserPrincipal currentUser) {
        Workout workout = getWorkoutAndVerifyUser(id, currentUser);
        workout.setStatus(request.getStatus());
        if (request.getNotes() != null) {
            workout.setNotes(request.getNotes());
        }

        Workout updatedWorkout = workoutRepository.save(workout);
        return mapToResponse(updatedWorkout);
    }

    @Transactional
    public void deleteWorkout(Long id, UserPrincipal currentUser) {
        Workout workout = getWorkoutAndVerifyUser(id, currentUser);
        workoutRepository.delete(workout);
    }

    private Workout getWorkoutAndVerifyUser(Long id, UserPrincipal currentUser) {
        Workout workout = workoutRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Workout not found with id: " + id));

        if (!workout.getUser().getId().equals(currentUser.getId())) {
            throw new SecurityException("Unauthorized access to workout id: " + id);
        }

        return workout;
    }

    public WorkoutResponse mapToResponse(Workout workout) {
        List<WorkoutExerciseDto> exerciseDtos = workout.getWorkoutExercises().stream()
                .map(we -> WorkoutExerciseDto.builder()
                        .id(we.getId())
                        .exerciseId(we.getExercise().getId())
                        .exerciseName(we.getExercise().getName())
                        .targetMuscle(we.getExercise().getTargetMuscle())
                        .category(we.getExercise().getCategory().name())
                        .sets(we.getSets())
                        .reps(we.getReps())
                        .weightKg(we.getWeightKg())
                        .restSeconds(we.getRestSeconds())
                        .orderIndex(we.getOrderIndex())
                        .build())
                .collect(Collectors.toList());

        double totalVolume = workout.getWorkoutExercises().stream()
                .mapToDouble(we -> (we.getWeightKg() != null ? we.getWeightKg() : 0.0) * we.getSets() * we.getReps())
                .sum();

        int totalSets = workout.getWorkoutExercises().stream()
                .mapToInt(WorkoutExercise::getSets)
                .sum();

        return WorkoutResponse.builder()
                .id(workout.getId())
                .title(workout.getTitle())
                .notes(workout.getNotes())
                .scheduledAt(workout.getScheduledAt())
                .status(workout.getStatus())
                .user(authService.mapToUserDto(workout.getUser()))
                .exercises(exerciseDtos)
                .totalVolumeKg(totalVolume)
                .totalSets(totalSets)
                .createdAt(workout.getCreatedAt())
                .updatedAt(workout.getUpdatedAt())
                .build();
    }
}
