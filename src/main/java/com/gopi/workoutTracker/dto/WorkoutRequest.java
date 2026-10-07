package com.gopi.workoutTracker.dto;

import com.gopi.workoutTracker.model.WorkoutStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class WorkoutRequest {

    @NotBlank
    private String title;

    private String notes;

    @NotNull
    private LocalDateTime scheduledAt;

    private WorkoutStatus status;

    @NotEmpty
    @Valid
    private List<WorkoutExerciseDto> exercises;
}
