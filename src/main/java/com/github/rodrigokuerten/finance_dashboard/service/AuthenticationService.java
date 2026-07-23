package com.github.rodrigokuerten.finance_dashboard.service;

import com.github.rodrigokuerten.finance_dashboard.controller.AuthenticationController.AuthRequest;
import com.github.rodrigokuerten.finance_dashboard.controller.AuthenticationController.AuthResponse;
import com.github.rodrigokuerten.finance_dashboard.entity.RevokedToken;
import com.github.rodrigokuerten.finance_dashboard.entity.User;
import com.github.rodrigokuerten.finance_dashboard.entity.UserDetail;
import com.github.rodrigokuerten.finance_dashboard.repository.RevokedTokenRepository;
import com.github.rodrigokuerten.finance_dashboard.repository.UserDetailRepository;
import com.github.rodrigokuerten.finance_dashboard.repository.UserRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HexFormat;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final UserDetailRepository userDetailRepository;
    private final HashPasswordService hashPasswordService;
    private final SendEmailService sendEmailService;
    private final EmailTemplateService emailTemplateService;
    private final JwtService jwtService;
    private final RevokedTokenRepository revokedTokenRepository;

    public AuthenticationService(UserRepository userRepository, UserDetailRepository userDetailRepository, HashPasswordService hashPasswordService, SendEmailService sendEmailService, EmailTemplateService emailTemplateService, JwtService jwtService, RevokedTokenRepository revokedTokenRepository) {
        this.userRepository = userRepository;
        this.userDetailRepository = userDetailRepository;
        this.hashPasswordService = hashPasswordService;
        this.sendEmailService = sendEmailService;
        this.emailTemplateService = emailTemplateService;
        this.jwtService = jwtService;
        this.revokedTokenRepository = revokedTokenRepository;
    }

    public ResponseEntity<AuthResponse> login(AuthRequest request) {

        if (request.email() == null || request.password() == null) {
            return ResponseEntity.badRequest().body(new AuthResponse("Email ou senha inválidos."));
        }

        Optional<User> user = userRepository.findByEmail(request.email());

        if (user.isEmpty()) {
            return ResponseEntity.status(404).body(new AuthResponse("Não existe uma conta registrada nesse e-mail!"));
        }

        if (!hashPasswordService.matches(request.password(), user.get().getPassword())) {
            return ResponseEntity.status(401).body(new AuthResponse("Senha incorreta."));
        }

        String token = jwtService.generateToken(user.get());
        ResponseCookie cookie = jwtService.buildAuthCookie(token);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthResponse("Login realizado com sucesso!"));
    }

    public ResponseEntity<AuthResponse> logout(HttpServletRequest request) {
        String token = jwtService.extractToken(request);

        if (token != null && jwtService.isValid(token)) {
            Claims claims = jwtService.parseClaims(token);
            if (claims.getId() != null) {
                RevokedToken revoked = new RevokedToken();
                revoked.setJti(claims.getId());
                revoked.setExpiresAt(claims.getExpiration().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
                revokedTokenRepository.save(revoked);
            }
        }

        ResponseCookie cookie = jwtService.buildLogoutCookie();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthResponse("Logout realizado com sucesso!"));
    }

    public ResponseEntity<AuthResponse> register(AuthRequest request) {
        if (request.email() == null || request.password() == null || request.fullName() == null || request.address() == null || request.phoneNumber() == null) {
            return ResponseEntity.badRequest().body(new AuthResponse("Preencha todos os campos obrigatórios."));
        }
        if (!isStrongPassword(request.password())) {
            return ResponseEntity.badRequest().body(new AuthResponse("A senha deve ter no mínimo 8 caracteres, incluindo letras e números."));
        }
        Optional<User> userAuth = userRepository.findByEmail(request.email());
        if (userAuth.isEmpty()) {
            User user = new User();
            user.setEmail(request.email());
            user.setPassword(hashPasswordService.hash(request.password()));
            user.setFullName(request.fullName());
            userRepository.save(user);
            
            UserDetail userDetail = new UserDetail();
            userDetail.setUser(user);
            userDetail.setAddress(request.address());
            userDetail.setPhoneNumber(request.phoneNumber());
            userDetailRepository.save(userDetail);

            return ResponseEntity.ok(new AuthResponse("Registrado com sucesso!"));
        } else {
            return ResponseEntity.status(409).body(new AuthResponse("Email já existente."));
        }
    }

    public ResponseEntity<AuthResponse> forgotPassword(AuthRequest request) {
        if (request.email() == null) {
            return ResponseEntity.badRequest().body(new AuthResponse("Email é obrigatório"));
        }

        Optional<User> userOpt = userRepository.findByEmail(request.email());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String token = UUID.randomUUID().toString();
            user.setResetToken(hashToken(token));
            user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
            userRepository.save(user);

            String resetLink = request.frontendUrl() + "/auth/reset-password?token=" + token;
            String html = emailTemplateService.render(
                "email.reset-password.template",
                Map.of("resetLink", resetLink, "expiryHours", "1")
            );
            sendEmailService.sendHtmlEmail(request.email(), "Recuperação de senha - Electro Finance", html);
        }

        return ResponseEntity.ok(new AuthResponse("Se o email existir em nossa base, você receberá um link de recuperação"));
    }

    public ResponseEntity<AuthResponse> resetPassword(String token, String newPassword) {
        if (token == null || newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body(new AuthResponse("Token e nova senha são obrigatórios"));
        }
        if (!isStrongPassword(newPassword)) {
            return ResponseEntity.badRequest().body(new AuthResponse("A senha deve ter no mínimo 8 caracteres, incluindo letras e números."));
        }

        Optional<User> userOpt = userRepository.findByResetToken(hashToken(token));
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(400).body(new AuthResponse("Token inválido ou expirado"));
        }

        User user = userOpt.get();
        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(400).body(new AuthResponse("Token expirado"));
        }

        user.setPassword(hashPasswordService.hash(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok(new AuthResponse("Senha redefinida com sucesso! Faça login com sua nova senha."));
    }

    private boolean isStrongPassword(String password) {
        return password.length() >= 8 && password.matches(".*[A-Za-z].*") && password.matches(".*\\d.*");
    }

    private String hashToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}