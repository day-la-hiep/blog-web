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
public class PublicArticleResponse {
    String id;
    String name;
    String publicTitle;
    String publicContent;
    String publicSummary;
    LocalDateTime dateCreated;
    LocalDateTime lastUpdated;
    String author;
    String status;
    String thumbnailUrl;
    Set<String> categoryIds;
}
