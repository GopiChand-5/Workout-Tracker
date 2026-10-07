package com.gopi.workoutTracker;

import com.gopi.workoutTracker.dto.WorkoutExerciseDto;
import com.gopi.workoutTracker.dto.WorkoutRequest;
import com.gopi.workoutTracker.dto.WorkoutResponse;
import com.gopi.workoutTracker.model.*;
import com.gopi.workoutTracker.repository.ExerciseRepository;
import com.gopi.workoutTracker.repository.UserRepository;
import com.gopi.workoutTracker.repository.WorkoutRepository;
import com.gopi.workoutTracker.security.UserPrincipal;
import com.gopi.workoutTracker.service.AuthService;
import com.gopi.workoutTracker.service.WorkoutService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class WorkoutServiceTest {

    @Mock
    private WorkoutRepository workoutRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ExerciseRepository exerciseRepository;

    @Mock
    private AuthService authService;

    @InjectMocks
    private WorkoutService workoutService;

    @Test
    public void testCreateWorkoutSuccess() {
        User user = User.builder().id(1L).username("john").email("john@example.com").role(Role.ROLE_USER).build();
        UserPrincipal userPrincipal = UserPrincipal.create(user);

        Exercise exercise = Exercise.builder()
                .id(10L)
                .name("Bench Press")
                .category(ExerciseCategory.STRENGTH)
                .targetMuscle("Chest")
                .build();

        WorkoutRequest request = new WorkoutRequest();
        request.setTitle("Chest Day");
        request.setNotes("Heavy sets");
        request.setScheduledAt(LocalDateTime.now().plusDays(1));
        request.setStatus(WorkoutStatus.SCHEDULED);

        WorkoutExerciseDto exDto = WorkoutExerciseDto.builder()
                .exerciseId(10L)
                .sets(3)
                .reps(10)
                .weightKg(80.0)
                .restSeconds(90)
                .build();
        request.setExercises(List.of(exDto));

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(exerciseRepository.findById(10L)).thenReturn(Optional.of(exercise));
        when(workoutRepository.save(any(Workout.class))).thenAnswer(invocation -> {
            Workout w = invocation.getArgument(0);
            w.setId(100L);
            return w;
        });

        WorkoutResponse response = workoutService.createWorkout(request, userPrincipal);

        assertNotNull(response);
        assertEquals("Chest Day", response.getTitle());
        assertEquals(2400.0, response.getTotalVolumeKg()); // 80kg * 3 sets * 10 reps = 2400kg
        verify(workoutRepository, times(1)).save(any(Workout.class));
    }
}
