package com.noface.newswebapi.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.logging.Level;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class    IntrospectRequest {
    String token;
}
