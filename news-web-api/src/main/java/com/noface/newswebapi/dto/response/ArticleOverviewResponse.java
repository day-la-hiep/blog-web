package com.noface.newswebapi.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
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
