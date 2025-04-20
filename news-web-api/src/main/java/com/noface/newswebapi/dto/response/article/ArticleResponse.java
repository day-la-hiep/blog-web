package com.noface.newswebapi.dto.response.article;

import com.noface.newswebapi.dto.response.CategoryResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ArticleResponse {
    String id;
    String title;
    String summary;
    String content;
    LocalDateTime dateCreated;
    LocalDateTime lastUpdated;
    String author;
    String moderator;
    LocalDateTime datePublished;
    String status;
    String thumbnailUrl;

    List<CategoryResponse> categories;

}
