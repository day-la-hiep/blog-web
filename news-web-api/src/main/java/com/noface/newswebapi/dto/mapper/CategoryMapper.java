package com.noface.newswebapi.dto.mapper;

import com.noface.newswebapi.dto.category.*;
import com.noface.newswebapi.entity.Category;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CategoryMapper {


    Category asCategory(CategoryCreateRequest request);
    CategoryCreateResponse toCategoryCreateResponse(Category category);
    CategoryUpdateResponse toCategoryUpdateResponse(Category category);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateCategory(@MappingTarget Category category, CategoryUpdateRequest request);

    @Mapping(target = "parentId", source = "parentCategory.id")
    @Mapping(target = "parentName", source = "parentCategory.name")
    @Mapping(target = "parentSlug", source = "parentCategory.slug")
    CategoryResponse toCategoryResponse(Category category);
}
