package com.noface.newswebapi.repository;

import com.noface.newswebapi.cons.ArticleStatus;
import com.noface.newswebapi.dto.ArticleOverview;
import com.noface.newswebapi.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, String> {
    Optional<Article> getArticleById(String articleId);

    @Query("""
    SELECT NEW com.noface.newswebapi.dto.ArticleOverview(
        a.id, 
        a.title, 
        a.summary,
        a.dateCreated,
        a.lastUpdated,
        a.author.fullname,
        a.status,
        a.thumbnailUrl
    )
    FROM Article a 
    LEFT JOIN a.author
    WHERE (:#{#id} IS NULL OR a.id LIKE %:#{#id}%) 
    AND (:#{#title} IS NULL OR a.title LIKE %:#{#title}%)
    AND (:#{#startDate} IS NULL OR a.dateCreated >= :#{#startDate})
    AND (:#{#endDate} IS NULL OR a.dateCreated <= :#{#endDate})
    AND (:#{#status} IS NULL OR a.status = :#{#status})
""")
    Page<ArticleOverview> findArticlesWithAuthor(
            @Param("id") String id,
            @Param("title") String title,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("status") String status,
            Pageable pageable);

    @Query("""
    SELECT COUNT(a)
    FROM Article a
    LEFT JOIN a.author
    WHERE (:#{#id} IS NULL OR a.id LIKE %:#{#id}%)
    AND (:#{#title} IS NULL OR a.title LIKE %:#{#title}%)
    AND (:#{#startDate} IS NULL OR a.dateCreated >= :#{#startDate})
    AND (:#{#endDate} IS NULL OR a.dateCreated <= :#{#endDate})
    AND (:#{#status} IS NULL OR a.status = :#{#status})
""")
    long countArticlesWithFilters(
            @Param("id") String id,
            @Param("title") String title,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("status") String status);
    Page<Article> findArticlesByAuthor_Username(String username, Pageable pageable);

    Page<Article> getArticleByAuthor_Id(String authorId, Pageable pageable);



}
