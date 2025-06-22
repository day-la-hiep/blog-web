package com.noface.newswebapi.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Cho phép tất cả các đường dẫn và nguồn
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5073")  // Cho phép frontend từ localhost:5073
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Cho phép các phương thức HTTP
                .allowedHeaders("*")  // Cho phép tất cả các headers
                .allowCredentials(true);  // Cho phép gửi thông tin xác thực (cookies, auth headers, etc)
    }
}
