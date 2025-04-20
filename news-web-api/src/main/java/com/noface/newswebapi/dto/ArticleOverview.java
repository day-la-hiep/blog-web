package com.noface.newswebapi.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ArticleOverview {
    String id;
    String title;
    String summary;
    LocalDateTime dateCreated;
    LocalDateTime lastUpdated;
    String author;
    String status;
    String thumbnailUrl;

}
