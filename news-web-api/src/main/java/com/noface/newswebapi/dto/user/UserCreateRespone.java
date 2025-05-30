package com.noface.newswebapi.dto.user;

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


    String firstName;
    String lastName;

    String mail;


    String description;
    String role;
}
