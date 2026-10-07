package com.gopi.workoutTracker.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutExerciseDto {
    private Long id;

    @NotNull
    private Long exerciseId;

    private String exerciseName;
    private String targetMuscle;
    private String category;

    @NotNull
    @Min(1)
    private Integer sets;

    @NotNull
    @Min(1)
    private Integer reps;

    @Min(0)
    private Double weightKg;

    private Integer restSeconds;
    private Integer orderIndex;
}
