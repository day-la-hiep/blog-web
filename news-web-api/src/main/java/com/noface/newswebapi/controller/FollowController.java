package com.noface.newswebapi.controller;

import com.noface.newswebapi.dto.ApiResponse;
import com.noface.newswebapi.dto.follow.FollowRespone;
import com.noface.newswebapi.dto.follow.UserFollowResponse;
import com.noface.newswebapi.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class FollowController {
    @Autowired
    private FollowService followService;

    @PostMapping("/users/me/following")
    public ApiResponse<FollowRespone> follow(@RequestBody String authorUsername){
        String followerUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        return ApiResponse.<FollowRespone>builder()
                .result(followService.follow(followerUsername, authorUsername))
                .build();
    }

    @DeleteMapping("/users/me/following/{authorUsername}")
    public ApiResponse<FollowRespone> unfollow(@PathVariable String authorUsername){
        String followerUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        return ApiResponse.<FollowRespone>builder()
                .result(followService.unfollow(followerUsername, authorUsername))
                .build();
    }

    @GetMapping("/users/me/followings")
    public ApiResponse<List<UserFollowResponse>> getCurrentFollowings(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy

    ){
        Pageable pageable = PageRequest.of(page, limit,
                Sort.by(Sort.Direction.valueOf(sortBy.startsWith("-") ? "desc" : "asc"),
                        sortBy.replace("+", "")
                                .replace("-", "").trim()));

        String username = SecurityContextHolder
                .getContext().getAuthentication().getName();
        return ApiResponse.<List<UserFollowResponse>>builder()
                .result(followService.getFollowingOf(username, pageable))
                .build();
    }

    @GetMapping("/users/me/followers")
    public ApiResponse<List<UserFollowResponse>> getCurrentFollowers(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy,
            Pageable pageable){
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return ApiResponse.<List<UserFollowResponse>>builder()
                .result(followService.getFollowerOf(username, pageable))
                .build();
    }
}
