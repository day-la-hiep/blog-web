package com.noface.newswebapi.controller;

import com.noface.newswebapi.dto.PagedResult;
import com.noface.newswebapi.dto.user.*;
import com.noface.newswebapi.dto.ApiResponse;
import com.noface.newswebapi.dto.mapper.UserMapper;
import com.noface.newswebapi.service.ArticleService;
import com.noface.newswebapi.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequestMapping("/api")
@Data
@Builder
@Slf4j
@Tag(name = "User Management", description = "Endpoints for managing users")
public class UserController {
    @Autowired
    UserService userService;
    @Autowired
    UserMapper userMapper;
    @Autowired
    private ArticleService articleService;

    @PostMapping("/users")
    public ApiResponse<UserCreateRespone> createUser(@RequestBody UserCreateRequest request) {
        UserCreateRespone userCreateRespone = userService.createUser(request);
        return ApiResponse.<UserCreateRespone>builder().result(userCreateRespone).build();
    }

    @GetMapping("/users/{username}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or authentication.name == #username or #username == 'me'")
    public ApiResponse<UserRespone> getUserById(@PathVariable String username) {
        if (username.equals("me")) {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        }
        UserRespone userRespone = userService.getUserByUsername(username);
        ApiResponse<UserRespone> response = ApiResponse.<UserRespone>builder().result(userRespone).build();
        return response;
    }

    @PutMapping("/users/{username}/password")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or authentication.name == #username or #username == 'me'")
    public ApiResponse<UserRespone> updatePassword(@PathVariable String username, @RequestBody PasswordChangeRequest request) {
        if(username.equals("me")){
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        }
        UserRespone userRespone = userService.changePassword(username, request);
        return ApiResponse.<UserRespone>builder().result(userRespone).build();
    }

    @PutMapping("/users/{username}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or authentication.name == #username or #username == 'me'")
    public ApiResponse<UserRespone> updateUser(@PathVariable String username, @RequestBody UserUpdateRequest request) {
        if (username.equals("me")) {
            username = SecurityContextHolder.getContext().getAuthentication().getName();
        }
        UserRespone userRespone = userService.updateUserByUsername(username, request);
        return ApiResponse.<UserRespone>builder().result(userRespone).build();
    }

    @GetMapping("/public/users/{username}")
    public ApiResponse<UserRespone> getUserByUsername(@PathVariable String username) {
        UserRespone userRespone = userService.getUserByUsername(username);
        return ApiResponse.<UserRespone>builder().result(userRespone).build();
    }

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<PagedResult<UserRespone>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int limit,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(required = false) String search) {
        Pageable pageable = PageRequest.of(page, limit,
                Sort.by(Sort.Direction.fromString(
                                sortBy.startsWith("-") ? "desc" : "asc"),
                        sortBy.replace("-", "")
                                .replace("+", "").trim()));

        PagedResult<UserRespone> userRespones = userService.getUsers(search, pageable);

        ApiResponse<PagedResult<UserRespone>> response = ApiResponse.<PagedResult<UserRespone>>builder()
                .result(userRespones)
                .build();

        return response;
    }



    @DeleteMapping("/users/{username}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or authentication.name == #username")
    public ApiResponse<UserDeleteResponse> deleteUser(@PathVariable String username) {
        log.info("DELETE USER {}", username);
        return ApiResponse.<UserDeleteResponse>builder().result(userService.deleteUser(username)).build();
    }





    @PutMapping("/users/{username}/roles")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<RoleUpdateResponse> updateUserRole(@PathVariable String username, @RequestBody RoleUpdateRequest request) {
        return ApiResponse.<RoleUpdateResponse>builder()
                .result(userService.updateRole(username, request))
                .build();
    }



}
