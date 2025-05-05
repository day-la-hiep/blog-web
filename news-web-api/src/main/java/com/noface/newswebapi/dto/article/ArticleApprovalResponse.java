package com.noface.newswebapi.dto.article;

import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ArticleApprovalResponse {
    String id;
    String name;
    String title;
    String status;
    String approvedStatus;

}
