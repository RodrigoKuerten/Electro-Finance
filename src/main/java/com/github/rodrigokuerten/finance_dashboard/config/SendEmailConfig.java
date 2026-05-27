package com.github.rodrigokuerten.finance_dashboard.config;

import com.github.rodrigokuerten.finance_dashboard.entity.Settings;
import com.github.rodrigokuerten.finance_dashboard.repository.SettingsRepository;
import com.github.rodrigokuerten.finance_dashboard.service.SettingsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class SendEmailConfig {

    private final SettingsService settings;

    public SendEmailConfig(SettingsService settings) {
        this.settings = settings;
    }

    @Bean
    public JavaMailSender javaMailSender() {

        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        mailSender.setHost(settings.getValue("spring.mail.host"));
        mailSender.setPort(Integer.parseInt(settings.getValue("spring.mail.port")));
        mailSender.setUsername(settings.getValue("spring.mail.username"));
        mailSender.setPassword(settings.getValue("spring.mail.password"));

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.smtp.auth", settings.getValue("spring.mail.properties.mail.smtp.auth"));
        props.put("mail.smtp.starttls.enable", settings.getValue("spring.mail.properties.mail.smtp.starttls.enable"));

        return mailSender;
    }
}