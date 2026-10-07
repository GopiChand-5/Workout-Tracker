package com.gopi.workoutTracker;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gopi.workoutTracker.dto.LoginRequest;
import com.gopi.workoutTracker.dto.SignUpRequest;
import com.gopi.workoutTracker.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    public void setUp() {
        userRepository.deleteAll();
    }

    @Test
    public void testUserSignUpAndLoginSuccess() throws Exception {
        SignUpRequest signUpRequest = new SignUpRequest();
        signUpRequest.setUsername("testuser");
        signUpRequest.setEmail("testuser@example.com");
        signUpRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.user.username").value("testuser"));

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail("testuser");
        loginRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andExpect(jsonPath("$.user.email").value("testuser@example.com"));
    }

    @Test
    public void testLoginWithInvalidCredentialsFailure() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail("nonexistent");
        loginRequest.setPassword("wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }
}
