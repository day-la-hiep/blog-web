package com.noface.newswebapi.entity;


import com.noface.newswebapi.cons.ArticleApprovedStatus;
import com.noface.newswebapi.cons.ArticleStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Article {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id")
    String id;
    @Column(name = "name", unique = true, nullable = false)
    @NotBlank
    String name;

    @Column(name = "title")
    String title;
    @Column(name = "summary")
    String summary;

    @Column(name = "content", columnDefinition = "TEXT")
    String content;

    @Column(name = "lastUpdated")
    @DateTimeFormat
    LocalDateTime lastUpdated;

    @Column(name = "thumbnailUrl")
    String thumbnailUrl;

    @OneToMany(mappedBy = "article", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL, orphanRemoval = true)
    Set<ArticleCategory> articleCategories;

    @ManyToOne
    @NotNull
    @JoinColumn(name = "authorId")
    User author;

    @OneToMany(mappedBy = "parentArticle", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL, orphanRemoval = true)
    Set<Comment> comments;

    @OneToMany(mappedBy = "article", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL, orphanRemoval = true)
    Set<SavedArticle> savedArticles;


    @Column()
    LocalDateTime publishedDate;

    @Column()
    LocalDateTime dateCreated;

    @Column()
    String status = ArticleStatus.DRAFT.getName();

    @Column()
    String approvedStatus = ArticleApprovedStatus.NONE.getName();
}
