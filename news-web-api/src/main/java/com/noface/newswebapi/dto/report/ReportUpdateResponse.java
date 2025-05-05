package com.noface.newswebapi.dto.report;

import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReportUpdateResponse {
    String id;
    String reason;
    String detail;
    String targetId;
    String authorUsername;
    String adminNote;
    String status;
}
