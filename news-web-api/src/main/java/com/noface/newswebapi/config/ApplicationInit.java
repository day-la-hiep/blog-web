package com.noface.newswebapi.config;

import com.noface.newswebapi.entity.Permission;
import com.noface.newswebapi.entity.Role;
import com.noface.newswebapi.entity.User;
import com.noface.newswebapi.repository.PermissionRepository;
import com.noface.newswebapi.repository.UserRepository;
import com.noface.newswebapi.service.PermissionService;
import com.noface.newswebapi.service.RoleService;
import com.noface.newswebapi.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.List;

@Configuration
@Slf4j
public class ApplicationInit {
    @Autowired
    UserService userService;
    @Autowired
    RoleService roleService;
    @Autowired
    PermissionService permissionService;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    UserRepository userRepository;

    @Bean
    ApplicationRunner init(PermissionRepository permissionRepository) {
        ApplicationRunner runner = args -> {
            List<Role> roles = List.of(
                    Role.builder().name("ADMIN").permissions(new HashSet<>()).build(),
                    Role.builder().name("USER").permissions(new HashSet<>()).build(),
                    Role.builder().name("MODERATOR").permissions(new HashSet<>()).build()
            );
            for (Role role : roles) {
                if (roleService.existedByName(role.getName()) == false) {
                    roleService.saveRole(role);
                }
            }

//                List<Permission> permissions = List.of(
//                        Permission.builder()
//                                .name("GET_ALL_USERS")
//                                .description("Get all users from database")
//                                .build(),
//                        Permission.builder()
//                                .name("UPDATE_ALL_USERS")
//                                .description("Update all users from database")
//                                .build(),
//                        Permission.builder()
//                                .name("DELETE_ANY_USER")
//                                .description("Delete any users from database")
//                                .build()
//
//                );

//                for(Permission permission : permissions){
//                    permissionService.savePermission(permission);
//                }

            Role adminRole = roleService.getRoleWithPermission("ADMIN");
//                permissions = permissionService.getAllPermissions().toList();
//                for(Permission permission : permissions){
//                    adminRole.getPermissions().add(permission);
//                }


            roleService.saveRole(adminRole);
            if (userService.userExisted("admin") == false) {
                User user = User.builder().username("admin").password("admin").build();
                user.getRoles().add(adminRole);
                userRepository.save(user);
            }

        };
        return runner;
    }

}
