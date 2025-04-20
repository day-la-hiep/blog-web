package com.noface.newswebapi.dto.response.article;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ArticleOverviewResponse {
    String id;
    String title;
    String summary;
    LocalDateTime dateCreated;
    LocalDateTime lastUpdated;
    String author;
    LocalDateTime datePublished;
    String status;
    String thumbnailUrl;

}
