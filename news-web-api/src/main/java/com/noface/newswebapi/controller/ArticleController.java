package com.noface.newswebapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.noface.newswebapi.cons.ArticleStatus;
import com.noface.newswebapi.dto.request.ArticleRequest;
import com.noface.newswebapi.dto.response.ApiResponse;
import com.noface.newswebapi.dto.response.ArticleOverviewResponse;
import com.noface.newswebapi.dto.response.ArticleResponse;
import com.noface.newswebapi.dto.response.UploadArticleImageResponse;
import com.noface.newswebapi.mapper.ArticleMapper;
import com.noface.newswebapi.service.ArticleService;
import com.noface.newswebapi.service.FileUploadService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;


@RestController
@RequestMapping("/api/articles")
@Slf4j
public class ArticleController {
    @Autowired
    private ArticleMapper articleMapper;
    @Autowired
    private ArticleService articleService;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private FileUploadService fileUploadService;

    @PostMapping()
    public ApiResponse<ArticleResponse> createArticle(
            @RequestBody ArticleRequest articleRequest

    ) throws IOException {

        ArticleResponse response = articleService.createNewArticle(
                articleRequest);
        return ApiResponse.<ArticleResponse>builder()
                .result(response)
                .build();
    }

    @PostMapping("/{articleId}/thumbnail")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR') or " +
            "@articleService.isOwned(authentication.name, #articleId)")
    public ApiResponse<ArticleResponse> uploadImageThumbnails(
            @RequestParam("file") MultipartFile file,
            @PathVariable("articleId") Long articleId
    ) throws IOException {
        return ApiResponse.<ArticleResponse>builder()
                .result(fileUploadService.uploadArticleThumbnail(articleId, file))
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR') or " +
            "@articleService.isOwned(authentication.name, #id)")
    public ApiResponse<ArticleResponse> getArticleById(@PathVariable Long id) {
        return ApiResponse.<ArticleResponse>builder()
                .result(articleService.getArticleById(id))
                .build();
    }


    @GetMapping()
    public ApiResponse<List<ArticleResponse>> getArticles(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "100") Integer size,
            @RequestParam(defaultValue = "id") String sortProperty,
            @RequestParam(defaultValue = "asc") String sortDirection,
            @RequestParam(defaultValue = "") String title,
            @RequestParam(defaultValue = "") String id,

            @RequestParam(required = false) String status,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate,
            @RequestParam(required = false) String authorName
    ) {
        startDate = startDate != null ? startDate.withHour(0)
                .withMinute(0).withSecond(0).withNano(0) : startDate;
        endDate = endDate != null ? endDate.withHour(23).withMinute(59).withSecond(59)
                .withNano(999_999_999) : endDate;
        ArticleStatus articleStatus = status != null ? ArticleStatus.valueOf(status.toUpperCase()) : null;
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.fromString(sortDirection.toUpperCase()), sortProperty));

        Stream<ArticleResponse> articlesResponse = articleService.getArticlesWithFilter(
                id, title, authorName, startDate, endDate, articleStatus, pageable);
        ApiResponse<List<ArticleResponse>> response = ApiResponse.<List<ArticleResponse>>builder()
                .result(articlesResponse.toList())
                .build();
        return response;
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or @articleService.isOwned(authentication.name, #id)")
    public ApiResponse<ArticleResponse> updateArticle(@PathVariable Long id, @RequestBody ArticleRequest request) {

        ArticleResponse response = articleService.updateArticle(id,
                articleMapper.asArticle(request));
        return ApiResponse.<ArticleResponse>builder()
                .result(response)
                .build();
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or @articleService.isOwned(authentication.name, #id)")
    public ApiResponse<ArticleResponse> removeArticle(@PathVariable Long id) {
        return ApiResponse.<ArticleResponse>builder()
                .result(articleService.removeArticleById(id))
                .build();
    }

    @GetMapping("/count")
    public ApiResponse<Long> getNumberOfArticle(
            @RequestParam(defaultValue = "") String title,
            @RequestParam(defaultValue = "") String id,

            @RequestParam(required = false) String status,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate,
            @RequestParam(required = false) String authorName
    ) {
        ArticleStatus articleStatus = status != null ? ArticleStatus.valueOf(status.toUpperCase()) : null;

        return ApiResponse.<Long>builder().result(articleService.getNumberOfArtilce(title, id,
                articleStatus, startDate, endDate, authorName )).build();
    }

    @PostMapping("/{articleId}/images")
    public ApiResponse<UploadArticleImageResponse> uploadArticleImages(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "false") boolean overwrite,
            @PathVariable("articleId") Long articleId
    ) throws IOException {
        return ApiResponse.<UploadArticleImageResponse>builder()
                .result(UploadArticleImageResponse.builder()
                        .url(fileUploadService.uploadArticleImages(file, articleId))
                        .success(true)
                        .build())
                .build();
    }


}
