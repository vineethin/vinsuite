package com.vinsuite.service;

import com.vinsuite.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendActivationEmail(User user) {
        String activationLink = "https://vinsuite360.com/activate?token=" + user.getActivationToken();

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Activate Your VinSuite Account");
        message.setText("Hi " + user.getName() + ",\n\n"
                + "Thanks for registering on VinSuite!\n\n"
                + "Please activate your account by clicking the link below:\n"
                + activationLink + "\n\n"
                + "This link will expire in 24 hours.\n\n"
                + "Regards,\nVinSuite Team");

        mailSender.send(message);
    }
}
