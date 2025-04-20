package com.noface.newswebapi.dto.request.article;

import com.noface.newswebapi.dto.request.CategoryRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.mapstruct.Mapper;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;
@Mapper
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ArticleCreateRequest {
    private String title;
    private String summary;
    private String content;
    private String status;
    private Set<CategoryRequest> categories;
    private String thumbnailUrl;
}
