package com.noface.newswebapi.mapper;

import com.noface.newswebapi.dto.ArticleOverview;
import com.noface.newswebapi.dto.request.article.ArticleCreateRequest;
import com.noface.newswebapi.dto.request.article.ArticleRequest;
import com.noface.newswebapi.dto.request.article.ArticleUpdateRequest;
import com.noface.newswebapi.dto.response.article.ArticleOverviewResponse;
import com.noface.newswebapi.dto.response.article.ArticleResponse;
import com.noface.newswebapi.entity.Article;
import org.mapstruct.*;

@Mapper(componentModel = "spring")

public interface ArticleMapper {
    @Mapping(target = "id", ignore = true)
    public Article asArticle(ArticleRequest request);
    
    public Article asArticle(ArticleUpdateRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public void updateArticle(@MappingTarget Article article, Article articleUpdate);


    @Mapping(target = "author", source = "author.fullname")
    public ArticleResponse toArticleResponse(Article article);

    @Mapping(target = "author", source = "author.fullname")
    ArticleOverviewResponse toArticleOverviewResponse(Article article);

    Article asArticle(ArticleCreateRequest request);

    ArticleOverviewResponse toArticleOverviewResponse(ArticleOverview articleOverview);
}
