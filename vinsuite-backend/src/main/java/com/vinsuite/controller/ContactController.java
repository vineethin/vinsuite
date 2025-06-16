package com.vinsuite.controller;

import com.vinsuite.dto.common.ContactMessageRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin
public class ContactController {

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/send")
    public String sendContactMessage(@RequestBody ContactMessageRequest request) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("vineethin@gmail.com"); 
            message.setSubject("New Contact Form Submission from " + request.getName());
            message.setText("Name: " + request.getName() + "\n"
                    + "Email: " + request.getEmail() + "\n\n"
                    + "Message:\n" + request.getMessage());

            mailSender.send(message);

            return "✅ Message sent successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "❌ Failed to send message: " + e.getMessage();
        }
    }
}
