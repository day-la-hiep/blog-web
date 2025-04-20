package com.noface.newswebapi.service;

import com.noface.newswebapi.dto.request.CommentRequest;
import com.noface.newswebapi.dto.response.CommentResponse;
import com.noface.newswebapi.entity.Article;
import com.noface.newswebapi.entity.Comment;
import com.noface.newswebapi.entity.User;
import com.noface.newswebapi.exception.AppException;
import com.noface.newswebapi.exception.ErrorCode;
import com.noface.newswebapi.mapper.CommentMapper;
import com.noface.newswebapi.repository.ArticleRepository;
import com.noface.newswebapi.repository.CommentRepository;
import com.noface.newswebapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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


    public CommentResponse addComment(CommentRequest commentRequest) {
        Comment newComment = commentMapper.asComment(commentRequest);
        Article parentArticle = commentRequest.getParentArticleId() == null ? null :
                articleRepository.getArticleById(commentRequest.getParentArticleId()).orElseThrow(
                        () -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));

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
    public List<CommentResponse> getAllCommentsByArticleId(String articleId) {
        List<Comment> comments = commentRepository.getAllByParentArticle_Id(articleId);
        return comments.stream().map(commentMapper::toCommentResponse).collect(Collectors.toList());
    }


    @Transactional
    public CommentResponse removeComment(String id) {
        commentRepository.removeCommentById(id);
        return CommentResponse.builder().id(id).build();
    }

    public List<CommentResponse> getAllComments() {
        List<Comment> comments = commentRepository.findAll();
        return comments.stream().map(commentMapper::toCommentResponse).collect(Collectors.toList());
    }
}
