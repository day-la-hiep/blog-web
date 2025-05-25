package com.noface.newswebapi.controller;

import com.noface.newswebapi.dto.PagedResult;
import com.noface.newswebapi.dto.article.AddArticleToSavedListRequest;
import com.noface.newswebapi.dto.article.ArticleOverviewResponse;
import com.noface.newswebapi.dto.savedList.SavedListRequest;
import com.noface.newswebapi.dto.ApiResponse;
import com.noface.newswebapi.dto.savedList.SavedListResponse;
import com.noface.newswebapi.service.SavedListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class SavedListController {
    @Autowired
    private SavedListService savedListService;

    @GetMapping("/users/me/saved-lists")
    public ApiResponse<PagedResult<SavedListResponse>> getAllSavedLists(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer limit,
            @RequestParam(defaultValue = "name") String sortBy

    ) {
        if (page == null) page = 0;
        if (limit == null) limit = Integer.MAX_VALUE;
        Pageable pageable = PageRequest.of(page, limit, Sort.by(
                Sort.Direction.fromString(sortBy.startsWith("-") ? "desc" : "asc"),
                sortBy.replace("+", "").replace("-", "").trim()
        ));
        PagedResult<SavedListResponse> response = savedListService.getSavedLists(search, pageable);
        return ApiResponse.<PagedResult<SavedListResponse>>builder()
                .result(response)
                .build();
    }


    @DeleteMapping("/saved-lists/{listId}/articles/{articleId}")
    @PreAuthorize("@savedListService.isOwnSavedList(authentication.name, #listId)")
    public ApiResponse<SavedListResponse> deleteArticleInSavedList(@PathVariable String listId, @PathVariable String articleId) {
        return ApiResponse.<SavedListResponse>builder()
                .result(savedListService.deleteArticleInSavedList(listId, articleId))
                .build();
    }

    @PostMapping("/users/me/saved-lists")
    public ApiResponse<SavedListResponse> createSavedList(
            @RequestBody SavedListRequest savedListRequest) {
        SavedListResponse response = savedListService.createSavedList(savedListRequest);
        return ApiResponse.<SavedListResponse>builder()
                .result(response)
                .build();
    }

    @DeleteMapping("/saved-lists/{listId}")
    @PreAuthorize("@savedListService.isOwnSavedList(authentication.name, #listId)")
    public ApiResponse<SavedListResponse> deleteSavedList(@PathVariable String listId) {
        SavedListResponse response = savedListService.removeSavedList(listId);
        return ApiResponse.<SavedListResponse>builder()
                .result(response)
                .build();
    }

    @PutMapping("/saved-lists/{listId}")
    @PreAuthorize("@savedListService.isOwnSavedList(authentication.name, #listId)")
    public ApiResponse<SavedListResponse> updateSavedListInfo(@PathVariable String listId, @RequestBody SavedListRequest savedListRequest) {
        SavedListResponse response = savedListService.updateSavedListInfo(listId, savedListRequest);
        return ApiResponse.<SavedListResponse>builder()
                .result(response)
                .build();
    }

    @PostMapping("/saved-lists/{listId}/articles/")
    @PreAuthorize("@savedListService.isOwnSavedList(authentication.name, #listId)")
    public ApiResponse<SavedListResponse> addArticlesToSavedList(@PathVariable String listId, @RequestBody AddArticleToSavedListRequest request) {
        SavedListResponse response = savedListService.addArticleToSavedList(listId, request);
        return ApiResponse.<SavedListResponse>builder()
                .result(response)
                .build();
    }

    @GetMapping("/saved-lists/{listId}/articles")
    @PreAuthorize("@savedListService.isOwnSavedList(authentication.name, #listId)")
    public ApiResponse<PagedResult<ArticleOverviewResponse>> getArticlesInSavedList(
            @PathVariable String listId,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer limit,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "") String search
    ) {
        Pageable pageable;
        Sort sort = Sort.by(
                Sort.Direction.fromString(sortBy.startsWith("-") ? "desc" : "asc"),
                sortBy.replace("+", "").replace("-", "").trim()
        );
        if (page == null || limit == null) {
            pageable = PageRequest.of(0, Integer.MAX_VALUE, sort);
        } else {
            pageable = PageRequest.of(page, limit, sort);
        }
        PagedResult<ArticleOverviewResponse> response = savedListService.getArticlesInSavedList(listId, search, pageable);
        return ApiResponse.<PagedResult<ArticleOverviewResponse>>builder()
                .result(response)
                .build();
    }

    @GetMapping("/articles/{articleId}/saved-lists")
    public ApiResponse<PagedResult<SavedListResponse>> getSavedListsByArticle(
            @PathVariable String articleId,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer limit,
            @RequestParam(defaultValue = "id") String sortBy
    ) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (page == null) page = 0;
        if (limit == null) limit = Integer.MAX_VALUE;
        Pageable pageable = PageRequest.of(page, limit, Sort.by(
                Sort.Direction.fromString(sortBy.startsWith("-") ? "desc" : "asc"),
                sortBy.replace("+", "").replace("-", "").trim()
        ));
        PagedResult<SavedListResponse> response = savedListService.getSavedListsByArticle(username, articleId, pageable);
        return ApiResponse.<PagedResult<SavedListResponse>>builder()
                .result(response)
                .build();
    }
}
