package com.noface.newswebapi.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.logging.Level;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationRequest {

    String username;
    String password;
}
