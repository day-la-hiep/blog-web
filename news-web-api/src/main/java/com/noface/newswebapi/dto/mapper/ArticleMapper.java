package com.noface.newswebapi.dto.mapper;

import com.noface.newswebapi.dto.article.*;
import com.noface.newswebapi.entity.Article;
import com.noface.newswebapi.entity.ArticleCategory;
import com.noface.newswebapi.entity.User;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")

public interface ArticleMapper {
    @Autowired
    UserMapper userMapper = Mappers.getMapper(UserMapper.class);


    Article asArticle(ArticleCreateRequest request);

    @Mapping(target = "author", source = "author", qualifiedByName = "toFullName")
    @Mapping(target = "categoryIds", source = "articleCategories", qualifiedByName = "toCategoryIds")
    public ArticleResponse toArticleResponse(Article article);


    public Article asArticle(ArticleUpdateRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public void updateArticle(@MappingTarget Article article, Article articleUpdate);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)

    @Mapping(target = "articleCategories", ignore = true)
    public void updateArticle(@MappingTarget Article article, ArticleUpdateRequest articleUpdate);



    @Mapping(target = "author", source = "author", qualifiedByName = "toFullName")
    @Mapping(target = "categories", source = ".", qualifiedByName = "toCategoryName")
    ArticleOverviewResponse toArticleOverviewResponse(Article article);

    @Named("toCategoryName")
    default List<String> toCategoryName(Article article){
        List<String> categoryNames = new ArrayList<>();
        for(ArticleCategory articleCategory : article.getArticleCategories()){
            categoryNames.add(articleCategory.getCategory().getName());
        }
        return categoryNames;
    }

    ArticleOverviewResponse toArticleOverviewResponse(ArticleOverview articleOverview);

    @Mapping(source = "author", target = "authorFullName", qualifiedByName = "toFullName")
    PublicArticleOverViewResponse toPublicArticleOverViewResponse(Article article);
    @Named("toFullName")
    default String toFullName(User user){
        return userMapper.toFullName(user);
    }

    @Named("toCategoryIds")
    default Set<String> toCategoryIds(Set<ArticleCategory> articleCategories){
        Set<String> categoryIds = new HashSet<>();
        for(ArticleCategory articleCategory : articleCategories){
            categoryIds.add(articleCategory.getCategory().getId());
        }
        return categoryIds;
    }

}
