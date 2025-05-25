package com.noface.newswebapi.dto.category;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryResponse {
    String id;
    String slug;
    String name;
    String description;
    String parentId;
    String parentName;
    String parentSlug;
    Boolean active;
    LocalDateTime createdAt;
}
