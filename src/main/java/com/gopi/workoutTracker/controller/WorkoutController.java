package com.gopi.workoutTracker.controller;

import com.gopi.workoutTracker.dto.*;
import com.gopi.workoutTracker.model.WorkoutStatus;
import com.gopi.workoutTracker.security.UserPrincipal;
import com.gopi.workoutTracker.service.WorkoutService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@Tag(name = "Workout Management", description = "Endpoints for creating, retrieving, updating, scheduling, and deleting workouts")
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;

    @PostMapping
    @Operation(summary = "Create a new workout plan", description = "Creates a workout consisting of multiple exercises with sets, reps, weights, and scheduled time.")
    public ResponseEntity<WorkoutResponse> createWorkout(
            @Valid @RequestBody WorkoutRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        WorkoutResponse response = workoutService.createWorkout(request, currentUser);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "List user workouts", description = "Lists active, pending, or completed workouts for the authenticated user, sorted by date and time.")
    public ResponseEntity<List<WorkoutResponse>> getWorkouts(
            @RequestParam(required = false) WorkoutStatus status,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<WorkoutResponse> workouts = workoutService.getWorkoutsForUser(currentUser, status);
        return ResponseEntity.ok(workouts);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get workout details by ID", description = "Retrieves details of a specific workout plan.")
    public ResponseEntity<WorkoutResponse> getWorkoutById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        WorkoutResponse workout = workoutService.getWorkoutById(id, currentUser);
        return ResponseEntity.ok(workout);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update workout plan", description = "Updates workout details, scheduled date, comments, and exercises.")
    public ResponseEntity<WorkoutResponse> updateWorkout(
            @PathVariable Long id,
            @Valid @RequestBody WorkoutRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        WorkoutResponse response = workoutService.updateWorkout(id, request, currentUser);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update workout status", description = "Updates workout status (e.g., SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED) and notes.")
    public ResponseEntity<WorkoutResponse> updateWorkoutStatus(
            @PathVariable Long id,
            @Valid @RequestBody WorkoutStatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        WorkoutResponse response = workoutService.updateWorkoutStatus(id, request, currentUser);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete workout plan", description = "Deletes a specific workout plan for the authenticated user.")
    public ResponseEntity<Void> deleteWorkout(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        workoutService.deleteWorkout(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
