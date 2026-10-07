package com.gopi.workoutTracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutReportSummaryDto {
    private long totalWorkouts;
    private long completedWorkouts;
    private long scheduledWorkouts;
    private double totalVolumeLiftedKg;
    private int currentStreakDays;
    private List<CategoryBreakdownDto> categoryBreakdown;
    private List<ProgressPointDto> recentProgress;
}
