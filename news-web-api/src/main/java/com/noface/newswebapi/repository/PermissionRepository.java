package com.noface.newswebapi.repository;

import com.noface.newswebapi.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
    Permission getPermissionsByName(String permissionName);
    List<Permission> findAll();
}
