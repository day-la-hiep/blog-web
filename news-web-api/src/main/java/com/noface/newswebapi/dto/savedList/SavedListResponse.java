package com.noface.newswebapi.dto.savedList;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@AllArgsConstructor
@Data
@Builder
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SavedListResponse {
    String id;
    String name;
    String authorUsername;
    List<String> articleIds;
}
