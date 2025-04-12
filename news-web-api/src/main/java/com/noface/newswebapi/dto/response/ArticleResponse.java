package com.noface.newswebapi.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.noface.newswebapi.entity.Article;
import com.noface.newswebapi.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.mapstruct.Mapper;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
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
