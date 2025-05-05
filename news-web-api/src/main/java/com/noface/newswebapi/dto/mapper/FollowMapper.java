package com.noface.newswebapi.dto.mapper;


import com.noface.newswebapi.dto.follow.FollowRespone;
import com.noface.newswebapi.dto.follow.UserFollowResponse;
import com.noface.newswebapi.entity.Follow;
import com.noface.newswebapi.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface FollowMapper {
    @Mapping(target = "authorUsername", source = "author.username")
    @Mapping(target = "followerUsername", source = "follower.username")
    public FollowRespone toFollowRespone(Follow follow);

    @Mapping(target = "username", source = "follow.author", qualifiedByName = "getFullName")
    public UserFollowResponse toFollowingResponse(Follow follow);

    @Named("getFullName")
    default String getFullname(User user){
        return user.getFirstName() + " " + user.getLastName();
    }
}
