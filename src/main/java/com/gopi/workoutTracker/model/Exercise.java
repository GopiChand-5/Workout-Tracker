package com.gopi.workoutTracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "exercises")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExerciseCategory category;

    @NotBlank
    @Column(name = "target_muscle", nullable = false)
    private String targetMuscle;

    private String equipment;
}
