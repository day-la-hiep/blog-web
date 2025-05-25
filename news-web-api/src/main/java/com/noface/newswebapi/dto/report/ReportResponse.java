package com.noface.newswebapi.dto.report;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReportResponse {
    private String id;
    private String reason;
    private String detail;
    private String targetId;
    private String targetType;
    private String authorUsername;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
