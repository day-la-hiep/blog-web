package com.noface.newswebapi.dto.request;

import com.noface.newswebapi.entity.Comment;
import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentRequest {
    String content;
    String parentArticleId;
}
