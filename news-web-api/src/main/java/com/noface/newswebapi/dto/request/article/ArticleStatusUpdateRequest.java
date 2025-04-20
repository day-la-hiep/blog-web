package com.noface.newswebapi.dto.request.article;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.mapstruct.Mapper;

@Mapper
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ArticleStatusUpdateRequest {
    String status;
}
