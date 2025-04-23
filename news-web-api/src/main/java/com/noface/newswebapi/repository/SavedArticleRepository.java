package com.noface.newswebapi.repository;

import com.noface.newswebapi.entity.SavedArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SavedArticleRepository  extends JpaRepository<SavedArticle, String> {
    boolean existsByArticle_IdAndSavedList_Id(String articleId, String savedListId);
}
