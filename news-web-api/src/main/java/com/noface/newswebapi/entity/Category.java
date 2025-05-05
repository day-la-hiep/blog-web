package com.noface.newswebapi.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.validator.constraints.UniqueElements;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;

import java.awt.image.ImageProducer;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Category {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    String id;

    @Column
    @NotBlank
    String name;

    @Column(name = "slug", unique = true, nullable = false)
    String slug;

    @Column(name = "description", columnDefinition = "TEXT")
    String description;

    @Column
    Boolean active = false;

    @ManyToOne()
    @JoinColumn(name = "parentCategoryId")
    Category parentCategory;

    @Column
    @DateTimeFormat
    LocalDateTime createdAt;

    @Column
    @DateTimeFormat
    LocalDateTime updatedAt;


    @OneToMany(mappedBy = "parentCategory", cascade = CascadeType.ALL, orphanRemoval = false)
    List<Category> childrenCategories = new ArrayList<>();


    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL, orphanRemoval = false)

    Set<ArticleCategory> articleCategories;
}
