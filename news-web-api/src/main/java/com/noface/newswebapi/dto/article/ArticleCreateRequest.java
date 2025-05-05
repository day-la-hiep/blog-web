package com.noface.newswebapi.dto.article;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.mapstruct.Mapper;

import java.util.HashSet;
import java.util.Set;
@Mapper
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ArticleCreateRequest {
    String name;
    private String title;
    private String summary;
    private String content;
    private Set<String> categoryIds = new HashSet<>();
}
