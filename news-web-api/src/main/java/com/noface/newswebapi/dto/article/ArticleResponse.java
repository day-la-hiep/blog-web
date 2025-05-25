package com.noface.newswebapi.dto.article;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ArticleResponse {
    String id;
    String title;
    String name;
    String summary;
    String content;
    LocalDateTime dateCreated;
    LocalDateTime lastUpdated;
    LocalDateTime publishedDate;
    String author;
    String authorUsername;
    String status;
    String approvedStatus;

    String thumbnailUrl;
    Set<String> categoryIds;
}
