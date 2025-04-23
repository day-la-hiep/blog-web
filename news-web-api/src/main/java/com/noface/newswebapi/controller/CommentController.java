package com.noface.newswebapi.controller;

import com.noface.newswebapi.dto.request.CommentRequest;
import com.noface.newswebapi.dto.response.ApiResponse;
import com.noface.newswebapi.dto.response.CommentResponse;
import com.noface.newswebapi.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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
    ){
        CommentResponse response = commentService.removeComment(id);
        return ApiResponse.<CommentResponse>builder().result(response).build();
    }
    @GetMapping("/articles/{articleId}/comments")
    public ApiResponse<List<CommentResponse>> getAllCommentsByParentId(
            @PathVariable("articleId") String articleId,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "-createdAt") String sortBy
    ){
        Pageable pageable = PageRequest.of(page, limit, Sort.by(
                Sort.Direction.fromString(sortBy.startsWith("-") ? "desc" : "asc"),
                sortBy.replace("+", "")
                        .replace("-", "").trim()
        ));
        List<CommentResponse> responses = commentService.getCommentsByArticleId(articleId, pageable);
        return ApiResponse.<List<CommentResponse>>builder().result(responses).build();
    }

    @GetMapping("/users/me/comments")
    public ApiResponse<List<CommentResponse>> getCurrentUserComments(
            @RequestParam(defaultValue = "-createdAt") String sortBy,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "0") int page

    ){
        Pageable pageable = PageRequest.of(page, limit, Sort.by(
                Sort.Direction.fromString(sortBy.startsWith("-") ? "desc" : "asc"),
                sortBy.replace("+", "")
                        .replace("-", "").trim()
        ));
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<CommentResponse> commentResponses =  commentService.getCommentsByUsername(username, pageable);
        return ApiResponse.<List<CommentResponse>>builder()
                .result(commentResponses).build();

    }

}
