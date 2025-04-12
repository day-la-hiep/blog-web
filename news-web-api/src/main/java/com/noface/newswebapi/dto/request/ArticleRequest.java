package com.noface.newswebapi.dto.request;

import com.noface.newswebapi.entity.Article;
import com.noface.newswebapi.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.mapstruct.Mapper;

import java.time.LocalDate;
import java.util.Set;

@Mapper
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ArticleRequest {
    private String title;
    private String summary;
    private String content;
    private String status;
    private Set<CategoryRequest> categories;
    private String thumbNailUrl;
}
