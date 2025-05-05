package com.noface.newswebapi.dto.comment;

import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentRequest {
    String content;
}
