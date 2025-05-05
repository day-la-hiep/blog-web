package com.noface.newswebapi.entity;


import com.noface.newswebapi.cons.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @Size(min = 3, message = "INVALID_PASSWORD")
    @Column(name = "password")
    String password;

    @NotBlank
    @Column(name = "firstName")
    String firstName;

    @NotBlank
    @Column(name = "lastName")
    String lastName;

    @Column(name = "mail", unique = true)
    String mail;

    @Column(name = "description", columnDefinition = "TEXT")
    String description;

    String userRole = UserRole.USER.toString();

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<Article> createdArticles = new HashSet<>();

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<Comment> comments = new HashSet<>();

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<Report> reports = new HashSet<>();

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    Set<SavedList> savedLists = new HashSet<>();

}
