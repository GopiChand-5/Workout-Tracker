package com.gopi.workoutTracker.config;

import com.gopi.workoutTracker.model.Exercise;
import com.gopi.workoutTracker.model.ExerciseCategory;
import com.gopi.workoutTracker.repository.ExerciseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSeeder.class);

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Override
    public void run(String... args) throws Exception {
        if (exerciseRepository.count() == 0) {
            logger.info("Seeding initial exercise data into the database...");

            List<Exercise> exercises = List.of(
                    // STRENGTH - Chest & Triceps
                    Exercise.builder()
                            .name("Barbell Bench Press")
                            .description("Lie on bench, unrack barbell, lower to mid-chest, and press upward dynamically.")
                            .category(ExerciseCategory.STRENGTH)
                            .targetMuscle("Chest")
                            .equipment("Barbell")
                            .build(),
                    Exercise.builder()
                            .name("Incline Dumbbell Press")
                            .description("Press dumbbells on an incline bench targeting upper pectoral chest muscles.")
                            .category(ExerciseCategory.STRENGTH)
                            .targetMuscle("Chest")
                            .equipment("Dumbbells")
                            .build(),
                    Exercise.builder()
                            .name("Tricep Dips")
                            .description("Bodyweight or weighted parallel bar dips emphasizing tricep and chest tension.")
                            .category(ExerciseCategory.BODYWEIGHT)
                            .targetMuscle("Arms")
                            .equipment("Parallel Bars")
                            .build(),

                    // STRENGTH - Back & Biceps
                    Exercise.builder()
                            .name("Barbell Deadlift")
                            .description("Fundamental compound lift engaging posterior chain, hamstrings, glutes, and upper back.")
                            .category(ExerciseCategory.STRENGTH)
                            .targetMuscle("Back")
                            .equipment("Barbell")
                            .build(),
                    Exercise.builder()
                            .name("Lat Pulldown")
                            .description("Cable pulldown to upper chest targeting latissimus dorsi muscle width.")
                            .category(ExerciseCategory.STRENGTH)
                            .targetMuscle("Back")
                            .equipment("Cable Machine")
                            .build(),
                    Exercise.builder()
                            .name("Dumbbell Bicep Curls")
                            .description("Alternating or simultaneous dumbbell arm flexion engaging biceps brachii.")
                            .category(ExerciseCategory.STRENGTH)
                            .targetMuscle("Arms")
                            .equipment("Dumbbells")
                            .build(),

                    // STRENGTH - Legs
                    Exercise.builder()
                            .name("Barbell Back Squat")
                            .description("Full depth squat loading quadriceps, glutes, and core stability.")
                            .category(ExerciseCategory.STRENGTH)
                            .targetMuscle("Legs")
                            .equipment("Barbell")
                            .build(),
                    Exercise.builder()
                            .name("Romanian Deadlift")
                            .description("Hinge movement loading hamstrings and glutes with controlled eccentric phase.")
                            .category(ExerciseCategory.STRENGTH)
                            .targetMuscle("Legs")
                            .equipment("Barbell / Dumbbells")
                            .build(),
                    Exercise.builder()
                            .name("Leg Press")
                            .description("Heavy machine leg extension targeting quads and glutes with lower back support.")
                            .category(ExerciseCategory.STRENGTH)
                            .targetMuscle("Legs")
                            .equipment("Leg Press Machine")
                            .build(),

                    // STRENGTH - Shoulders
                    Exercise.builder()
                            .name("Overhead Military Press")
                            .description("Standing vertical press focusing on anterior deltoids and core bracing.")
                            .category(ExerciseCategory.STRENGTH)
                            .targetMuscle("Shoulders")
                            .equipment("Barbell")
                            .build(),
                    Exercise.builder()
                            .name("Dumbbell Lateral Raise")
                            .description("Isolation lift for lateral deltoid head development and shoulder width.")
                            .category(ExerciseCategory.STRENGTH)
                            .targetMuscle("Shoulders")
                            .equipment("Dumbbells")
                            .build(),

                    // CARDIO
                    Exercise.builder()
                            .name("Treadmill HIIT Run")
                            .description("High-intensity interval sprints alternating with recovery jog segments.")
                            .category(ExerciseCategory.CARDIO)
                            .targetMuscle("Cardiovascular")
                            .equipment("Treadmill")
                            .build(),
                    Exercise.builder()
                            .name("Rowing Ergometer")
                            .description("Full-body cardiovascular endurance training engaging legs, core, and back pull.")
                            .category(ExerciseCategory.CARDIO)
                            .targetMuscle("Cardiovascular")
                            .equipment("Rowing Machine")
                            .build(),
                    Exercise.builder()
                            .name("Jump Rope Sprints")
                            .description("Fast tempo skipping sessions boosting agility, calves, and heart rate elevation.")
                            .category(ExerciseCategory.CARDIO)
                            .targetMuscle("Cardiovascular")
                            .equipment("Jump Rope")
                            .build(),

                    // CORE & FLEXIBILITY
                    Exercise.builder()
                            .name("Hanging Leg Raise")
                            .description("Hanging from pullup bar and raising knees/feet to parallel engaging core abdominals.")
                            .category(ExerciseCategory.BODYWEIGHT)
                            .targetMuscle("Core")
                            .equipment("Pullup Bar")
                            .build(),
                    Exercise.builder()
                            .name("Dynamic Hamstring & Hip Stretch")
                            .description("Mobility flow routine improving flexibility in hips, hamstrings, and lower back.")
                            .category(ExerciseCategory.FLEXIBILITY)
                            .targetMuscle("Full Body")
                            .equipment("Mat")
                            .build()
            );

            exerciseRepository.saveAll(exercises);
            logger.info("Successfully seeded {} initial exercises!", exercises.size());
        } else {
            logger.info("Database already contains exercises. Skipping seeder.");
        }
    }
}
