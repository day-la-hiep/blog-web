package com.noface.newswebapi.config;

import com.cloudinary.Cloudinary;
import com.mysql.cj.x.protobuf.MysqlxDatatypes;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {
    @Value(value = "${cloudinary.CLOUDINARY_URL}")
    private String cloudinaryUrl;
    @Bean
    Cloudinary cloudinary() {
        return new Cloudinary(cloudinaryUrl);
    }
}
