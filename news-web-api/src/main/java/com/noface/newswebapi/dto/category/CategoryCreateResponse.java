package com.noface.newswebapi.dto.category;

import lombok.*;
import lombok.experimental.FieldDefaults;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryCreateResponse {
    String id;
    String slug;
    String name;
    String description;
    String parentId;
    Boolean active;
}
