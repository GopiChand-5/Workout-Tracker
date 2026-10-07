package com.gopi.workoutTracker.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "workout_exercises")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private Workout workout;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @Column(nullable = false)
    private Integer sets;

    @Column(nullable = false)
    private Integer reps;

    @Column(name = "weight_kg")
    private Double weightKg;

    @Column(name = "rest_seconds")
    private Integer restSeconds;

    @Column(name = "order_index")
    private Integer orderIndex;
}
