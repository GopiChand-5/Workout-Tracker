package com.gopi.workoutTracker.dto;

import com.gopi.workoutTracker.model.WorkoutStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutResponse {
    private Long id;
    private String title;
    private String notes;
    private LocalDateTime scheduledAt;
    private WorkoutStatus status;
    private UserDto user;
    private List<WorkoutExerciseDto> exercises;
    private Double totalVolumeKg;
    private Integer totalSets;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
