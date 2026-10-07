package com.gopi.workoutTracker.dto;

import com.gopi.workoutTracker.model.ExerciseCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseDto {
    private Long id;
    private String name;
    private String description;
    private ExerciseCategory category;
    private String targetMuscle;
    private String equipment;
}
