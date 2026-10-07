package com.gopi.workoutTracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workouts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String notes;

    @Column(name = "scheduled_at", nullable = false)
    private LocalDateTime scheduledAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WorkoutStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "workout", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WorkoutExercise> workoutExercises = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = WorkoutStatus.SCHEDULED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void addWorkoutExercise(WorkoutExercise workoutExercise) {
        workoutExercises.add(workoutExercise);
        workoutExercise.setWorkout(this);
    }

    public void removeWorkoutExercise(WorkoutExercise workoutExercise) {
        workoutExercises.remove(workoutExercise);
        workoutExercise.setWorkout(null);
    }
}
