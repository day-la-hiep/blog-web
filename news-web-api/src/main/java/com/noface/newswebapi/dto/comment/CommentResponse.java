package com.noface.newswebapi.dto.comment;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentResponse {
    String id;
    String content;
    String articleId;
    String articleTitle;
    String authorUsername;
    String author;
    LocalDateTime createdAt;
}
