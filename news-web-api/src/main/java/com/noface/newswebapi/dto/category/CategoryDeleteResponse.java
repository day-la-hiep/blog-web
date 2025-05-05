package com.noface.newswebapi.dto.category;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryDeleteResponse {
    String id;
    boolean deleted;
}
