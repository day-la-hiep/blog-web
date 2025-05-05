package com.noface.newswebapi.dto.mapper;

import com.noface.newswebapi.dto.user.UserCreateRequest;
import com.noface.newswebapi.dto.user.UserUpdateRequest;
import com.noface.newswebapi.dto.user.UserCreateRespone;
import com.noface.newswebapi.dto.user.UserRespone;
import com.noface.newswebapi.entity.User;
import org.mapstruct.*;

@Mapper (componentModel = "spring")
public interface UserMapper {
    public User asUser(UserCreateRequest userCreateRequest);
    public User asUser(UserUpdateRequest userUpdateRequest);
    public UserCreateRespone toUserCreateResponse(User user);
    public UserRespone toUserRespone(User user);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "createdArticles", ignore = true)
    public User updateuser(@MappingTarget User user, User updateUser);

    @Named("toFullName")
    default public String toFullName(User user){
        return user.getFirstName() + " " + user.getLastName();
    }
}
