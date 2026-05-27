package com.github.rodrigokuerten.finance_dashboard.service;

import com.github.rodrigokuerten.finance_dashboard.controller.AuthenticationController.AuthRequest;
import com.github.rodrigokuerten.finance_dashboard.controller.AuthenticationController.AuthResponse;
import com.github.rodrigokuerten.finance_dashboard.entity.User;
import com.github.rodrigokuerten.finance_dashboard.entity.UserDetail;
import com.github.rodrigokuerten.finance_dashboard.repository.UserDetailRepository;
import com.github.rodrigokuerten.finance_dashboard.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final UserDetailRepository userDetailRepository;
    private final HashPasswordService hashPasswordService;
    private final SendEmailService sendEmailService;

    public AuthenticationService(UserRepository userRepository, UserDetailRepository userDetailRepository, HashPasswordService hashPasswordService, SendEmailService sendEmailService) {
        this.userRepository = userRepository;
        this.userDetailRepository = userDetailRepository;
        this.hashPasswordService = hashPasswordService;
        this.sendEmailService = sendEmailService;
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

        return ResponseEntity.ok(new AuthResponse("Login realizado com sucesso!"));
    }

    public ResponseEntity<AuthResponse> register(AuthRequest request) {
        if (request.email() == null || request.password() == null || request.fullName() == null || request.address() == null || request.phoneNumber() == null) {
            return ResponseEntity.badRequest().body(new AuthResponse("Preencha todos os campos obrigatórios."));
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
            user.setResetToken(token);
            user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
            userRepository.save(user);

            String resetLink = request.frontendUrl() + "/auth/reset-password?token=" + token;
            sendEmailService.sendEmail(
                request.email(),
                "Recuperação de senha - Finance Dashboard",
                "Clique no link abaixo para redefinir sua senha:\n\n" + resetLink + "\n\nO link expira em 1 hora.\n\nSe você não solicitou a recuperação, ignore este email."
            );
        }

        return ResponseEntity.ok(new AuthResponse("Se o email existir em nossa base, você receberá um link de recuperação"));
    }

    public ResponseEntity<AuthResponse> resetPassword(String token, String newPassword) {
        if (token == null || newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body(new AuthResponse("Token e nova senha são obrigatórios"));
        }

        Optional<User> userOpt = userRepository.findByResetToken(token);
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
}