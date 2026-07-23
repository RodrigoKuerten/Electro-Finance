package com.github.rodrigokuerten.finance_dashboard.service;

import com.github.rodrigokuerten.finance_dashboard.entity.Settings;
import com.github.rodrigokuerten.finance_dashboard.repository.SettingsRepository;
import org.springframework.stereotype.Service;

@Service
public class SettingsService {

    private final SettingsRepository repository;

    public SettingsService(SettingsRepository repository) {
        this.repository = repository;
    }

    public String getValue(String key) {
        return repository.findByKey(key)
                .map(Settings::getParamValue)
                .orElseThrow(() -> new RuntimeException("Parâmetro não encontrado: " + key));
    }

    public String getValueOrDefault(String key, String defaultValue) {
        return repository.findByKey(key)
                .map(Settings::getParamValue)
                .orElse(defaultValue);
    }
}