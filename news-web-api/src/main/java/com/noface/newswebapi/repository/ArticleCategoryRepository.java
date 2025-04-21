package com.noface.newswebapi.repository;

import com.noface.newswebapi.entity.ArticleCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleCategoryRepository extends JpaRepository<ArticleCategory, Long> {
    List<ArticleCategory> findArticleCategoryByArticle_Id(String id);
}
