package com.noface.newswebapi.dto.mapper;

import com.noface.newswebapi.dto.savedList.SavedListRequest;
import com.noface.newswebapi.dto.savedList.SavedListResponse;
import com.noface.newswebapi.entity.SavedList;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")

public interface SavedListMapper {

    @Mapping(target = "authorUsername", source = "author.username")
    @Mapping(target = "articleIds", source = ".", qualifiedByName = "toArticleIds")
    public SavedListResponse toSavedListResponse(SavedList savedList);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateSavedList(@MappingTarget SavedList savedList, SavedListRequest savedListRequest);

    SavedList asSavedList(SavedListRequest savedListRequest);

    @Named("toArticleIds")
    default List<String> toArticleIds(SavedList savedList) {
        return savedList.getSavedArticles().stream()
                .map(savedArticle -> savedArticle.getArticle().getId())
                .toList();
    }
}
