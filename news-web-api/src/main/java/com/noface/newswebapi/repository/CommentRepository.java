package com.noface.newswebapi.repository;

import com.noface.newswebapi.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String> {
    Comment save(Comment comment);

    void removeCommentById(String id);

    List<Comment> getAllByParentArticle_Id(String articleId);

}
