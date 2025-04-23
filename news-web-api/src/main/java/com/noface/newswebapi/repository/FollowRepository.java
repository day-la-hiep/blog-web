package com.noface.newswebapi.repository;

import com.noface.newswebapi.entity.Follow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowRepository extends JpaRepository<Follow, String> {
    Follow findByFollower_UsernameAndAuthor_Username(String followerUsername, String authorUsername);

    Page<Follow> getFollowsByFollower_Username(String followerUsername, Pageable pageable);

    Page<Follow> getFollowsByAuthor_Username(String username, Pageable pageable);
}
