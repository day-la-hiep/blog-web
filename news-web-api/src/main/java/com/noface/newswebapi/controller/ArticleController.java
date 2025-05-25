package com.noface.newswebapi.controller;

import com.noface.newswebapi.cons.ArticleApprovedStatus;
import com.noface.newswebapi.dto.PagedResult;
import com.noface.newswebapi.dto.article.*;
import com.noface.newswebapi.dto.ApiResponse;

import com.noface.newswebapi.service.ArticleService;
import com.noface.newswebapi.service.FileUploadService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;


@RestController
@RequestMapping("/api")
@Slf4j
public class ArticleController {
    @Autowired
    private ArticleService articleService;
    @Autowired
    private FileUploadService fileUploadService;

    @PostMapping("/articles")
    public ApiResponse<ArticleResponse> createArticle(
            @RequestBody ArticleCreateRequest request
    ) throws IOException {

        ArticleResponse response = articleService.createNewArticle(
                request);
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
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR') " +
            "or @articleService.isOwned(authentication.name, #id)")
    public ApiResponse<ArticleResponse> getArticleById(@PathVariable String id) {
        return ApiResponse.<ArticleResponse>builder()
                .result(articleService.getArticleById(id))
                .build();
    }


    @GetMapping("/articles")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR')")
    public ApiResponse<PagedResult<ArticleOverviewResponse>> getArticles(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "100") Integer limit,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false) String approvedStatus,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate
    ) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        startDate = startDate != null ? startDate.withHour(0)
                .withMinute(0).withSecond(0).withNano(0) : startDate;
        endDate = endDate != null ? endDate.withHour(23).withMinute(59).withSecond(59)
                .withNano(999_999_999) : endDate;

        Pageable pageable = PageRequest.of(page, limit,
                Sort.by(Sort.Direction.fromString(sortBy.startsWith("-") ? "desc" : "asc"),
                        sortBy.replace("+", "").replace("-", "").trim()
                ));

        PagedResult<ArticleOverviewResponse> articlesResponse = articleService.getArticlesWithFilter(
                search, startDate, endDate, status, approvedStatus, pageable);
        ApiResponse<PagedResult<ArticleOverviewResponse>> response = ApiResponse.<PagedResult<ArticleOverviewResponse>>builder()
                .result(articlesResponse)
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
    public ApiResponse<ArticleSubmitResponse> submitArticle(
            @PathVariable String articleId
    ) {
        return ApiResponse.<ArticleSubmitResponse>builder()
                .result(articleService.submitArticle(articleId))
                .build();
    }

    @PostMapping("/articles/{articleId}/unsubmit")
    @PreAuthorize("@articleService.isOwned(authentication.name, #articleId)")
    public ApiResponse<ArticleSubmitResponse> unsubmitArticle(
            @PathVariable String articleId
    ) {
        return ApiResponse.<ArticleSubmitResponse>builder()
                .result(articleService.unsubmitArticle(articleId))
                .build();
    }

    @PostMapping("/articles/{articleId}/accept")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR')")
    public ApiResponse<ArticleSubmitResponse> acceptArticle(
            @PathVariable String articleId
    ) {
        return ApiResponse.<ArticleSubmitResponse>builder()
                .result(articleService.acceptArticle(articleId))
                .build();
    }

    @PostMapping("/articles/{articleId}/reject")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR')")
    public ApiResponse<ArticleSubmitResponse> rejectArticle(
            @PathVariable String articleId
    ) {
        return ApiResponse.<ArticleSubmitResponse>builder()
                .result(articleService.rejectArticle(articleId))
                .build();
    }

    @PostMapping("/articles/{articleId}/unaccept")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR')")
    public ApiResponse<ArticleSubmitResponse> undoAcceptArticle(
            @PathVariable String articleId
    ) {
        return ApiResponse.<ArticleSubmitResponse>builder()
                .result(articleService.undoAcceptedArticle(articleId))
                .build();
    }


    @DeleteMapping("/articles/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR') or @articleService.isOwned(authentication.name, #id)")
    public ApiResponse<ArticleDeleteResponse> removeArticle(@PathVariable String id) {
        return ApiResponse.<ArticleDeleteResponse>builder()
                .result(articleService.removeArticleById(id))
                .build();
    }


    @PostMapping("/articles/{articleId}/images")
    public ApiResponse<UploadImageResponse> uploadArticleImages(
            @RequestParam("file") MultipartFile file,
            @PathVariable String articleId,
            @RequestParam(defaultValue = "false") boolean overwrite
    ) throws IOException {
        return ApiResponse.<UploadImageResponse>builder()
                .result(UploadImageResponse.builder()
                        .url(fileUploadService.uploadArticleImages(articleId, file))
                        .success(true)
                        .build())
                .build();
    }


    @GetMapping("/users/{username}/articles")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MODERATOR') or authentication.name == #username or 'me' == #username ")
    public ApiResponse<PagedResult<ArticleOverviewResponse>> getArticlesByUsername(
            @PathVariable String username,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "100") Integer limit,
            @RequestParam(defaultValue = "+id") String sortBy,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false, name = "startDate") LocalDateTime updateStartDate,
            @RequestParam(required = false, name = "endDate") LocalDateTime updateEndDate,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String approvedStatus
    ) {
        Pageable pageable = PageRequest.of(page, limit,
                Sort.by(Sort.Direction.fromString(
                                sortBy.startsWith("-") ? "desc" : "asc"),
                        sortBy.replace("+", "").replace("-", ""
                        )));
        if (username.equals("me")) {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        }
        return ApiResponse.<PagedResult<ArticleOverviewResponse>>builder()
                .result(articleService.getArticlesByUsername(
                        username, search, updateStartDate, updateEndDate,status, approvedStatus, pageable
                        ))
                .build();
    }

    @GetMapping("/categories/{categoryId}/articles")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR')")
    public ApiResponse<PagedResult<ArticleOverviewResponse>> getArticlesByCategory(
            @PathVariable String categoryId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "100") Integer limit,
            @RequestParam(defaultValue = "+id") String sortBy,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false, name = "startDate") LocalDateTime updateStartDate,
            @RequestParam(required = false, name = "endDate") LocalDateTime updateEndDate,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String approvedStatus
    ) {
        Pageable pageable = PageRequest.of(page, limit,
                Sort.by(Sort.Direction.fromString(
                                sortBy.startsWith("-") ? "desc" : "asc"),
                        sortBy.replace("+", "").replace("-", ""
                        )));
        return ApiResponse.<PagedResult<ArticleOverviewResponse>>builder()
                .result(articleService.getArticlesByCategoryId(
                        categoryId, search, updateStartDate, updateEndDate,status, approvedStatus, pageable
                ))
                .build();
    }


    @PostMapping("/articles/{articleId}/duplicate")
    @PreAuthorize("@articleService.isOwned(authentication.name, #articleId)")
    public ApiResponse<ArticleResponse> duplicateArticle(
            @PathVariable String articleId,
            @RequestBody ArticleDuplicateRequest request
    ) {
        return ApiResponse.<ArticleResponse>builder()
                .result(articleService.duplicateArticle(articleId, request.getName()))
                .build();
    }

    @PostMapping("/articles/{articleId}/import")
    @PreAuthorize("@articleService.isOwned(authentication.name, #articleId)" +
            "and @articleService.isOwned(authentication.name, #request.sourceId)")
    public ApiResponse<ArticleResponse> importArticle(
            @PathVariable String articleId,
            @RequestBody ArticleImportRequest request
    ) {
        return ApiResponse.<ArticleResponse>builder()
                .result(articleService.importArticle(request.getSourceId(), articleId))
                .build();
    }


    @GetMapping("/public/articles")
    public ApiResponse<PagedResult<ArticleOverviewResponse>> getPublicArticles(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "100") Integer limit,
            @RequestParam(defaultValue = "+id") String sortBy,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false, name = "startDate") LocalDateTime publishedStartDate,
            @RequestParam(required = false, name = "endDate") LocalDateTime publishedEndDate
    ) {
        Pageable pageable = PageRequest.of(page, limit,
                Sort.by(Sort.Direction.fromString(
                                sortBy.startsWith("-") ? "desc" : "asc"),
                        sortBy.replace("+", "").replace("-", ""
                        )));
        return ApiResponse.<PagedResult<ArticleOverviewResponse>>builder()
                .result(articleService.getArticlesWithFilter(search, publishedStartDate, publishedEndDate
                    ,null, ArticleApprovedStatus.ACCEPTED.getName(), pageable))
                .build();
    }

    @GetMapping("/public/categories/{categorySlug}/articles")
    public ApiResponse<PagedResult<ArticleOverviewResponse>> getPublicArticlesByCategorySlug(
            @PathVariable String categorySlug,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "100") Integer limit,
            @RequestParam(defaultValue = "+id") String sortBy,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false, name = "startDate") LocalDateTime publishedStartDate,
            @RequestParam(required = false, name = "endDate") LocalDateTime publishedEndDate
    ) {
        Pageable pageable = PageRequest.of(page, limit,
                Sort.by(Sort.Direction.fromString(
                                sortBy.startsWith("-") ? "desc" : "asc"),
                        sortBy.replace("+", "").replace("-", ""
                        )));
        return ApiResponse.<PagedResult<ArticleOverviewResponse>>builder()
                .result(articleService.getArticlesByCategorySlug(categorySlug, search, publishedStartDate, publishedEndDate
                        ,null, ArticleApprovedStatus.ACCEPTED.getName(), pageable))
                .build();
    }
    @GetMapping("/public/users/{username}/articles")
    public ApiResponse<PagedResult<ArticleOverviewResponse>> getPublicArticlesByUsername(
            @PathVariable String username,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "100") Integer limit,
            @RequestParam(defaultValue = "+id") String sortBy,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false, name = "startDate") LocalDateTime publishedStartDate,
            @RequestParam(required = false, name = "endDate") LocalDateTime publishedEndDate
    ) {
        Pageable pageable = PageRequest.of(page, limit,
                Sort.by(Sort.Direction.fromString(
                                sortBy.startsWith("-") ? "desc" : "asc"),
                        sortBy.replace("+", "").replace("-", ""
                        )));
        return ApiResponse.<PagedResult<ArticleOverviewResponse>>builder()
                .result(articleService.getArticlesByUsername(username, search, publishedStartDate, publishedEndDate
                        ,null, ArticleApprovedStatus.ACCEPTED.getName(), pageable))
                .build();
    }

    @GetMapping("/public/articles/{articleId}")
    public ApiResponse<ArticleResponse> getPublicArticleById(
            @PathVariable String articleId
    ) {
        return ApiResponse.<ArticleResponse>builder()
                .result(articleService.getPublicArticleById(articleId))
                .build();
    }


}
