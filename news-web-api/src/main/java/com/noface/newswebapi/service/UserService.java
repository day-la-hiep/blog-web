package com.noface.newswebapi.service;

import com.noface.newswebapi.dto.response.UserRespone;
import com.noface.newswebapi.entity.Role;
import com.noface.newswebapi.entity.User;
import com.noface.newswebapi.exception.AppException;
import com.noface.newswebapi.exception.ErrorCode;
import com.noface.newswebapi.mapper.UserMapper;
import com.noface.newswebapi.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.stream.Stream;

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
    public User createUser(User user){
        if(userRepository.existsByUsername(user.getUsername())){
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));

//        User user = userRepository.save
        user.setRoles(new HashSet<>());
        user.getRoles().add(Role.builder().name("USER").build());
        return userRepository.save(user);

    }

    public UserRespone getUserById(Long id){
        User user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toUserRespone(user);
    }

    public UserRespone updateUserById(Long id, User newUserInfo){
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

    public Stream<User> getUsers(Pageable pageable){
        Page<User> users = userRepository.findAll(pageable);
        return users.stream();
    }



    @Transactional
    public UserRespone removeUser(Long id){
        User user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        userRepository.removeUserById(id);
        return userMapper.toUserRespone(user);
    }


    public User getUserByUsernameWithRoles(String username) {
        return userRepository.findUserByUsernameWithRoles(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    public boolean isOwnUserProfile(Long id, String username){
        User user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return user.getUsername().equals(username);
    }

    public boolean userExisted(String username){
        return userRepository.existsByUsername(username);
    }
}
