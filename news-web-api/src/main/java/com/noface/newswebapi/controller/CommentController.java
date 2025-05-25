package com.noface.newswebapi.controller;

import com.noface.newswebapi.dto.PagedResult;
import com.noface.newswebapi.dto.comment.CommentRequest;
import com.noface.newswebapi.dto.ApiResponse;
import com.noface.newswebapi.dto.comment.CommentResponse;
import com.noface.newswebapi.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CommentController {
    @Autowired
    CommentService commentService;

    @PostMapping("/articles/{articleId}/comments")
    public ApiResponse<CommentResponse> createComment(
            @RequestBody CommentRequest commentRequest,
            @PathVariable("articleId") String articleId
    ) {
        CommentResponse response = commentService.createComment(
                articleId, commentRequest);
        return ApiResponse.<CommentResponse>builder()
                .result(response)
                .build();
    }

    @GetMapping("/comments/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR') or " +
            "@commentService.isOwned(#id)")
    public ApiResponse<CommentResponse> getCommentById(
            @PathVariable("id") String id
    ) {
        CommentResponse response = commentService.getCommentById(id);
        return ApiResponse.<CommentResponse>builder()
                .result(response)
                .build();
    }


    @PutMapping("/comments/{id}")
    @PreAuthorize("@commentService.isOwned(#id)")
    public ApiResponse<CommentResponse> updateComment(
            @PathVariable("id") String id,
            @RequestBody CommentRequest commentRequest) {
        CommentResponse response = commentService.editComment(id, commentRequest);
        return ApiResponse.<CommentResponse>builder()
                .result(response)
                .build();
    }

    @DeleteMapping("/comments/{id}")
    @PreAuthorize("@commentService.isOwned(#id) or " +
            "hasAnyAuthority('ROLE_ADMIN', 'ROLE_MODERATOR')")
    public ApiResponse<CommentResponse> deleteComment(
            @PathVariable("id") String id
    ) {
        CommentResponse response = commentService.removeComment(id);
        return ApiResponse.<CommentResponse>builder().result(response).build();
    }

    @GetMapping("/public/articles/{articleId}/comments")
    public ApiResponse<PagedResult<CommentResponse>> getComments(
            @PathVariable("articleId") String articleId,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "-id") String sortBy
    ) {
        Pageable pageable = PageRequest.of(page, limit, Sort.by(
                Sort.Direction.fromString(sortBy.startsWith("-") ? "desc" : "asc"),
                sortBy.replace("+", "")
                        .replace("-", "").trim()
        ));
        return ApiResponse.<PagedResult<CommentResponse>>builder()
                .result(commentService.getPublicComments(articleId, pageable))
                .build();
    }

    @GetMapping("/articles/{articleId}/comments")
    public ApiResponse<PagedResult<CommentResponse>> getAllCommentsByParentId(
            @PathVariable("articleId") String articleId,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "-createdAt") String sortBy,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate

    ) {
        startDate = startDate != null ? startDate.withHour(0)
                .withMinute(0).withSecond(0).withNano(0) : startDate;
        endDate = endDate != null ? endDate.withHour(23).withMinute(59).withSecond(59)
                .withNano(999_999_999) : endDate;

        Pageable pageable = PageRequest.of(page, limit, Sort.by(
                Sort.Direction.fromString(sortBy.startsWith("-") ? "desc" : "asc"),
                sortBy.replace("+", "")
                        .replace("-", "").trim()
        ));
        PagedResult<CommentResponse> responses = commentService.getCommentsByArticleId(articleId, pageable);
        return ApiResponse.<PagedResult<CommentResponse>>builder().result(responses).build();
    }

    @GetMapping("/comments")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR')")
    public ApiResponse<PagedResult<CommentResponse>> getAllComments(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "-createdAt") String sortBy,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate
    ) {
        startDate = startDate != null ? startDate.withHour(0)
                .withMinute(0).withSecond(0).withNano(0) : startDate;
        endDate = endDate != null ? endDate.withHour(23).withMinute(59).withSecond(59)
                .withNano(999_999_999) : endDate;
        Pageable pageable = PageRequest.of(page, limit, Sort.by(
                Sort.Direction.fromString(sortBy.startsWith("-") ? "desc" : "asc"),
                sortBy.replace("+", "")
                        .replace("-", "").trim()));

        return ApiResponse.<PagedResult<CommentResponse>>builder()
                .result(commentService.getAllComments(search, startDate, endDate, pageable))
                .build();
    }


    @GetMapping("/users/{username}/comments")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR') or authentication.name == #username or #username == 'me'")
    public ApiResponse<PagedResult<CommentResponse>> getCurrentUserComments(
            @RequestParam(defaultValue = "-createdAt") String sortBy,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "0") int page,
            @PathVariable String username
    ) {
        Pageable pageable = PageRequest.of(page, limit, Sort.by(
                Sort.Direction.fromString(sortBy.startsWith("-") ? "desc" : "asc"),
                sortBy.replace("+", "")
                        .replace("-", "").trim()
        ));
        if (username.equals("me")) {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        }
        PagedResult<CommentResponse> commentResponses = commentService.getCommentsByUsername(username, pageable);
        return ApiResponse.<PagedResult<CommentResponse>>builder()
                .result(commentResponses).build();

    }

}
