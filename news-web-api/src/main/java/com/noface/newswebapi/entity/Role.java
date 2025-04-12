package com.noface.newswebapi.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.Set;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Role {
    @Id
    @Column(name = "roleName")
    String name;
    @Column(name = "description")
    String description;
    @ManyToMany
    @JoinTable(
            name = "users_role",
            joinColumns = @JoinColumn(name = "roleName"),
            inverseJoinColumns = @JoinColumn(name = "userId")
    )
    Set<User> user;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "roles_permissions",
            joinColumns = @JoinColumn(name = "roleName"),
            inverseJoinColumns = @JoinColumn(name = "permissionName"))
    Set<Permission> permissions;
}
