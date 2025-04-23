package com.noface.newswebapi.controller;

import com.noface.newswebapi.dto.request.AddArticleToSavedListRequest;
import com.noface.newswebapi.dto.request.SavedListRequest;
import com.noface.newswebapi.dto.response.ApiResponse;
import com.noface.newswebapi.dto.response.article.ArticleResponse;
import com.noface.newswebapi.dto.response.SavedListResponse;
import com.noface.newswebapi.service.SavedListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SavedListController {
    @Autowired
    private SavedListService savedListService;
    @GetMapping("/users/me/saved-lists")
    public ApiResponse<List<SavedListResponse>> getAllSavedLists() {
        List<SavedListResponse> response = savedListService.getSavedLists();
        return ApiResponse.<List<SavedListResponse>>builder()
                .result(response)
                .build();
    }
    @GetMapping("/saved-lists/{listId}/articles")
    @PreAuthorize("@savedListService.isOwnSavedList(authentication.name, #listId)")
    public ApiResponse<List<ArticleResponse>> getArticlesInSavedList(@PathVariable String listId) {
        List<ArticleResponse> response = savedListService.getArticlesInSavedList(listId);
        return ApiResponse.<List<ArticleResponse>>builder()
                .result(response)
                .build();
    }

    @DeleteMapping("/saved-lists/{listId}/articles/{articleId}")
    @PreAuthorize("@savedListService.isOwnSavedList(authentication.name, #listId)")
    public ApiResponse removeArticleFromSavedList(@PathVariable String listId, @PathVariable String articleId) {
        savedListService.removeArticleFromSavedList(listId, articleId);
        return ApiResponse.builder()
                .result("Article removed from saved list")
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
    public ApiResponse<ArticleResponse> addArticleToSavedList(@PathVariable String listId, @RequestBody AddArticleToSavedListRequest request) {
        ArticleResponse response = savedListService.addArticleToSavedList(listId, request.getArticleId());
        return ApiResponse.<ArticleResponse>builder()
                .result(response)
                .build();
    }
}
