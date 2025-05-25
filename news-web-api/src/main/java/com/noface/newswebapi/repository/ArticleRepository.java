package com.noface.newswebapi.repository;

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

    @Query("""
                SELECT a
                FROM Article a
                JOIN User u ON a.author = u
                WHERE (:#{#search} IS NULL OR 
                    LOWER(a.id) LIKE LOWER(CONCAT('%', :search, '%')) OR 
                    LOWER(a.title) LIKE LOWER(CONCAT('%', :search, '%')) OR 
                    LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR 
                    LOWER(u.id) LIKE LOWER(CONCAT('%', :search, '%')) OR 
                    LOWER(concat(u.firstName, ' ', u.lastName) ) LIKE LOWER(CONCAT('%', :search, '%')) 
                    
                )
                AND (:#{#updateStartDate} IS NULL OR a.lastUpdated >= :#{#updateStartDate})
                AND (:#{#updateEndDate} IS NULL OR a.lastUpdated <= :#{#updateEndDate})
                AND (:#{#publishedStartDate} IS NULL OR a.publishedDate >= :#{#publishedStartDate})
                AND (:#{#publishedEndDate} IS NULL OR a.publishedDate <= :#{#publishedEndDate})
                AND (:#{#status} IS NULL OR a.status = :#{#status})
                AND (:#{#approvedStatus} IS NULL OR a.approvedStatus = :#{#approvedStatus})
            """)
    Page<Article> findArticles(
            @Param("search") String search,
            @Param("updateStartDate") LocalDateTime updateStartDate,
            @Param("updateEndDate") LocalDateTime updateEndDate,
            @Param("publishedStartDate") LocalDateTime publishedStartDate,
            @Param("publishedEndDate") LocalDateTime publishedEndDate,
            @Param("status") String status,
            @Param("approvedStatus") String approvedStatus,
            Pageable pageable);


    @Query("""
            SELECT a
            FROM Article a
            JOIN ArticleCategory b ON b.article = a
            WHERE 
                (:#{#search} IS NULL OR 
                LOWER(a.id) LIKE LOWER(CONCAT('%', :search, '%')) OR 
                LOWER(a.title) LIKE LOWER(CONCAT('%', :search, '%')))
            AND (:#{#updateStartDate} IS NULL OR a.lastUpdated >= :#{#updateStartDate})
            AND (:#{#updateEndDate} IS NULL OR a.lastUpdated <= :#{#updateEndDate})
            AND (:#{#publishedStartDate} IS NULL OR a.publishedDate >= :#{#publishedStartDate})
            AND (:#{#publishedEndDate} IS NULL OR a.publishedDate <= :#{#publishedEndDate})
            AND (:#{#status} IS NULL OR a.status = :#{#status})
            AND (:#{#approvedStatus} IS NULL OR a.approvedStatus = :#{#approvedStatus})
            AND  b.category.id = :#{#categoryId}
            
            """)
    Page<Article> findArticlesByCategoryId(
            @Param("search") String search,
            @Param("updateStartDate") LocalDateTime updateStartDate,
            @Param("updateEndDate") LocalDateTime updateEndDate,
            @Param("publishedStartDate") LocalDateTime publishedStartDate,
            @Param("publishedEndDate") LocalDateTime publishedEndDate,
            @Param("categoryId") String categoryId,
            @Param("status") String status,
            @Param("approvedStatus") String approvedStatus,
            Pageable pageable);

    @Query("""
                SELECT a
                FROM Article a
                WHERE 
                    (:#{#search} IS NULL OR 
                    LOWER(a.id) LIKE LOWER(CONCAT('%', :search, '%')) OR 
                    LOWER(a.title) LIKE LOWER(CONCAT('%', :search, '%')))
                AND (:#{#updateStartDate} IS NULL OR a.lastUpdated >= :#{#updateStartDate})
                AND (:#{#updateEndDate} IS NULL OR a.lastUpdated <= :#{#updateEndDate})
                AND (:#{#publishedStartDate} IS NULL OR a.publishedDate >= :#{#publishedStartDate})
                AND (:#{#publishedEndDate} IS NULL OR a.publishedDate <= :#{#publishedEndDate})
                AND (:#{#status} IS NULL OR a.status = :#{#status})
                AND (:#{#approvedStatus} IS NULL OR a.approvedStatus = :#{#approvedStatus})
                AND (:#{#username} IS NULL OR a.author.username = :#{#username})        
            """)
    Page<Article> findArticlesWithUsernameAndFilter(
            @Param("search") String search,
            @Param("updateStartDate") LocalDateTime updateStartDate,
            @Param("updateEndDate") LocalDateTime updateEndDate,
            @Param("publishedStartDate") LocalDateTime publishedStartDate,
            @Param("publishedEndDate") LocalDateTime publishedEndDate,
            @Param("username") String username,
            @Param("status") String status,
            @Param("approvedStatus") String approvedStatus,
            Pageable pageable
    );

    List<Article> findArticlesByAuthorUsernameAndNameStartingWith(String authorUsername, String name);

    List<Article> findArticlesByAuthorUsernameAndName(String authorUsername, String name);
}
