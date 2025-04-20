package com.noface.newswebapi.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
public class Comment {

    @Id()
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    String id;
    @Column()
    @NotEmpty()
    String content;

    @Column()
    @DateTimeFormat()
    LocalDateTime createdAt;

    @Column()
    @DateTimeFormat()
    LocalDateTime updatedAt;


    @ManyToOne()
    @JoinColumn(name = "parentArticleId")
    @NotNull
    Article parentArticle;

    @ManyToOne()
    @JoinColumn(name = "userId")
    User author;


}
