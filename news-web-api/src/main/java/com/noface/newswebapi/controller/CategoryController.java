package com.noface.newswebapi.controller;

import com.noface.newswebapi.dto.request.CategoryRequest;
import com.noface.newswebapi.dto.response.ApiResponse;
import com.noface.newswebapi.dto.response.CategoryResponse;
import com.noface.newswebapi.mapper.CategoryMapper;
import com.noface.newswebapi.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    CategoryService categoryService;

    @Autowired
    CategoryMapper categoryMapper;

    @PostMapping
    public ApiResponse<CategoryResponse> createCategory(@RequestBody CategoryRequest request) {
        CategoryResponse response = categoryService.createCategory(categoryMapper.asCategory(request));
        return ApiResponse.<CategoryResponse> builder()
                .result(response).build();
    }

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getCategories(){
        List<CategoryResponse> categories = categoryService.getCategories()
                .map((category -> categoryMapper.toCategoryResponse(category))).toList();

        return ApiResponse.<List<CategoryResponse>>builder()
                .result(categories)
                .build();
    }

    @PutMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR')")
    public ApiResponse<CategoryResponse> updateCategory(@RequestBody CategoryRequest request){
        CategoryResponse response = categoryService.updateCategory(categoryMapper.asCategory(request));
        return ApiResponse.<CategoryResponse>builder()
                .result(response).build();
    }

    @DeleteMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR')")
    public ApiResponse<CategoryResponse> deleteCategoryById(@RequestParam("id") String slug){
        CategoryResponse response = categoryService.deleteCategoryBySlug(slug);
        return ApiResponse.<CategoryResponse> builder()
                .result(response)
                .build();
    }
}

