package com.noface.newswebapi.repository;

import com.noface.newswebapi.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    Optional<Category> getCategoryBySlug(String slug);

    Optional<Category> getCategoryById(String id);
    List<Category> findAll();

    boolean existsBySlug(String slug);

    Optional<Category> getBySlug(String slug);

    @Query("""
                SELECT c
                FROM Category c
                WHERE 
                    (:search IS NULL OR 
                        LOWER(c.id) LIKE LOWER(CONCAT('%', :search, '%')) OR
                        LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR
                        LOWER(c.slug) LIKE LOWER(CONCAT('%', :search, '%')) OR
                        LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%')))
                    AND (:parentId IS NULL OR :parentId = c.parentCategory.id)
                    AND (:active IS NULL OR
                        c.active = :active)
            """)
    Page<Category> findCategoriesByFilter(@Param("search") String search,
                                          @Param("active") Boolean active,
                                          @Param("parentId") String parentId,
                                          Pageable pageable);

    @Modifying
    @Query("UPDATE Category c SET c.parentCategory = null WHERE c.parentCategory.id = :parentId")
    void detachChildren(@Param("parentId") String parentId);

    List<Category> findCategoriesByParentCategory_Slug(String parentCategorySlug);

    List<Category> findCategoriesByParentCategory_SlugAndActive(String parentCategorySlug, Boolean active);
}
