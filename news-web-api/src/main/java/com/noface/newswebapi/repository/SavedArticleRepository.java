package com.noface.newswebapi.repository;

import com.noface.newswebapi.entity.SavedArticle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SavedArticleRepository  extends JpaRepository<SavedArticle, String> {
    boolean existsByArticle_IdAndSavedList_Id(String articleId, String savedListId);


    @Query("""
        SELECT sa
        FROM SavedArticle sa
        where sa.savedList.id = :listId
        and (
            :#{#search} IS NULL OR 
            LOWER(sa.article.id) LIKE LOWER(CONCAT('%', :search, '%')) OR 
            LOWER(sa.article.title) LIKE LOWER(CONCAT('%', :search, '%'))
        )


""")
    Page<SavedArticle> findSavedArticlesWithFilter(
            @Param("listId") String listId,
            @Param("search") String search,
            Pageable pageable);

    void removeSavedArticleByArticle_IdAndSavedList_Id(String articleId, String savedListId);
}
