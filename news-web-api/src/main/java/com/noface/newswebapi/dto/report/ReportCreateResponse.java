package com.noface.newswebapi.dto.report;

import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReportCreateResponse {
    private String id;
    private String reason;
    private String detail;
    private String targetId;
    private String targetType;
    private String authorUsername;
}
