package com.noface.newswebapi.controller;

import com.noface.newswebapi.dto.request.UserCreateRequest;
import com.noface.newswebapi.dto.request.UserUpdateRequest;
import com.noface.newswebapi.dto.response.ApiResponse;
import com.noface.newswebapi.dto.response.UserCreateRespone;
import com.noface.newswebapi.dto.response.UserRespone;
import com.noface.newswebapi.dto.mapper.UserMapper;
import com.noface.newswebapi.service.ArticleService;
import com.noface.newswebapi.service.UserService;
import jakarta.annotation.security.PermitAll;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequestMapping("/api")
@Data
@Builder
@Slf4j
public class UserController {
    @Autowired
    UserService userService;
    @Autowired
    UserMapper userMapper;
    @Autowired
    private ArticleService articleService;

    @PostMapping("/users")
    @PermitAll()
    public ApiResponse<UserCreateRespone> createUser(@RequestBody UserCreateRequest request) {
        UserCreateRespone userCreateRespone = userService.createUser(request);
        return ApiResponse.<UserCreateRespone>builder().result(userCreateRespone).build();
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or @userService.ownUserProfile(#id, authentication.name)")
    public ApiResponse<UserRespone> getUserById(@PathVariable String id) {
        UserRespone userRespone = userService.getUserById(id);
        ApiResponse<UserRespone> response = ApiResponse.<UserRespone>builder().result(userRespone).build();
        return response;
    }

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<List<UserRespone>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(required = false) String search) {

        Pageable pageable = PageRequest.of(page, limit,
                Sort.by(Sort.Direction.fromString(
                        sortBy.startsWith("-") ? "desc" : "asc"),
                        sortBy.replace("-", "")
                        .replace("+", "").trim()));

        List<UserRespone> userRespones = userService.getUsers(search, pageable);

        ApiResponse<List<UserRespone>> response = ApiResponse.<List<UserRespone>>builder()
                .result(userRespones)
                .build();

        return response;
    }


    @PutMapping("/users/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') || @userService.ownUserProfile(#id, authentication.name)")
    public ApiResponse<UserRespone> updateUserById(@PathVariable String id, @RequestBody UserUpdateRequest request) {

        UserRespone response = userService.updateUserById(id, userMapper.asUser(request));
        return ApiResponse.<UserRespone>builder().result(response).build();
    }


    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<UserRespone> deleteUser(@PathVariable String id) {
        log.info("DELETE USER {}", id);
        return ApiResponse.<UserRespone>builder().result(userService.removeUser(id)).build();
    }

    @GetMapping("/users/me")
    public ApiResponse<UserRespone> getCurrentUser() {
        return ApiResponse.<UserRespone>builder()
                .result(userService.getCurrentUser())
                .build();
    }

    @PutMapping("/users/me")
    public ApiResponse<UserRespone> updateCurrentUser(@RequestBody UserUpdateRequest request) {
        return ApiResponse.<UserRespone>builder()
                .result(userService.updateCurrentUser(request))
                .build();
    }


}
