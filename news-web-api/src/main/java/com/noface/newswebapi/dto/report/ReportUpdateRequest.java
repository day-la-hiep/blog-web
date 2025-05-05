package com.noface.newswebapi.dto.report;

import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReportUpdateRequest {
    String adminNote;
    String status;
}
