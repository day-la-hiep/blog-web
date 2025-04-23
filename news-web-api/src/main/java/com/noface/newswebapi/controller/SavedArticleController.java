package com.noface.newswebapi.controller;

import com.noface.newswebapi.dto.request.SavedArticleRequest;
import com.noface.newswebapi.dto.response.ApiResponse;
import com.noface.newswebapi.dto.response.SavedArticleResponse;
import com.noface.newswebapi.entity.SavedArticle;
import com.noface.newswebapi.service.SavedArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class SavedArticleController {

    @Autowired
    private SavedArticleService savedArticleService;

    @PutMapping("/saved-articles/{id}")

    public ApiResponse<SavedArticleResponse> updateSavedArticle(@PathVariable("id") String id
            , @RequestBody SavedArticleRequest request) {
        SavedArticleResponse response =  savedArticleService.updateSavedArticle(id, request);
        return ApiResponse.<SavedArticleResponse>builder()
                .result(response)
                .build();
    }
}
