package com.noface.newswebapi.dto.article;

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
    String name;
    String title;
    String summary;
    LocalDateTime lastUpdated;
    String author;
    String status;
    String approvedStatus;
    String thumbnailUrl;

}
