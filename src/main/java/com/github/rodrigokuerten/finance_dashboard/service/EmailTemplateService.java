package com.github.rodrigokuerten.finance_dashboard.service;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class EmailTemplateService {

    private final SettingsService settings;

    public EmailTemplateService(SettingsService settings) {
        this.settings = settings;
    }

    public String render(String settingsKey, Map<String, String> placeholders) {
        String template = settings.getValue(settingsKey);

        for (Map.Entry<String, String> entry : placeholders.entrySet()) {
            template = template.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }

        return template;
    }
}
