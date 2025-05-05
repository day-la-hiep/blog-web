package com.noface.newswebapi.service;

import com.noface.newswebapi.dto.PagedResult;
import com.noface.newswebapi.dto.category.*;
import com.noface.newswebapi.entity.Category;
import com.noface.newswebapi.exception.AppException;
import com.noface.newswebapi.exception.ErrorCode;
import com.noface.newswebapi.dto.mapper.CategoryMapper;
import com.noface.newswebapi.repository.CategoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private CategoryMapper categoryMapper;

    public CategoryCreateResponse createCategory(CategoryCreateRequest request) {
        Category parentCategory =
                request.getParentId() == null ?
                        null :
                        categoryRepository.getCategoryById(request.getParentId())
                                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        if(parentCategory != null && parentCategory.getParentCategory() != null){
            throw new AppException(ErrorCode.INVALID_CATEGORY_PARENT);
        }
        Category category = categoryMapper.asCategory(request);
        category.setParentCategory(parentCategory);
        category.setCreatedAt(LocalDateTime.now());
        category.setUpdatedAt(LocalDateTime.now());
        categoryRepository.save(category);
        CategoryCreateResponse response = categoryMapper.toCategoryCreateResponse(category);
        response.setParentId(parentCategory == null ? null : parentCategory.getId());

        return response;
    }

    public CategoryUpdateResponse updateCategory(String id, CategoryUpdateRequest request) {
        Category category = categoryRepository.getCategoryById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));

        categoryMapper.updateCategory(category, request);
        Category parentCategory =
                request.getParentId() == null ?
                        null :
                        categoryRepository.getCategoryById(request.getParentId())
                                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));

        if(parentCategory != null && parentCategory.equals(category)){
            throw new AppException(ErrorCode.IDENTICAL_PARENT_CATEGORY);
        }
        if(parentCategory != null && parentCategory.getParentCategory() != null){
            throw new AppException(ErrorCode.INVALID_CATEGORY_PARENT);
        }
        if(parentCategory != null && parentCategory.getChildrenCategories() != null
            && !category.getChildrenCategories().isEmpty()){
            throw new AppException(ErrorCode.INVALID_CATEGORY_PARENT);
        }
        category.setParentCategory(parentCategory);
        category.setUpdatedAt(LocalDateTime.now());
        CategoryUpdateResponse response = categoryMapper.toCategoryUpdateResponse(category);
        response.setParentId(parentCategory == null ? null : parentCategory.getId());
        categoryRepository.save(category);
        return response;
    }

    @Transactional
    public CategoryDeleteResponse deleteCategory(String id) {
        categoryRepository.detachChildren(id);
        Category category = categoryRepository.getCategoryById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        categoryRepository.delete(category);
        return CategoryDeleteResponse.builder()
                .id(category.getId())
                .deleted(true)
                .build();
    }

    public PagedResult<CategoryResponse> getCategoriesBy(String search, Boolean active, String parentId, Pageable pageable) {
        Page<CategoryResponse> categories = categoryRepository.findCategoriesByFilter(search, active, parentId, pageable)
                .map(categoryMapper::toCategoryResponse);
        return new PagedResult<>(categories);
    }

    public CategoryResponse getCategoriesById(String id) {
        return categoryMapper.toCategoryResponse(categoryRepository.getCategoryById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED)));
    }

    public CategoryResponse getPublicCategoriesBySlug(String slug) {
        Category category = categoryRepository.getCategoryBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        if (!category.getActive()) {
            throw new AppException(ErrorCode.CATEGORY_NOT_EXISTED);
        }
        return categoryMapper.toCategoryResponse(category);
    }

    public PagedResult<CategoryResponse> getChildrenCategoriesByParentSlug(Boolean active, String search, String slug, Pageable pageable) {
        Category category = categoryRepository.getBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        return getChildrenCategoriesByParentId(active, search, category.getId(), pageable);
    }

    public PagedResult<CategoryResponse> getChildrenCategoriesByParentId(Boolean active, String search, String parentId, Pageable pageable) {
        Page<CategoryResponse> categories = categoryRepository.findCategoriesByFilter(search, active, parentId, pageable)
                .map(categoryMapper::toCategoryResponse);
        return new PagedResult<>(categories);
    }
}
