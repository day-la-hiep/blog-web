package com.noface.newswebapi.service;

import com.noface.newswebapi.dto.mapper.FollowMapper;
import com.noface.newswebapi.dto.response.FollowRespone;
import com.noface.newswebapi.dto.response.UserFollowResponse;
import com.noface.newswebapi.entity.Follow;
import com.noface.newswebapi.entity.User;
import com.noface.newswebapi.exception.AppException;
import com.noface.newswebapi.exception.ErrorCode;
import com.noface.newswebapi.repository.FollowRepository;
import com.noface.newswebapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FollowService {
    @Autowired
    private FollowRepository followRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FollowMapper followMapper;

    public FollowRespone follow(String followerUsername, String authorUsername){
        User author = userRepository.findByUsername(authorUsername)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        User follower = userRepository.findByUsername(followerUsername)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Follow follow = Follow.builder()
                .author(author)
                .follower(follower)
                .build();

        return followMapper.toFollowRespone(followRepository.save(follow));
    }

    public FollowRespone unfollow(String followerUsername, String authorUsername) {
        User author = userRepository.findByUsername(authorUsername)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        User follower = userRepository.findByUsername(followerUsername)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Follow follow = followRepository
                .findByFollower_UsernameAndAuthor_Username(followerUsername, authorUsername);
        followRepository.delete(follow);
        return followMapper.toFollowRespone(follow);
    }

    public List<UserFollowResponse> getFollowingOf(String followerUsername, Pageable pageable){
        Page<Follow> followings = followRepository
                .getFollowsByFollower_Username(followerUsername, pageable);
        return followings.stream()
                .map(follow -> followMapper.toFollowingResponse(follow))
                .collect(Collectors.toList());
    }

    public List<UserFollowResponse> getFollowerOf(String authorUsername, Pageable pageable) {
        Page<Follow> followers = followRepository
                .getFollowsByAuthor_Username(authorUsername, pageable);
        return followers.stream()
                .map(follow -> followMapper.toFollowingResponse(follow))
                .collect(Collectors.toList());
    }
}
