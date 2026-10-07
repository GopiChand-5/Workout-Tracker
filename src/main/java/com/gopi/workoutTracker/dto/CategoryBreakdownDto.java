package com.gopi.workoutTracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryBreakdownDto {
    private String category;
    private long count;
    private double percentage;
}
