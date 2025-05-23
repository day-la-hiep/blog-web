package com.noface.newswebapi.config;

import com.noface.newswebapi.cons.UserRole;
import com.noface.newswebapi.entity.User;
import com.noface.newswebapi.repository.UserRepository;
import com.noface.newswebapi.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Slf4j
public class ApplicationInit {
    @Autowired
    UserService userService;

    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    UserRepository userRepository;

    @Bean
    ApplicationRunner init() {
        ApplicationRunner runner = args -> {

            if (userService.userExisted("admin") == false) {
                User user = User.builder().username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .firstName("admin")
                        .lastName("admin")

                        .build();
                user.setUserRole(UserRole.ADMIN.name());
                userRepository.save(user);
            }

        };
        return runner;
    }

}
