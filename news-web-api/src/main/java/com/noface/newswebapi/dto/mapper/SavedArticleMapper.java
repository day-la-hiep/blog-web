package com.noface.newswebapi.dto.mapper;

import com.noface.newswebapi.dto.response.SavedArticleResponse;
import com.noface.newswebapi.entity.SavedArticle;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SavedArticleMapper {
    public SavedArticleResponse toResponse(SavedArticle savedArticle);
}
