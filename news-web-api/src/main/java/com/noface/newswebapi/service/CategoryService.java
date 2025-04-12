package com.noface.newswebapi.service;

import com.noface.newswebapi.dto.response.CategoryResponse;
import com.noface.newswebapi.entity.Category;
import com.noface.newswebapi.exception.AppException;
import com.noface.newswebapi.exception.ErrorCode;
import com.noface.newswebapi.mapper.CategoryMapper;
import com.noface.newswebapi.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.stream.Stream;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private CategoryMapper categoryMapper;

    public Stream<Category> getCategories() {
        return categoryRepository.getDistinctCategory(Pageable.unpaged()).stream();
    }

    public CategoryResponse deleteCategoryBySlug(String slug) {

        Category category = categoryRepository.getCategoryBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));

        categoryRepository.delete(category);
        return categoryMapper.toCategoryResponse(category);
    }

    public CategoryResponse updateCategory(Category category) {
        CategoryResponse response = categoryMapper.toCategoryResponse(categoryRepository.save(category));
        return response;
    }

    public CategoryResponse createCategory(Category category) {
        CategoryResponse response = categoryMapper.toCategoryResponse(categoryRepository.save(category));
        return response;
    }

    public boolean isCategoryExist(String slug) {
        return categoryRepository.getCategoryBySlug(slug).isPresent();
    }



}
