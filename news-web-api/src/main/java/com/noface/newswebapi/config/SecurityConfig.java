package com.noface.newswebapi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.spec.SecretKeySpec;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    private String[] postPermittedRequest = {"/api/auth/users", "/api/auth/introspect", "/api/images/upload", "/api/users"};
    private String[] getPermittedRequest = {"/api/articles/*", "/api/articles",
            "/api/articles/*/thumbnail", "/api/articles/*/comments", "/api/articles/*/comments/*",
            "/api/categories", "/api/categories/*", "/api/users/*", "/api/users/*/articles",
            "/api/categories/*/articles"};

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity httpSecurity) throws Exception {
        httpSecurity

                .cors(  withDefaults()) // Bắt buộc phải có dòng này!

                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET, "/api/public/**").permitAll()
                        .requestMatchers(HttpMethod.POST, postPermittedRequest).permitAll()
                        .anyRequest().authenticated()
                )

                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(jwt -> {
                            jwt.decoder(getJwtDecoder())
                            ;
                        })
                )


        ;


        return httpSecurity.build();
    }

    @Value("${jwt.signerKey}")
    private String SIGNER_KEY;

    @Bean
    JwtDecoder getJwtDecoder() {
        SecretKeySpec secretKeySpec = new SecretKeySpec(SIGNER_KEY.getBytes(), "HS512");
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS512).build();
        return jwtDecoder;
    }


}

