package com.noface.newswebapi.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.GenericGenerator;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SavedList {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    String id;

    @Column(nullable = false, unique = true)
    @NotBlank
    String name;

    @ManyToOne
    @JoinColumn(name = "userId")
    @NotNull
    User author;


    @OneToMany(mappedBy = "savedList")
    Set<SavedArticle> savedArticles = new HashSet<>();

}
