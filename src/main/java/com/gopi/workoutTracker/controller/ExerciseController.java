package com.gopi.workoutTracker.controller;

import com.gopi.workoutTracker.dto.ExerciseDto;
import com.gopi.workoutTracker.model.ExerciseCategory;
import com.gopi.workoutTracker.service.ExerciseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
@Tag(name = "Exercise Data Library", description = "Endpoints for fetching and filtering seeded exercises")
public class ExerciseController {

    @Autowired
    private ExerciseService exerciseService;

    @GetMapping
    @Operation(summary = "List and search exercises", description = "Retrieves seeded exercises with optional filtering by category, target muscle, or search query.")
    public ResponseEntity<List<ExerciseDto>> getAllExercises(
            @RequestParam(required = false) ExerciseCategory category,
            @RequestParam(required = false) String targetMuscle,
            @RequestParam(required = false) String query) {
        List<ExerciseDto> exercises = exerciseService.getAllExercises(category, targetMuscle, query);
        return ResponseEntity.ok(exercises);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get exercise by ID", description = "Returns details of a specific exercise.")
    public ResponseEntity<ExerciseDto> getExerciseById(@PathVariable Long id) {
        ExerciseDto exercise = exerciseService.getExerciseById(id);
        return ResponseEntity.ok(exercise);
    }
}
