package com.noface.newswebapi.repository;

import com.noface.newswebapi.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String> {
    Comment save(Comment comment);

    void removeCommentById(String id);


    Page<Comment> getCommentsByParentArticle_Id(String parentArticleId, Pageable pageable);

    Page<Comment> getCommentsByAuthor_Username(String authorUsername, Pageable pageable);


    @EntityGraph(attributePaths = {"parentArticle", "author"})
    @Query("""
                SELECT c FROM Comment c 
                JOIN Article a  on c.parentArticle = a
                WHERE (:search IS NULL OR LOWER(c.content) LIKE LOWER(CONCAT('%', :search, '%'))
                            OR LOWER(a.title) LIKE LOWER(CONCAT('%', :search, '%'))
                            OR LOWER(c.author.username) LIKE LOWER(CONCAT('%', :search, '%'))
                            OR LOWER(c.author.firstName) LIKE LOWER(CONCAT('%', :search, '%'))
                                        or lower(c.id) like lower(concat('%', :search, '%')) )
                            AND (:startDate IS NULL OR c.createdAt >= :startDate)
                            AND (:endDate IS NULL OR c.createdAt <= :endDate)
            """)
    Page<Comment> findCommentsWithFilter(@Param("search") String search,
                                         @Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate,
                                         Pageable pageable);

    Optional<Comment> findCommentsById(String id);
}
