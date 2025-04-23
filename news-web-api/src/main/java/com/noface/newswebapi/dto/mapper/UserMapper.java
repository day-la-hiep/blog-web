package com.noface.newswebapi.dto.mapper;

import com.noface.newswebapi.dto.request.UserCreateRequest;
import com.noface.newswebapi.dto.request.UserUpdateRequest;
import com.noface.newswebapi.dto.response.UserCreateRespone;
import com.noface.newswebapi.dto.response.UserRespone;
import com.noface.newswebapi.entity.User;
import org.mapstruct.*;

@Mapper (componentModel = "spring")
public interface UserMapper {
    public User asUser(UserCreateRequest userCreateRequest);
    public User asUser(UserUpdateRequest userUpdateRequest);
    public UserCreateRespone toUserCreateResponse(User user);
    public UserRespone toUserRespone(User user);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "createdArticles", ignore = true)
    public User updateuser(@MappingTarget User user, User updateUser);
}
