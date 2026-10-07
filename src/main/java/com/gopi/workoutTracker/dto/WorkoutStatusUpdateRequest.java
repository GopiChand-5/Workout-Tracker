package com.gopi.workoutTracker.dto;

import com.gopi.workoutTracker.model.WorkoutStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WorkoutStatusUpdateRequest {
    @NotNull
    private WorkoutStatus status;
    private String notes;
}
