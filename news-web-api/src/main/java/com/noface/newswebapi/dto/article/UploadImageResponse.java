package com.noface.newswebapi.dto.article;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UploadImageResponse {
    boolean success;
    String url;

}
