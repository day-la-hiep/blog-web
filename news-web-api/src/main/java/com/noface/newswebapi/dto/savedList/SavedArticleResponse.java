package com.noface.newswebapi.dto.savedList;

import com.noface.newswebapi.dto.article.ArticleOverviewResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SavedArticleResponse {
    String id;
    String articleId;
    String savedListId;
    ArticleOverviewResponse articleOverviewResponse;
}
