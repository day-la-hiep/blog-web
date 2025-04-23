package com.noface.newswebapi.controller;

import com.noface.newswebapi.cons.ArticleStatus;
import com.noface.newswebapi.dto.request.article.ArticleCreateRequest;
import com.noface.newswebapi.dto.request.article.ArticleUpdateRequest;
import com.noface.newswebapi.dto.response.ApiResponse;

import com.noface.newswebapi.dto.response.article.ArticleOverviewResponse;
import com.noface.newswebapi.dto.response.article.ArticleResponse;
import com.noface.newswebapi.dto.response.article.UploadArticleImageResponse;
import com.noface.newswebapi.dto.mapper.ArticleMapper;
import com.noface.newswebapi.service.ArticleService;
import com.noface.newswebapi.service.FileUploadService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Stream;


@RestController
@RequestMapping("/api")
@Slf4j
public class ArticleController {
    @Autowired
    private ArticleMapper articleMapper;
    @Autowired
    private ArticleService articleService;
    @Autowired
    private FileUploadService fileUploadService;

    @PostMapping("/articles")
    public ApiResponse<ArticleResponse> createArticle(
            @RequestBody ArticleCreateRequest articleRequest
    ) throws IOException {

        ArticleResponse response = articleService.createNewArticle(
                articleRequest);
        return ApiResponse.<ArticleResponse>builder()
                .result(response)
                .build();
    }

    @PostMapping("/articles/{articleId}/thumbnail")
    @PreAuthorize("@articleService.isOwned(authentication.name, #articleId)")
    public ApiResponse<ArticleResponse> uploadImageThumbnails(
            @RequestParam("file") MultipartFile file,
            @PathVariable("articleId") String articleId
    ) throws IOException {
        return ApiResponse.<ArticleResponse>builder()
                .result(fileUploadService.uploadArticleThumbnail(articleId, file))
                .build();
    }

    @GetMapping("/articles/{id}")
    public ApiResponse<ArticleResponse> getArticleById(@PathVariable String id) {
        return ApiResponse.<ArticleResponse>builder()
                .result(articleService.getArticleById(id))
                .build();
    }


    @GetMapping("/articles")
    public ApiResponse<List<ArticleOverviewResponse>> getArticles(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "100") Integer limit,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "") String search,

            @RequestParam(defaultValue = "") String status,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate
    ) {

        startDate = startDate != null ? startDate.withHour(0)
                .withMinute(0).withSecond(0).withNano(0) : startDate;
        endDate = endDate != null ? endDate.withHour(23).withMinute(59).withSecond(59)
                .withNano(999_999_999) : endDate;
        List<SimpleGrantedAuthority> authorities = (List<SimpleGrantedAuthority>) SecurityContextHolder
                .getContext().getAuthentication().getAuthorities();
        if(authorities.contains(new SimpleGrantedAuthority("ROLE_ANONYMOUS"))) {
            status = ArticleStatus.PUBLISHED.getName().toUpperCase();
        }
        Pageable pageable = PageRequest.of(page, limit,
                Sort.by(Sort.Direction.fromString(sortBy.startsWith("-") ? "desc" : "asc"),
                        sortBy.replace("+", "").replace("-", "").trim()
                ));

        Stream<ArticleOverviewResponse> articlesResponse = articleService.getArticlesWithFilter(
                search, startDate, endDate, status, pageable);
        ApiResponse<List<ArticleOverviewResponse>> response = ApiResponse.<List<ArticleOverviewResponse>>builder()
                .result(articlesResponse.toList())
                .build();
        return response;
    }


    @PutMapping("/articles/{id}")
    @PreAuthorize("@articleService.isOwned(authentication.name, #id)")
    public ApiResponse<ArticleResponse> updateArticle(
            @PathVariable String id, @RequestBody ArticleUpdateRequest request
    ) {
        ArticleResponse response = articleService.updateArticle(id,
                request);
        return ApiResponse.<ArticleResponse>builder()
                .result(response)
                .build();
    }

    @PostMapping("/articles/{articleId}/submit")
    @PreAuthorize("@articleService.isOwned(authentication.name, #articleId)")
    public ApiResponse<ArticleResponse> submitArticle(
            @PathVariable("articleId") String articleId
    ) {
        return ApiResponse.<ArticleResponse>builder()
                .result(articleService.updateArticleStatus(
                        articleId, ArticleStatus.PENDING.getName()))
                .build();
    }

    @PostMapping("/articles/{articleId}/published")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR')")
    public ApiResponse<ArticleResponse> publishArticle(
            @PathVariable String articleId
    ){
        return ApiResponse.<ArticleResponse>builder()
                .result(articleService.updateArticleStatus(articleId
                        , ArticleStatus.PUBLISHED.getName()))
                .build();
    }



    @DeleteMapping("/articles/{id}")
    @PreAuthorize("@articleService.isOwned(authentication.name, #id)")
    public ApiResponse<ArticleResponse> removeArticle(@PathVariable String id) {
        return ApiResponse.<ArticleResponse>builder()
                .result(articleService.removeArticleById(id))
                .build();
    }

    @GetMapping("/articles/quantity")
    public ApiResponse<Long> getNumberOfArticle(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "PUBLISHED") String status,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate
    ) {
        List<SimpleGrantedAuthority> authorities = (List<SimpleGrantedAuthority>) SecurityContextHolder
                .getContext().getAuthentication().getAuthorities();
        if(authorities.contains(new SimpleGrantedAuthority("ROLE_ANONYMOUS"))) {
            status = ArticleStatus.PUBLISHED.getName().toUpperCase();
        }
        return ApiResponse.<Long>builder().result(articleService.getNumberOfArtilce(search,
                status, startDate, endDate)).build();
    }

    @PostMapping("/{articleId}/images")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR') or " +
            "@articleService.isOwned(authentication.name, #articleId)")
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


    @GetMapping("/users/{userId}/articles")
    @PreAuthorize("@articleService.isOwned(authentication.name, #userId)")
    public ApiResponse<List<ArticleResponse>> getArticlesByUserId(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "100") Integer limit,
            @RequestParam(defaultValue = "+id") String sortProperty
    ) {
        Pageable pageable = PageRequest.of(page, limit,
                Sort.by(Sort.Direction.fromString(
                        sortProperty.startsWith("+") ? "asc" : "desc"),
                        sortProperty.replace("+", "").replace("-", ""
                )));
        return ApiResponse.<List<ArticleResponse>>builder()
                .result(articleService.getArticlesByUserId(userId, pageable))
                .build();
    }

    @GetMapping("/categories/{categorySlug}/articles")
    public ApiResponse<List<ArticleOverviewResponse>> getArticlesByCategory(
            @PathVariable String categorySlug,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "100") Integer limit,
            @RequestParam(defaultValue = "id") String sortBy
    ) {
        Pageable pageable = PageRequest.of(page, limit,
                Sort.by(Sort.Direction.fromString(
                        sortBy.startsWith("-") ? "desc" : "asc"),
                        sortBy.replace("+", "").replace("-", ""
                )));
        return ApiResponse.<List<ArticleOverviewResponse>>builder()
                .result(articleService.getArticlesByCategorySlug(categorySlug, pageable))
                .build();
    }
}
