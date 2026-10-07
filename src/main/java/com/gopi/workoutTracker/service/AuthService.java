package com.gopi.workoutTracker.service;

import com.gopi.workoutTracker.dto.AuthResponse;
import com.gopi.workoutTracker.dto.LoginRequest;
import com.gopi.workoutTracker.dto.SignUpRequest;
import com.gopi.workoutTracker.dto.UserDto;
import com.gopi.workoutTracker.model.Role;
import com.gopi.workoutTracker.model.User;
import com.gopi.workoutTracker.repository.UserRepository;
import com.gopi.workoutTracker.security.JwtTokenProvider;
import com.gopi.workoutTracker.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse registerUser(SignUpRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new IllegalArgumentException("Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new IllegalArgumentException("Email Address is already in use!");
        }

        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(passwordEncoder.encode(signUpRequest.getPassword()))
                .role(Role.ROLE_USER)
                .build();

        User savedUser = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        signUpRequest.getUsername(),
                        signUpRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return new AuthResponse(jwt, mapToUserDto(savedUser));
    }

    public AuthResponse loginUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new AuthResponse(jwt, mapToUserDto(user));
    }

    public UserDto getCurrentUser(UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserDto(user);
    }

    public UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
