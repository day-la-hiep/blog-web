package com.noface.newswebapi.repository;

import com.noface.newswebapi.entity.SavedList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedListRepository extends JpaRepository<SavedList, String> {
    List<SavedList> findAllByAuthor_Username(String username);

    @Query("""
        select sl
        from SavedList sl
        where sl.author.username = :username
        and (
            :#{#search} is null or 
            lower(sl.id) like lower(concat('%', :search, '%')) or 
            lower(sl.name) like lower(concat('%', :search, '%'))
        )
        """)
    Page<SavedList> findSavedListsWithFilter(String username, String search, Pageable pageable);

@Query("""
    select sl
    from SavedArticle sa
    join sa.savedList sl on sa.savedList.id = sl.id 
    where sa.article.id = :articleId
    and sa.savedList.author.username = :username
""")
    Page<SavedList> findSavedListsByArticle(@Param("username") String username,
                                            @Param("articleId") String articleId, Pageable pageable);
}
