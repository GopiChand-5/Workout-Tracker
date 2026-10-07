package com.gopi.workoutTracker.service;

import com.gopi.workoutTracker.dto.CategoryBreakdownDto;
import com.gopi.workoutTracker.dto.ProgressPointDto;
import com.gopi.workoutTracker.dto.WorkoutReportSummaryDto;
import com.gopi.workoutTracker.model.User;
import com.gopi.workoutTracker.model.Workout;
import com.gopi.workoutTracker.model.WorkoutStatus;
import com.gopi.workoutTracker.repository.UserRepository;
import com.gopi.workoutTracker.repository.WorkoutRepository;
import com.gopi.workoutTracker.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private UserRepository userRepository;

    public WorkoutReportSummaryDto generateReportSummary(UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Workout> allWorkouts = workoutRepository.findByUserOrderByScheduledAtAsc(user);

        long totalWorkouts = allWorkouts.size();
        long completedCount = allWorkouts.stream()
                .filter(w -> w.getStatus() == WorkoutStatus.COMPLETED)
                .count();
        long scheduledCount = allWorkouts.stream()
                .filter(w -> w.getStatus() == WorkoutStatus.SCHEDULED)
                .count();

        double totalVolumeLifted = allWorkouts.stream()
                .filter(w -> w.getStatus() == WorkoutStatus.COMPLETED)
                .flatMap(w -> w.getWorkoutExercises().stream())
                .mapToDouble(we -> (we.getWeightKg() != null ? we.getWeightKg() : 0.0) * we.getSets() * we.getReps())
                .sum();

        // Calculate Category Breakdown
        Map<String, Long> categoryCounts = new HashMap<>();
        allWorkouts.stream()
                .flatMap(w -> w.getWorkoutExercises().stream())
                .forEach(we -> {
                    String category = we.getExercise().getCategory().name();
                    categoryCounts.put(category, categoryCounts.getOrDefault(category, 0L) + 1);
                });

        long totalExercisesLogged = categoryCounts.values().stream().mapToLong(Long::longValue).sum();

        List<CategoryBreakdownDto> categoryBreakdowns = categoryCounts.entrySet().stream()
                .map(entry -> {
                    double percentage = totalExercisesLogged > 0 ? (entry.getValue() * 100.0) / totalExercisesLogged : 0.0;
                    return CategoryBreakdownDto.builder()
                            .category(entry.getKey())
                            .count(entry.getValue())
                            .percentage(Math.round(percentage * 10.0) / 10.0)
                            .build();
                })
                .collect(Collectors.toList());

        // Calculate Progress Points
        List<ProgressPointDto> recentProgress = allWorkouts.stream()
                .filter(w -> w.getStatus() == WorkoutStatus.COMPLETED)
                .map(w -> {
                    double vol = w.getWorkoutExercises().stream()
                            .mapToDouble(we -> (we.getWeightKg() != null ? we.getWeightKg() : 0.0) * we.getSets() * we.getReps())
                            .sum();
                    return ProgressPointDto.builder()
                            .date(w.getScheduledAt().toLocalDate())
                            .workoutTitle(w.getTitle())
                            .volumeKg(vol)
                            .exercisesCount(w.getWorkoutExercises().size())
                            .build();
                })
                .collect(Collectors.toList());

        // Calculate streak (consecutive days with completed workouts leading to today or recent)
        int streak = calculateStreak(allWorkouts);

        return WorkoutReportSummaryDto.builder()
                .totalWorkouts(totalWorkouts)
                .completedWorkouts(completedCount)
                .scheduledWorkouts(scheduledCount)
                .totalVolumeLiftedKg(Math.round(totalVolumeLifted * 10.0) / 10.0)
                .currentStreakDays(streak)
                .categoryBreakdown(categoryBreakdowns)
                .recentProgress(recentProgress)
                .build();
    }

    private int calculateStreak(List<Workout> workouts) {
        Set<LocalDate> completedDates = workouts.stream()
                .filter(w -> w.getStatus() == WorkoutStatus.COMPLETED)
                .map(w -> w.getScheduledAt().toLocalDate())
                .collect(Collectors.toSet());

        if (completedDates.isEmpty()) return 0;

        LocalDate checkDate = LocalDate.now();
        if (!completedDates.contains(checkDate)) {
            checkDate = checkDate.minusDays(1);
        }

        int streak = 0;
        while (completedDates.contains(checkDate)) {
            streak++;
            checkDate = checkDate.minusDays(1);
        }
        return streak;
    }
}
