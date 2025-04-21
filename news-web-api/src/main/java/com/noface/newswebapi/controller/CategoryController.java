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
@RequestMapping("/api")
public class CategoryController {
    @Autowired
    CategoryService categoryService;

    @Autowired
    CategoryMapper categoryMapper;

    @PostMapping("/categories")
    public ApiResponse<CategoryResponse> createCategory(@RequestBody CategoryRequest request) {
        CategoryResponse response = categoryService.createCategory(categoryMapper.asCategory(request));
        return ApiResponse.<CategoryResponse> builder()
                .result(response).build();
    }

    @GetMapping("/categories")
    public ApiResponse<List<CategoryResponse>> getCategories(){
       List<CategoryResponse> categoryResponses = categoryService.getCategories();
        return ApiResponse.<List<CategoryResponse>>builder()
                .result(categoryResponses)
                .build();
    }

    @PutMapping("/categories/{slug}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR')")
    public ApiResponse<CategoryResponse> updateCategory(@RequestBody CategoryRequest request,
                                                        @PathVariable("slug") String slug) {
        CategoryResponse response = categoryService.updateCategory(slug, request);
        return ApiResponse.<CategoryResponse>builder()
                .result(response).build();
    }

    @DeleteMapping("/category/{slug}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR')")
    public ApiResponse<CategoryResponse> deleteCategoryBySlug(@PathVariable("slug") String slug){
        CategoryResponse response = categoryService.deleteCategoryBySlug(slug);
        return ApiResponse.<CategoryResponse> builder()
                .result(response)
                .build();
    }
}

