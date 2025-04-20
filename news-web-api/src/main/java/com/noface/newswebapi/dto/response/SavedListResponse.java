package com.noface.newswebapi.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SavedListResponse {
    Long id;
    String name;
    String authorUsername;
}
