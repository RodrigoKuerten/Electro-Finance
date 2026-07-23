package com.github.rodrigokuerten.finance_dashboard.dto;

import com.github.rodrigokuerten.finance_dashboard.enums.RoleEnum;

public record UserProfileResponse(Long id, String email, String fullName, RoleEnum role) {
}
