package com.noface.newswebapi.controller;

import com.noface.newswebapi.dto.request.CommentRequest;
import com.noface.newswebapi.dto.response.ApiResponse;
import com.noface.newswebapi.dto.response.CommentResponse;
import com.noface.newswebapi.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    @Autowired
    CommentService commentService;

    @PostMapping()
    public ApiResponse<CommentResponse> createComment(
            @RequestBody CommentRequest commentRequest
    ) {
        CommentResponse response = commentService.addComment(commentRequest);
        return ApiResponse.<CommentResponse>builder()
                .result(response)
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<CommentResponse> updateComment(
            @PathVariable("id") String id,
            @RequestBody CommentRequest commentRequest) {
        CommentResponse response = commentService.editComment(id, commentRequest);
        return ApiResponse.<CommentResponse>builder()
                .result(response)
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<CommentResponse> deleteComment(
            @PathVariable("id") String id
    ){
        CommentResponse response = commentService.removeComment(id);
        return ApiResponse.<CommentResponse>builder().result(response).build();
    }
    @GetMapping()
    public ApiResponse<List<CommentResponse>> getAllCommentsByParentId(
            @RequestParam("articleId") String articleId

    ){
        List<CommentResponse> responses;
        if(articleId != null){
            responses = commentService.getAllCommentsByArticleId(articleId);
        }else{
            responses = commentService.getAllComments();
        }
        return ApiResponse.<List<CommentResponse>>builder().result(responses).build();
    }

}
