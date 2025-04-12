package com.noface.newswebapi.service;

import com.noface.newswebapi.entity.Permission;
import com.noface.newswebapi.repository.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.stream.Stream;

@Service
public class PermissionService {
    @Autowired
    private PermissionRepository permissionRepository;

    @PostMapping
    public Permission savePermission(Permission permission){
        return permissionRepository.save(permission);
    }

    @GetMapping
    public Permission getPermission(String permissionName){
        return permissionRepository.getPermissionsByName(permissionName);
    }

    @GetMapping
    public Stream<Permission> getAllPermissions(){
        return permissionRepository.findAll().stream();
    }
}
