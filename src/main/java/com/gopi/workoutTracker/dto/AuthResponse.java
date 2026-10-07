package com.gopi.workoutTracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private UserDto user;

    public AuthResponse(String accessToken, UserDto user) {
        this.accessToken = accessToken;
        this.user = user;
    }
}
