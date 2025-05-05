package com.noface.newswebapi.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SavedArticle {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    String id;

    @ManyToOne
    @JoinColumn(name = "savedListId")
    @NotNull
    SavedList savedList;

    @ManyToOne
    @JoinColumn(name = "articleId")
    @NotNull
    Article article;

    @Column
    @DateTimeFormat
    LocalDateTime createdAt = LocalDateTime.now();
}
