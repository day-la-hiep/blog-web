package com.noface.newswebapi.dto.follow;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FollowRespone {
    String followerUsername;
    String authorUsername;

}
