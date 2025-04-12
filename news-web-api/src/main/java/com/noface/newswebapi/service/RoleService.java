package com.noface.newswebapi.service;


import com.noface.newswebapi.entity.Role;
import com.noface.newswebapi.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;
    @GetMapping
    public Role getRole(String roleName){
        return roleRepository.getRoleByName(roleName);
    }

    @PostMapping
    public Role saveRole(Role role){
        return roleRepository.save(role);
    }

    @GetMapping
    public Role getRoleWithPermission(String roleName){
        return roleRepository.getRoleByNameWithPermissions(roleName);
    }

    public boolean existedByName(String name) {
        return roleRepository.existsByName(name);
    }
}
