package com.github.rodrigokuerten.finance_dashboard.controller;

import com.github.rodrigokuerten.finance_dashboard.service.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return authenticationService.login(request);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        return authenticationService.register(request);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgetPassword(@RequestBody AuthRequest request) {
        return authenticationService.forgotPassword(request);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        return authenticationService.resetPassword(request.token(), request.newPassword());
    }

    public record AuthRequest(String email, String password, String fullName, String address, String phoneNumber, String frontendUrl) {
        public static AuthRequest login(String email, String password) {
            return new AuthRequest(email, password, null, null, null, null);
        }

        public static AuthRequest register(String email, String password, String fullName, String address, String phoneNumber) {
            return new AuthRequest(email, password, fullName, address, phoneNumber, null);
        }

        public static AuthRequest forgotPassword(String email, String frontendUrl) {
            return new AuthRequest(email, null, null, null, null, frontendUrl);
        }
    }

    public record AuthResponse(String message) {}

    public record ResetPasswordRequest(String token, String newPassword) {}
}
