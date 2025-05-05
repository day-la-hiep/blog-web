package com.noface.newswebapi.dto.article;

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
public class ArticleDuplicateRequest {
    String name;
}
