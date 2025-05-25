package com.noface.newswebapi.service;

import com.noface.newswebapi.cons.ArticleApprovedStatus;
import com.noface.newswebapi.dto.PagedResult;
import com.noface.newswebapi.dto.comment.CommentRequest;
import com.noface.newswebapi.dto.comment.CommentResponse;
import com.noface.newswebapi.entity.Article;
import com.noface.newswebapi.entity.Comment;
import com.noface.newswebapi.entity.User;
import com.noface.newswebapi.exception.AppException;
import com.noface.newswebapi.exception.ErrorCode;
import com.noface.newswebapi.dto.mapper.CommentMapper;
import com.noface.newswebapi.repository.ArticleRepository;
import com.noface.newswebapi.repository.CommentRepository;
import com.noface.newswebapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ArticleRepository articleRepository;
    @Autowired
    private CommentMapper commentMapper;


    public CommentResponse createComment(String articleId, CommentRequest commentRequest) {
        Comment newComment = commentMapper.asComment(commentRequest);
        Article parentArticle = articleRepository.findById(articleId).get();

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User author = userRepository.findByUsername(username).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));
        newComment.setAuthor(author);
        newComment.setParentArticle(parentArticle);
        newComment.setCreatedAt(LocalDateTime.now());
        newComment.setUpdatedAt(LocalDateTime.now());
        newComment = commentRepository.save(newComment);
        return commentMapper.toCommentResponse(newComment);
    }
    public CommentResponse editComment(String id, CommentRequest commentRequest) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));
        commentMapper.updateComment(comment, commentMapper.asComment(commentRequest));
        commentRepository.save(comment);
        return commentMapper.toCommentResponse(comment);
    }
    public PagedResult<CommentResponse> getCommentsByArticleId(String articleId, Pageable pageable) {
        Page<CommentResponse> comments = commentRepository.getCommentsByParentArticle_Id(articleId, pageable)
                .map(commentMapper::toCommentResponse);
        return new PagedResult<CommentResponse>(comments);
    }


    @Transactional
    public CommentResponse removeComment(String id) {
        commentRepository.removeCommentById(id);
        return CommentResponse.builder().id(id).build();
    }

    public PagedResult<CommentResponse> getAllComments(String search, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        Page<CommentResponse> comments = commentRepository.findCommentsWithFilter(search, startDate, endDate, pageable)
                .map(commentMapper::toCommentResponse);
        return new PagedResult<>(comments);
    }
    public boolean isOwned(String commentId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Comment comment = commentRepository.findById(commentId).orElseThrow(
                () -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));
        return comment.getAuthor().getUsername().equals(username);
    }

    public PagedResult<CommentResponse> getCommentsByUsername(String username, Pageable pageable) {

        Page<CommentResponse> comments = commentRepository
                .getCommentsByAuthor_Username(username, pageable)
                .map(commentMapper::toCommentResponse);
        return new PagedResult<>(comments);
    }

    public CommentResponse getCommentById(String id) {
        return commentRepository.findCommentsById(id)
                .map(commentMapper::toCommentResponse)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXISTED));
    }

    public PagedResult<CommentResponse> getPublicComments(String articleId, Pageable pageable) {
        Article article = articleRepository.findById(articleId).orElseThrow(
                () -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));;
        if(article.getApprovedStatus().equals(ArticleApprovedStatus.ACCEPTED)){
            throw new AppException(ErrorCode.ARTICLE_NOT_PUBLISHED);
        }
        Page<CommentResponse> comments = commentRepository.getCommentsByParentArticle_Id(articleId, pageable)
                .map(commentMapper::toCommentResponse);
        return new PagedResult<>(comments);
    }
}
