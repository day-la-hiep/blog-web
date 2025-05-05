package com.noface.newswebapi.dto.article;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddArticleToSavedListRequest {
    Set<String> articleIds;
}
