package com.noface.newswebapi.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.GenericGenerator;

import java.util.HashSet;
import java.util.Set;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "users")
public class User {
    public static final String TABLE_NAME = "users";
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    private String id;

    @Size(min = 3, message = "INVALID_USERNAME")
        @Column(name = "username", unique = true)
    String username;

    @Column(name = "password")
    String password;

    @Column(name = "firstName")
    String firstName;

    @Column(name = "lastName")
    String lastName;

    @Column(name = "mail", unique = true)
    String mail;

    @Column(name = "description", columnDefinition = "TEXT")
    String description;

    @ManyToMany()
    @JoinTable(
            name = "user_role",
            joinColumns = @JoinColumn(name = "userId"),
            inverseJoinColumns = @JoinColumn(name = "roleName")
    )
    Set<Role> roles;


    @OneToMany(mappedBy = "author")
    Set<Article> createdArticles = new HashSet<>();

    @OneToMany(mappedBy = "author")
    Set<Comment> comments = new HashSet<>();

    @OneToMany(mappedBy = "author")
    Set<SavedList> savedLists = new HashSet<>();

}
