package com.noface.newswebapi.repository;

import com.noface.newswebapi.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
    Optional<Role> getRoleByName(String roleAdmin);

    @Query("SELECT r FROM Role r LEFT JOIN FETCH r.permissions WHERE r.name = ?1")
    Role getRoleByNameWithPermissions(String roleName);

    boolean existsByName(String name);
}
