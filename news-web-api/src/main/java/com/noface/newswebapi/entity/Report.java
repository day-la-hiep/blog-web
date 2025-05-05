package com.noface.newswebapi.entity;

import com.noface.newswebapi.cons.CommentReportStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
@NoArgsConstructor
public class Report {
    @Id()
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "org.hibernate.id.UUIDGenerator")
    String id;

    String reason;

    String detail;

    String targetType;

    String reportStatus;

    String targetId;

    LocalDateTime createdAt = LocalDateTime.now();

    LocalDateTime updatedAt = LocalDateTime.now();

    String adminNote;

    @ManyToOne()
    @JoinColumn(name = "authorId")
    User author;
}
