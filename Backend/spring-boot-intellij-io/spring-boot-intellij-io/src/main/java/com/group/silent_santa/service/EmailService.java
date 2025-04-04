package com.group.silent_santa.service;

import com.group.silent_santa.model.SubscriberModel;
import com.group.silent_santa.repository.SubscriberRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final SubscriberRepository subscriberRepository;
    private final String emailTemplate;

    @Autowired
    public EmailService(JavaMailSender mailSender, SubscriberRepository subscriberRepository) {
        this.mailSender = mailSender;
        this.subscriberRepository = subscriberRepository;

        // Load the email template when the service is initialized
        String template = "";
        try {
            // You can adjust this path based on your project structure
            // or consider using ClassPathResource for more reliable loading
            template = new String(Files.readAllBytes(Paths.get(
                    getClass().getClassLoader().getResource("templates/Email-New-Letter.html").toURI())));
        } catch (Exception e) {
            e.printStackTrace();
            template = getDefaultEmailTemplate();
        }
        this.emailTemplate = template;
    }

    public void sendNewLetterNotification(String letterTitle, String childName, int childAge, String childGender, List<String> wishList) {
        List<SubscriberModel> subscribers = subscriberRepository.findAll();

        for (SubscriberModel subscriber : subscribers) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true);

                helper.setFrom("silent.santa25@gmail.com");
                helper.setTo(subscriber.getEmail());
                helper.setSubject("New Letter Added - Silent Santa");

                // Format the wish list as a bulleted list
                String formattedWishList = formatWishList(wishList);

                // Populate the email template
                String emailContent = populateEmailTemplate(childName, childAge, childGender, formattedWishList, subscriber.getId());

                // Set the HTML content
                helper.setText(emailContent, true);

                mailSender.send(message);
            } catch (MessagingException e) {
                e.printStackTrace();
                // Consider logging this error or implementing a retry mechanism
            }
        }
    }

    private String formatWishList(List<String> wishList) {
        if (wishList == null || wishList.isEmpty()) {
            return "No items in wish list";
        }

        // Format the wish list as HTML bullet points
        return wishList.stream()
                .map(item -> "• " + item)
                .collect(Collectors.joining("<br>"));
    }

    private String populateEmailTemplate(String childName, int childAge, String location, String wishList, UUID subscriberId) {
        // Replace placeholders with actual data
        return emailTemplate
                .replace("{{childName}}", childName)
                .replace("{{childAge}}", String.valueOf(childAge))
                .replace("{{location}}", location)
                .replace("{{wishList}}", wishList);
//                .replace("{{unsubscribeLink}}", "http://localhost:4200/unsubscribe?id=" + subscriberId);
    }

    private String getDefaultEmailTemplate() {
        // Fallback template in case the file can't be loaded
        return "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <title>⭐ Silent Santa</title>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <h1>⭐ Silent Santa</h1>\n" +
                "    <p>Dear Subscriber,</p>\n" +
                "    <p>We are excited to inform you that a new letter has been added to Silent Santa! 🎅</p>\n" +

                "    <p>Visit our website to read the letter and consider fulfilling this child's Christmas wish.</p>\n" +
                "    <p>Warm regards,<br>The Silent Santa Team</p>\n" +
                "    <a href=\"{{unsubscribeLink}}\">Unsubscribe</a>\n" +
                "</body>\n" +
                "</html>";
    }
}

