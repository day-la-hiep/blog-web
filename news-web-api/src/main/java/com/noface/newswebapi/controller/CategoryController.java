package com.noface.newswebapi.controller;

import com.noface.newswebapi.dto.PagedResult;
import com.noface.newswebapi.dto.category.*;
import com.noface.newswebapi.dto.ApiResponse;

import com.noface.newswebapi.dto.mapper.CategoryMapper;
import com.noface.newswebapi.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR')")
    public ApiResponse<CategoryCreateResponse> createCategory(@RequestBody CategoryCreateRequest request) {
        return ApiResponse.<CategoryCreateResponse> builder()
                .result(categoryService.createCategory(request))
                .build();
    }

    @GetMapping("/categories")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR')")
    public ApiResponse<PagedResult<CategoryResponse>> getCategories(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String parentId
            ){
        Pageable pageable = PageRequest.of(page, limit, Sort.by(
                Sort.Direction.fromString(sortBy.startsWith("-") ? "desc" : "asc"),
                sortBy.replace("+", "").replace("-", "").trim()
        ));
        return ApiResponse.<PagedResult<CategoryResponse>>builder()
                .result(categoryService.getCategoriesBy(search, active, parentId, pageable))
                .build();
    }
    @GetMapping("/categories/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') OR hasAuthority('ROLE_MODERATOR')")
    public ApiResponse<CategoryResponse> getCategoryById(@PathVariable String id) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.getCategoriesById(id))
                .build();
    }
    @GetMapping("/public/categories/{slug}")
    public ApiResponse<CategoryResponse> getPublicCategoryById(@PathVariable String slug) {
        return ApiResponse.<CategoryResponse>builder()
                .result(categoryService.getPublicCategoriesBySlug(slug))
                .build();
    }

    @GetMapping("/categories/{id}/children")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR')")
    public ApiResponse<PagedResult<CategoryResponse>> getCategoriesByParentCategory(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(required = false) Boolean active,
            @PathVariable String id
    ){
        Pageable pageable = PageRequest.of(page, limit, Sort.by(
                Sort.Direction.fromString(sortBy.startsWith("-") ? "desc" : "asc"),
                sortBy.replace("+", "").replace("-", "").trim()
        ));
        return ApiResponse.<PagedResult<CategoryResponse>>builder()
                .result(categoryService.getChildrenCategoriesByParentId(active, search, id, pageable))
                .build();
    }

    @GetMapping("/public/categories")
    public ApiResponse<PagedResult<CategoryResponse>> getPublicCategories(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(required = false) String parentId
    ){
        Pageable pageable = PageRequest.of(page, limit, Sort.by(
                Sort.Direction.fromString(sortBy.startsWith("-") ? "desc" : "asc"),
                sortBy.replace("+", "").replace("-", "").trim()
        ));
        return ApiResponse.<PagedResult<CategoryResponse>>builder()
                .result(categoryService.getCategoriesBy(search, true, parentId, pageable))
                .build();
    }
    @GetMapping("/public/categories/{slug}/children")
    public ApiResponse<PagedResult<CategoryResponse>> getPublicCategoriesByParentCategory(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "name") String sortBy,

            @PathVariable String slug
    ){
        Pageable pageable = PageRequest.of(page, limit, Sort.by(
                Sort.Direction.fromString(sortBy.startsWith("-") ? "desc" : "asc"),
                sortBy.replace("+", "").replace("-", "").trim()
        ));
        return ApiResponse.<PagedResult<CategoryResponse>>builder()
                .result(categoryService.getChildrenCategoriesByParentSlug(true, search, slug, pageable))
                .build();
    }

    @PutMapping("/categories/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR')")
    public ApiResponse<CategoryUpdateResponse> updateCategory(
            @RequestBody CategoryUpdateRequest request,
            @PathVariable String id
    ) {
        return ApiResponse.<CategoryUpdateResponse>builder()
                .result(categoryService.updateCategory(id, request))
                .build();
    }

    @DeleteMapping("/categories/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR')")
    public ApiResponse<CategoryDeleteResponse> deleteCategoryBySlug(@PathVariable("id") String id){
        return ApiResponse.<CategoryDeleteResponse>builder()
                .result(categoryService.deleteCategory(id))
                .build();
    }
}

