package com.noface.newswebapi.controller;

import com.noface.newswebapi.dto.request.UserCreateRequest;
import com.noface.newswebapi.dto.request.UserUpdateRequest;
import com.noface.newswebapi.dto.response.ApiResponse;
import com.noface.newswebapi.dto.response.UserCreateRespone;
import com.noface.newswebapi.dto.response.UserRespone;
import com.noface.newswebapi.entity.User;
import com.noface.newswebapi.mapper.UserMapper;
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
import java.util.stream.Stream;

@RestController
@RequiredArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequestMapping("/api/users")
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

    @PostMapping()
    @PermitAll()
    public ApiResponse<UserCreateRespone> createUser(@RequestBody UserCreateRequest request) {
        User user = userService.createUser(userMapper.asUser(request));
        return ApiResponse.<UserCreateRespone>builder().result(userMapper.toUserCreateResponse(user)).build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or @userService.ownUserProfile(#id, authentication.name)")
    public ApiResponse<UserRespone> getUserById(@PathVariable String id) {
        UserRespone userRespone = userService.getUserById(id);
        ApiResponse<UserRespone> response = ApiResponse.<UserRespone>builder().result(userRespone).build();
        return response;
    }

    @GetMapping()
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<List<UserRespone>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortProperty,
            @RequestParam(defaultValue = "asc") String sortDirection,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String fullname,
            @RequestParam(required = false) String email) {

        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.fromString(sortDirection.toUpperCase()), sortProperty));

        Stream<User> users = userService.getUsers(pageable)
                .filter(user -> (username == null || user.getUsername().toLowerCase().contains(username.toLowerCase())))
                .filter(user -> (fullname == null || user.getFullname().toLowerCase().contains(fullname.toLowerCase())))
                .filter(user -> (email == null || user.getMail().toLowerCase().contains(email.toLowerCase())));

        ApiResponse<List<UserRespone>> response = ApiResponse.<List<UserRespone>>builder()
                .result(users.map(userMapper::toUserRespone).toList())
                .build();

        return response;
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') || @userService.ownUserProfile(#id, authentication.name)")
    public ApiResponse<UserRespone> updateUserById(@PathVariable String id, @RequestBody UserUpdateRequest request) {

        UserRespone response = userService.updateUserById(id, userMapper.asUser(request));
        return ApiResponse.<UserRespone>builder().result(response).build();
    }




    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ApiResponse<UserRespone> deleteUser(@PathVariable String id) {
        log.info("DELETE USER {}", id);
        return ApiResponse.<UserRespone>builder().result(userService.removeUser(id)).build();
    }



}
