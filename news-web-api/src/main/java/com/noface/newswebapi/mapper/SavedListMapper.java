package com.noface.newswebapi.mapper;

import com.noface.newswebapi.dto.request.SavedListRequest;
import com.noface.newswebapi.dto.response.SavedListResponse;
import com.noface.newswebapi.entity.SavedList;
import org.mapstruct.*;

@Mapper(componentModel = "spring")

public interface SavedListMapper {

    @Mapping(target = "authorUsername", source = "author.username")
    public SavedListResponse toSavedListResponse(SavedList savedList);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateSavedList(@MappingTarget SavedList savedList, SavedListRequest savedListRequest);

    SavedList asSavedList(SavedListRequest savedListRequest);
}
