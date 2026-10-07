package com.gopi.workoutTracker.controller;

import com.gopi.workoutTracker.dto.AuthResponse;
import com.gopi.workoutTracker.dto.LoginRequest;
import com.gopi.workoutTracker.dto.SignUpRequest;
import com.gopi.workoutTracker.dto.UserDto;
import com.gopi.workoutTracker.security.UserPrincipal;
import com.gopi.workoutTracker.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "User Authentication", description = "Endpoints for user registration, login, and profile info")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user account", description = "Creates a new user account and returns a JWT access token.")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        AuthResponse response = authService.registerUser(signUpRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Log in an existing user", description = "Authenticates user credentials and returns a JWT access token.")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse response = authService.loginUser(loginRequest);
            return ResponseEntity.ok(response);
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile", description = "Returns profile details of the authenticated user.")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserDto userDto = authService.getCurrentUser(currentUser);
        return ResponseEntity.ok(userDto);
    }
}
