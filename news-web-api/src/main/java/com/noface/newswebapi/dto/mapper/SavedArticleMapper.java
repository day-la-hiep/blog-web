package com.noface.newswebapi.dto.mapper;

import com.noface.newswebapi.dto.savedList.SavedArticleResponse;
import com.noface.newswebapi.entity.SavedArticle;
import org.mapstruct.Mapper;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public interface SavedArticleMapper {
    @Autowired
    ArticleMapper articleMapper = Mappers.getMapper(ArticleMapper.class);


    @Named("toResponse")
    default SavedArticleResponse toSavedArticleReponse(SavedArticle savedArticle) {
        SavedArticleResponse savedArticleResponseResponse =
                SavedArticleResponse.builder()
                        .id(savedArticle.getId())
                        .articleId(savedArticle.getArticle().getId())
                        .savedListId(savedArticle.getSavedList().getId())
                        .articleOverviewResponse(
                                articleMapper.toArticleOverviewResponse(savedArticle.getArticle()))
                        .build();
        return savedArticleResponseResponse;
    }
}
