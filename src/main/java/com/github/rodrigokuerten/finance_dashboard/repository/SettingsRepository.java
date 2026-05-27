package com.github.rodrigokuerten.finance_dashboard.repository;

import com.github.rodrigokuerten.finance_dashboard.entity.Settings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SettingsRepository extends JpaRepository<Settings, Long> {
    @Query("SELECT s FROM Settings s WHERE s.paramKey = :key")
    Optional<Settings> findByKey(@Param("key") String key);
}

