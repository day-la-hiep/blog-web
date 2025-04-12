package com.noface.newswebapi.repository;

import com.noface.newswebapi.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Category getCategoryByName(String categoryName);
    Optional<Category> getCategoryById(Long id);
    Optional<Category> getCategoryBySlug(String slug);


    @Query("SELECT c FROM Category c WHERE c.id IN (" +
            "SELECT MIN(c2.id) FROM Category c2 GROUP BY c2.slug" +
            ")")
    Page<Category> getDistinctCategory(Pageable pageable);

    boolean existsCategoriesBySlug(String slug);

}
