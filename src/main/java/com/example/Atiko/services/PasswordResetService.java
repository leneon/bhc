package com.example.Atiko.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Atiko.entities.User;
import com.example.Atiko.repositories.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Génère un token et envoie un email de réinitialisation
    @Transactional
    public void initiatePasswordReset(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String resetToken = UUID.randomUUID().toString();
            user.setResetToken(resetToken);
            userRepository.save(user);

            String resetLink = "http://localhost:8080/api/auth/reset-password?token=" + resetToken;
            emailService.sendEmail(email, "Réinitialisation de votre mot de passe", 
                                   "Cliquez sur le lien pour réinitialiser votre mot de passe : " + resetLink);
        } else {
            throw new IllegalArgumentException("Aucun utilisateur trouvé avec cet email.");
        }
    }

    // Réinitialise le mot de passe si le token est valide
    @Transactional
    public void resetPassword(String token, String newPassword) {
        Optional<User> userOptional = userRepository.findByResetToken(token);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetToken(null);  // Supprime le token après réinitialisation
            userRepository.save(user);
        } else {
            throw new IllegalArgumentException("Token de réinitialisation invalide ou expiré.");
        }
    }
}
