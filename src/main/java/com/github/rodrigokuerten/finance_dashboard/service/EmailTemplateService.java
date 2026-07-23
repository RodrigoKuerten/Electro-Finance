package com.github.rodrigokuerten.finance_dashboard.service;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
public class EmailTemplateService {

    private final SettingsService settings;

    public EmailTemplateService(SettingsService settings) {
        this.settings = settings;
    }

    public String render(String settingsKey, String classpathFallback, Map<String, String> placeholders) {
        String template = settings.getValueOrDefault(settingsKey, loadClasspathTemplate(classpathFallback));

        for (Map.Entry<String, String> entry : placeholders.entrySet()) {
            template = template.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }

        return template;
    }

    private String loadClasspathTemplate(String path) {
        try {
            byte[] bytes = new ClassPathResource(path).getInputStream().readAllBytes();
            return new String(bytes, StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new IllegalStateException("Template de email não encontrado: " + path, e);
        }
    }
}
