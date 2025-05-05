package com.noface.newswebapi.dto.report;

import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReportCreateRequest {
    String reason;
    String detail;
    String targetType;
    String targetId;
}
