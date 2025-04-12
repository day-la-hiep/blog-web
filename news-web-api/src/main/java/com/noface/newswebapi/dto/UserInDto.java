package com.noface.newswebapi.dto;

import org.mapstruct.Mapper;

@Mapper
public class UserInDto {
    private Long id;

    private String username;

    private String password;

    private String fullname;

    private String mail;


    private String description;
}
