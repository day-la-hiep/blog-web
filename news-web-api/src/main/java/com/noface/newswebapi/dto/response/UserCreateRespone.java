package com.noface.newswebapi.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreateRespone {
    String id;

    String username;


    String fullname;

    String mail;

    String position;

    String description;
    String role;
}
