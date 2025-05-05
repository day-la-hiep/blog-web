package com.noface.newswebapi.dto.article;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.mapstruct.Mapper;

import java.util.Set;

@Mapper
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ArticleRequest {
    private String title;
    private String name;
    private String summary;
    private String content;
    private String status;
    private Set<String> categoryIds;
    private String thumbNailUrl;
}
