package com.github.rodrigokuerten.finance_dashboard.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "REVOKED_TOKEN")
public class RevokedToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "jti", unique = true, nullable = false)
    private String jti;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;
}
