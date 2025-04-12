package com.noface.newswebapi.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Data
public class ArticleCreateRequest {
    private String article;
    private MultipartFile thumbnail;
}
