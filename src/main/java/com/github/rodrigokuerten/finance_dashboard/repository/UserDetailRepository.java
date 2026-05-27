package com.github.rodrigokuerten.finance_dashboard.repository;

import com.github.rodrigokuerten.finance_dashboard.entity.UserDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDetailRepository extends JpaRepository<UserDetail, Long> {
}

