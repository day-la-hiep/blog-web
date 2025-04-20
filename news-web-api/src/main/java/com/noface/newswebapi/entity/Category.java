package com.noface.newswebapi.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.validation.annotation.Validated;

import java.awt.image.ImageProducer;
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

    @Column(name = "slug")
    String slug;

    @Column(name = "description", columnDefinition = "TEXT")
    String description;

    String name;

    boolean isVisible;

    @ManyToOne()
    @JoinColumn(name = "articleId")
    Article article;
}
