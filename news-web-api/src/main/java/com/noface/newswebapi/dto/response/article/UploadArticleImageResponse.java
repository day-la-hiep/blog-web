package com.noface.newswebapi.dto.response.article;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UploadArticleImageResponse {
    boolean success;
    String url;

}
