package com.noface.newswebapi.repository;

import com.noface.newswebapi.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String> {
    Comment save(Comment comment);

    void removeCommentById(String id);


    Page<Comment> getCommentsByParentArticle_Id(String parentArticleId, Pageable pageable);

    Page<Comment> getCommentsByAuthor_Username(String authorUsername, Pageable pageable);


    @Query("""
                    select c
                    from Comment c
                    where :#{#search} IS NULL OR  LOWER(c.content) LIKE LOWER(CONCAT('%', :search, '%'))
            
            
            """)
    Page<Comment> findCommentsWithFilter(

            @Param("search") String search, Pageable pageable);

    Optional<Comment> findCommentsById(String id);
}
