package com.noface.newswebapi.repository;

import com.noface.newswebapi.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findById(String id);
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    void removeUserById(String id);
    List<User> findAll();
    Page<User> findAll(Pageable pageable);
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.username = ?1")
    Optional<User> findUserByUsernameWithRoles(String username);


    @Query("""
    SELECT u FROM User u
    WHERE 
        (:search IS NULL OR 
        LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR 
        LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR 
        LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR 
        LOWER(u.mail) LIKE LOWER(CONCAT('%', :search, '%')))
""")
    Page<User> findAllWithFilters(@Param("search") String search, Pageable pageable);

}
