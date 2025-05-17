package com.group.silent_santa.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;


@Service
public class CaptchaService {

    @Value("${google.recaptcha.secret}")
    private String recaptchaSecret;

    private static final String RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    @PostConstruct
    public void init() {
        // Log to verify the secret is loaded correctly
        System.out.println("reCAPTCHA secret loaded: " + (recaptchaSecret != null && !recaptchaSecret.isEmpty()));

        // Check if the secret is actually the placeholder from properties
        if ("${google.recaptcha.secret}".equals(recaptchaSecret)) {
            System.err.println("ERROR: reCAPTCHA secret not properly resolved from properties!");
        }
    }

    public boolean validateCaptcha(String captchaResponse) {
        if (captchaResponse == null || captchaResponse.isEmpty()) {
            System.out.println("Empty captcha response received");
            return false;
        }

        // Debug log
        System.out.println("Validating captcha token: " + captchaResponse.substring(0, Math.min(10, captchaResponse.length())) + "...");

        // Check if secret is available
        if (recaptchaSecret == null || recaptchaSecret.isEmpty()) {
            System.err.println("reCAPTCHA secret is not configured!");
            return false;
        }

        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String, String> requestMap = new LinkedMultiValueMap<>();
        requestMap.add("secret", recaptchaSecret);
        requestMap.add("response", captchaResponse);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    RECAPTCHA_VERIFY_URL,
                    requestMap,
                    String.class
            );

            // Debug log
            System.out.println("reCAPTCHA API response: " + response.getBody());

            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(response.getBody());

            boolean success = jsonNode.get("success").asBoolean();

            // Log validation result
            if (!success && jsonNode.has("error-codes")) {
                System.err.println("reCAPTCHA validation failed with errors: " + jsonNode.get("error-codes").toString());
            }

            return success;
        } catch (Exception e) {
            System.err.println("Error validating reCAPTCHA: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
