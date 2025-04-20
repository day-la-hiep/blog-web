package com.noface.newswebapi.repository;

import com.noface.newswebapi.entity.SavedList;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;

@Repository
public interface SavedListRepository extends JpaRepository<SavedList, String> {
    List<SavedList> findAllByAuthor_Username(String username);
}
