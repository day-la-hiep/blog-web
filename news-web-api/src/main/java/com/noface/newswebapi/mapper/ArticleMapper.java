package com.noface.newswebapi.mapper;

import com.noface.newswebapi.dto.request.ArticleCreateRequest;
import com.noface.newswebapi.dto.request.ArticleRequest;
import com.noface.newswebapi.dto.response.ArticleOverviewResponse;
import com.noface.newswebapi.dto.response.ArticleResponse;
import com.noface.newswebapi.entity.Article;
import org.mapstruct.*;

@Mapper(componentModel = "spring")

public interface ArticleMapper {
    @Mapping(target = "id", ignore = true)
    public Article asArticle(ArticleRequest request);


    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public void updateArticle(@MappingTarget Article article, Article articleUpdate);


    @Mapping(target = "author", source = "author.fullname")
    @Mapping(target = "moderator", source = "moderator.username")
    public ArticleResponse toArticleResponse(Article article);

    @Mapping(target = "author", source = "author.fullname")
//    @Mapping(target = "moderator", source = "moderator.username")
    ArticleOverviewResponse toArticleOverviewResponse(Article article);
}
