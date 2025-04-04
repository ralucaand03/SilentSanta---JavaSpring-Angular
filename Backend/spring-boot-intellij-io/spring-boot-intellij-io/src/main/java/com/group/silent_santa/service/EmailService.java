package com.group.silent_santa.service;

import com.group.silent_santa.model.SubscriberModel;
import com.group.silent_santa.repository.SubscriberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final SubscriberRepository subscriberRepository;

    @Autowired
    public EmailService(JavaMailSender mailSender, SubscriberRepository subscriberRepository) {
        this.mailSender = mailSender;
        this.subscriberRepository = subscriberRepository;
    }

    public void sendNewLetterNotification(String letterTitle, String childName, int childAge) {
        List<SubscriberModel> subscribers = subscriberRepository.findAll();

        for (SubscriberModel subscriber : subscribers) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("silent.santa25@gmail.com");
            message.setTo(subscriber.getEmail());
            message.setSubject("New Letter Added - Silent Santa");
            message.setText(
                    "Dear Subscriber,\n\n" +
                            "A new letter has been added to Silent Santa!\n\n" +
                            "Child's Name: " + childName + "\n" +
                            "Child's Age: " + childAge + "\n\n" +
                            "Letter: " +
                            "Visit our website to read the letter and consider fulfilling this child's Christmas wish.\n\n" +
                            "Thank you for being part of our community!\n\n" +
                            "Warm regards,\n" +
                            "The Silent Santa Team"
            );

            mailSender.send(message);
        }
    }
}

