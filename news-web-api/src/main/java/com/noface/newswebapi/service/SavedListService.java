package com.noface.newswebapi.service;

import com.noface.newswebapi.dto.request.SavedListRequest;
import com.noface.newswebapi.dto.response.article.ArticleResponse;
import com.noface.newswebapi.dto.response.SavedListResponse;
import com.noface.newswebapi.entity.Article;
import com.noface.newswebapi.entity.SavedArticle;
import com.noface.newswebapi.entity.SavedList;
import com.noface.newswebapi.exception.AppException;
import com.noface.newswebapi.exception.ErrorCode;
import com.noface.newswebapi.dto.mapper.ArticleMapper;
import com.noface.newswebapi.dto.mapper.SavedListMapper;
import com.noface.newswebapi.repository.ArticleRepository;
import com.noface.newswebapi.repository.SavedArticleRepository;
import com.noface.newswebapi.repository.SavedListRepository;
import com.noface.newswebapi.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SavedListService {
    @Autowired
    private SavedListRepository savedListRepository;
    @Autowired
    private ArticleRepository articleRepository;
    @Autowired
    private SavedListMapper savedListMapper;
    @Autowired
    private ArticleMapper articleMapper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SavedArticleRepository savedArticleRepository;
    public SavedListResponse getSavedList(String id) throws AppException {
        return savedListMapper.toSavedListResponse(savedListRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SAVED_LIST_NOT_EXISTED)));
    }

    public ArticleResponse addArticleToSavedList(String listId, String articleId) {

        if(savedArticleRepository.existsByArticle_IdAndSavedList_Id(articleId, listId)) {
            throw new AppException(ErrorCode.ARTICLE_ALREADY_IN_SAVED_LIST);
        }

        SavedList savedList = savedListRepository.findById(listId)
                .orElseThrow(() -> new AppException(ErrorCode.SAVED_LIST_NOT_EXISTED));
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));
        SavedArticle savedArticle = SavedArticle.builder()
                .article(article)
                .savedList(savedList)
                .createdAt(LocalDateTime.now())
                .build();
        savedArticle = savedArticleRepository.save(savedArticle);

        savedListRepository.save(savedList);
        return articleMapper.toArticleResponse(article);
    }

    public List<ArticleResponse> getArticlesInSavedList(String listId) {
        SavedList savedList = savedListRepository.findById(listId)
                .orElseThrow(() -> new AppException(ErrorCode.SAVED_LIST_NOT_EXISTED));
        List<Article> articles = savedList.getSavedArticles().stream()
                .map(savedArticle -> savedArticle.getArticle())
                .collect(Collectors.toList());
        return articles.stream()
                .map(articleMapper::toArticleResponse)
                .collect(Collectors.toList());
    }

    public List<SavedListResponse> getSavedLists() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return savedListRepository.findAllByAuthor_Username(username).stream()
                .map(savedListMapper::toSavedListResponse)
                .collect(Collectors.toList());
    }

    public SavedListResponse removeSavedList(String listId){
        SavedList savedList = savedListRepository.findById(listId)
                .orElseThrow(() -> new AppException(ErrorCode.SAVED_LIST_NOT_EXISTED));
        savedListRepository.delete(savedList);
        return savedListMapper.toSavedListResponse(savedList);
    }

    public SavedListResponse removeArticleFromSavedList(String listId, String articleId){
        SavedList savedList = savedListRepository.findById(listId)
                .orElseThrow(() -> new AppException(ErrorCode.SAVED_LIST_NOT_EXISTED));
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));
        savedList.getSavedArticles().remove(article);
        savedListRepository.save(savedList);
        return savedListMapper.toSavedListResponse(savedList);
    }
    public SavedListResponse updateSavedListInfo(String listId, SavedListRequest savedListRequest) {
        SavedList savedList = savedListRepository.findById(listId)
                .orElseThrow(() -> new AppException(ErrorCode.SAVED_LIST_NOT_EXISTED));
        savedListMapper.updateSavedList(savedList, savedListRequest);
        savedListRepository.save(savedList);
        return savedListMapper.toSavedListResponse(savedList);
    }

    public SavedListResponse createSavedList(SavedListRequest savedListRequest) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        SavedList savedList = savedListMapper.asSavedList(savedListRequest);
        savedList = savedListRepository.save(savedList);
        savedList.setAuthor(userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)));
        savedList.setSavedArticles(new HashSet<>());
        savedList = savedListRepository.save(savedList);
        return savedListMapper.toSavedListResponse(savedList);
    }

    public boolean isOwnSavedList(String username, String listId) {
        SavedList savedList = savedListRepository.findById(listId)
                .orElseThrow(() -> new AppException(ErrorCode.SAVED_LIST_NOT_EXISTED));
        return savedList.getAuthor().getUsername().equals(username);
    }
}
