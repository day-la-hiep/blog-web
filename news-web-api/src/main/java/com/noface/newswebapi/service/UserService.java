package com.noface.newswebapi.service;

import com.noface.newswebapi.cons.UserRole;
import com.noface.newswebapi.controller.RoleUpdateResponse;
import com.noface.newswebapi.dto.PagedResult;
import com.noface.newswebapi.dto.user.*;
import com.noface.newswebapi.entity.User;
import com.noface.newswebapi.exception.AppException;
import com.noface.newswebapi.exception.ErrorCode;
import com.noface.newswebapi.dto.mapper.UserMapper;
import com.noface.newswebapi.repository.RoleRepository;
import com.noface.newswebapi.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@NoArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    UserMapper userMapper;
    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    public UserCreateRespone createUser(UserCreateRequest userCreateRequest) {
        User user = userMapper.asUser(userCreateRequest);
        if(userRepository.existsByUsername(user.getUsername())){
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));

//        User user = userRepository.save
        user.setUserRole(UserRole.USER.name());
        return userMapper.toUserCreateResponse(userRepository.save(user));

    }

    public UserRespone getUserById(String id){
        User user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toUserRespone(user);
    }

    public UserRespone updateUserByUsername(String username, UserUpdateRequest userUpdateRequest) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        userMapper.updateuser(user, userMapper.asUser(userUpdateRequest));
        userRepository.save(user);
        return userMapper.toUserRespone(user);
    }

    public RoleUpdateResponse updateRole(String username, RoleUpdateRequest request){
        UserRole roleValue;
        try{
            roleValue = UserRole.valueOf(request.getRoleName());
        }catch (IllegalArgumentException e){
            throw new AppException(ErrorCode.INVALID_ROLE);
        }


        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        if(user.getUsername().equals("admin")){
            throw new AppException(ErrorCode.CANT_EDIT_ROOT_ADMIN_ROLE);
        }
        user.setUserRole(request.getRoleName());
        userRepository.save(user);
        return RoleUpdateResponse.builder()
                .userRole(request.getRoleName())
                .username(user.getUsername())
                .build();
    }

    public PagedResult<UserRespone> getUsers(String search, String role, Pageable pageable){
        Page<UserRespone> users = userRepository.findAllWithFilters(search, role, pageable)
                .map(user -> userMapper.toUserRespone(user));
        return new PagedResult<>(users);
    }



    @Transactional
    public UserDeleteResponse deleteUser(String username){
        User user = userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        userRepository.removeUserByUsername(username);
        return UserDeleteResponse.builder()
                .success(true)
                .username(username)
                .message("User deleted successfully")
                .build();
    }

    public String getUsernameById(String id){
        User user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return user.getUsername();
    }


    public boolean userExisted(String username){
        return userRepository.existsByUsername(username);
    }

    public UserRespone getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        return userMapper.toUserRespone(userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)));
    }

    public UserRespone updateCurrentUser(UserUpdateRequest userUpdateRequest){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED)
        );
        userMapper.updateuser(user, userMapper.asUser(userUpdateRequest));
        return userMapper.toUserRespone(userRepository.save(user));
    }

    public UserRespone changePassword(String username, PasswordChangeRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        if(!passwordEncoder.matches(request.getOldPassword(), user.getPassword())){
            throw new AppException(ErrorCode.INVALID_PASSWORD);
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        return userMapper.toUserRespone(userRepository.save(user));
    }

    public UserRespone getUserByUsername(String username) {
        return userMapper.toUserRespone(userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)));
    }


}
