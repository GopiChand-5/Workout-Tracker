package com.gopi.workoutTracker.repository;

import com.gopi.workoutTracker.model.User;
import com.gopi.workoutTracker.model.Workout;
import com.gopi.workoutTracker.model.WorkoutStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    List<Workout> findByUserOrderByScheduledAtAsc(User user);
    List<Workout> findByUserAndStatusOrderByScheduledAtAsc(User user, WorkoutStatus status);
    List<Workout> findByUserAndScheduledAtBetweenOrderByScheduledAtAsc(User user, LocalDateTime start, LocalDateTime end);

    @Query("SELECT COUNT(w) FROM Workout w WHERE w.user = :user AND w.status = :status")
    long countByUserAndStatus(@Param("user") User user, @Param("status") WorkoutStatus status);
}
