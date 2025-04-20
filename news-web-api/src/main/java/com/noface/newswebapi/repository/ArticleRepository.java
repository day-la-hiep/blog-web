package com.noface.newswebapi.repository;

import com.noface.newswebapi.cons.ArticleStatus;
import com.noface.newswebapi.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, String> {
    Optional<Article> getArticleById(String articleId);

    @Query("SELECT a FROM Article a LEFT JOIN FETCH a.categories WHERE a.id = ?1")
    Optional<Article> getArticleByIdWithCategories(String articleId);
    @Query("""
                SELECT a
                FROM Article a
                WHERE
                    (:username IS NULL OR :username = a.author.username)
                    AND (:authorName IS NULL OR :authorName = '' OR a.author.fullname LIKE CONCAT('%', :authorName, '%'))
                    AND (:title IS NULL OR a.title LIKE CONCAT('%', :title, '%'))
                    AND (:id IS NULL OR CAST(a.id as string) LIKE CONCAT('%', :id, '%'))
                    AND (:startDate IS NULL OR a.dateCreated >= :startDate)
                    AND (:endDate IS NULL OR a.dateCreated <= :endDate)
                    AND (:status IS NULL OR a.status = :status)
            """)
    Page<Article> findArticlesWithFilter(
            @Param("id") String id,
            @Param("title") String title,
            @Param("username") String username,
            @Param("authorName") String authorName,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("status") ArticleStatus status,
            Pageable pageable
    );


    @Query("SELECT COUNT(*) FROM Article a WHERE " +
            "((:username IS NULL) OR (:username = a.author.username)) AND" +
            "((:authorName IS NULL OR :authorName = '') OR (a.author.fullname LIKE CONCAT('%', :authorName, '%')) ) AND" +
            "((:title IS NULL OR (a.title LIKE CONCAT('%', :title, '%'))) OR " +
            "(:id IS NULL OR (CAST(a.id AS STRING) LIKE CONCAT('%', :id, '%')))) AND " +
            "(:startDate IS NULL OR a.dateCreated >= :startDate) AND " +
            "(:endDate IS NULL OR a.dateCreated <= :endDate) AND " +
            "(:status IS NULL OR a.status = :status)"
    )
    long getNumberOfArticle(String title, Long id, ArticleStatus status, String username,
                            LocalDateTime startDate, LocalDateTime endDate,
                            String authorName);
    Page<Article> findArticlesByAuthor_Username(String username, Pageable pageable);

    Page<Article> getArticleByAuthor_Id(String authorId, Pageable pageable);

    List<Article> findArticlesByTitleContainingAndDateCreatedAfterAndDateCreatedBeforeAndStatus(String title, LocalDateTime dateCreatedAfter, LocalDateTime dateCreatedBefore, ArticleStatus status, Pageable pageable);


    Page<Article> findArticlesByIdContainingAndTitleContainingAndDateCreatedAfterAndDateCreatedBeforeAndStatus(String id, String title, LocalDateTime dateCreatedAfter, LocalDateTime dateCreatedBefore, ArticleStatus status, Pageable pageable);
}
