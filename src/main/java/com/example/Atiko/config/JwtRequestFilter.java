// package com.example.Atiko.config;

// import io.jsonwebtoken.ExpiredJwtException;
// import io.jsonwebtoken.JwtException;
// import io.jsonwebtoken.Jwts;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
// import org.springframework.web.filter.OncePerRequestFilter;

// import com.example.Atiko.security.jwt.JwtUtils;
// import com.example.Atiko.security.services.UserDetailsServiceImpl;

// import javax.servlet.FilterChain;
// import javax.servlet.ServletException;
// import javax.servlet.ServletRequest;
// import javax.servlet.http.HttpServletRequest;
// import javax.servlet.http.HttpServletResponse;
// import java.io.IOException;

// public class JwtRequestFilter extends OncePerRequestFilter {

//     @Autowired
//     private JwtUtils jwtUtil; // Votre classe utilitaire pour gérer le JWT

//     @Autowired
//     private UserDetailsServiceImpl userDetailsService; // Service pour charger les détails de l'utilisateur

//     @Override
//     protected void doFilterInternal(javax.servlet.http.HttpServletRequest request, HttpServletResponse response, FilterChain chain)
//             throws ServletException, IOException {
        
//         final String authorizationHeader = request.getHeader("Authorization");

//         String username = null;
//         String jwt = null;

//         // Vérifier si l'en-tête contient le token
//         if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
//             jwt = authorizationHeader.substring(7);
//             try {
//                 username = jwtUtil.getUserNameFromJwtToken(jwt);
//             } catch (ExpiredJwtException e) {
//                 // Gérer le cas où le token a expiré
//                 logger.warn("Token expired: " + e.getMessage());
//             } catch (JwtException e) {
//                 // Gérer les exceptions liées au JWT
//                 logger.warn("Invalid token: " + e.getMessage());
//             }
//         }

//         // Si un nom d'utilisateur est trouvé, configurez le contexte de sécurité
//         if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//             UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
//             if (jwtUtil.validateJwtToken(jwt)) {
//                 UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
//                         new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
//                 usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails((jakarta.servlet.http.HttpServletRequest) request));
//                 SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
//             }
//         }
        
//         chain.doFilter(request, response);
//     }
// }
 