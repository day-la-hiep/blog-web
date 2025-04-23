package com.noface.newswebapi.service;

import com.noface.newswebapi.dto.request.UserCreateRequest;
import com.noface.newswebapi.dto.request.UserUpdateRequest;
import com.noface.newswebapi.dto.response.UserCreateRespone;
import com.noface.newswebapi.dto.response.UserRespone;
import com.noface.newswebapi.entity.Role;
import com.noface.newswebapi.entity.User;
import com.noface.newswebapi.exception.AppException;
import com.noface.newswebapi.exception.ErrorCode;
import com.noface.newswebapi.dto.mapper.UserMapper;
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

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

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
    public UserCreateRespone createUser(UserCreateRequest userCreateRequest) {
        User user = userMapper.asUser(userCreateRequest);
        if(userRepository.existsByUsername(user.getUsername())){
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));

//        User user = userRepository.save
        user.setRoles(new HashSet<>());
        user.getRoles().add(Role.builder().name("USER").build());
        return userMapper.toUserCreateResponse(userRepository.save(user));

    }

    public UserRespone getUserById(String id){
        User user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toUserRespone(user);
    }

    public UserRespone updateUserById(String id, User newUserInfo){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        userMapper.updateuser(user, newUserInfo);
        userRepository.save(user);
        return userMapper.toUserRespone(user);
    }

    public User updateUserRole(User updatedUser){
        User user = userRepository.findUserByUsernameWithRoles(updatedUser.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        user.setRoles(updatedUser.getRoles());
        return userRepository.save(user);
    }

    public List<UserRespone> getUsers(String search, Pageable pageable){
        Page<User> users = userRepository.findAllWithFilters(search, pageable);
        return users.stream().map(userMapper::toUserRespone).collect(Collectors.toList());
    }



    @Transactional
    public UserRespone removeUser(String id){
        User user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        userRepository.removeUserById(id);
        return userMapper.toUserRespone(user);
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
}
