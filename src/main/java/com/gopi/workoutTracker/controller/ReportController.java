package com.gopi.workoutTracker.controller;

import com.gopi.workoutTracker.dto.WorkoutReportSummaryDto;
import com.gopi.workoutTracker.security.UserPrincipal;
import com.gopi.workoutTracker.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Progress & Analytics Reports", description = "Endpoints for generating reports on past workouts, volume lifted, streaks, and progress")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/summary")
    @Operation(summary = "Generate workout report summary", description = "Generates comprehensive report analytics including completed count, total volume lifted in kg, streak days, and muscle category distribution.")
    public ResponseEntity<WorkoutReportSummaryDto> getReportSummary(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        WorkoutReportSummaryDto summary = reportService.generateReportSummary(currentUser);
        return ResponseEntity.ok(summary);
    }
}
