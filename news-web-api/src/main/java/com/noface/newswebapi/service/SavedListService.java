package com.noface.newswebapi.service;

import com.noface.newswebapi.dto.PagedResult;
import com.noface.newswebapi.dto.article.AddArticleToSavedListRequest;
import com.noface.newswebapi.dto.article.ArticleOverviewResponse;
import com.noface.newswebapi.dto.mapper.SavedArticleMapper;
import com.noface.newswebapi.dto.savedList.SavedListRequest;
import com.noface.newswebapi.dto.savedList.SavedListResponse;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

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
    @Autowired
    private SavedArticleMapper savedArticleMapper;

    public SavedListResponse getSavedList(String id) throws AppException {
        return savedListMapper.toSavedListResponse(savedListRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SAVED_LIST_NOT_EXISTED)));
    }

    public SavedListResponse addArticleToSavedList(String listId, AddArticleToSavedListRequest request) {
        Set<String> articleIds = request.getArticleIds();
        SavedList savedList = savedListRepository.findById(listId)
                .orElseThrow(() -> new AppException(ErrorCode.SAVED_LIST_NOT_EXISTED));
        for(String articleId : articleIds){
            if(savedArticleRepository.existsByArticle_IdAndSavedList_Id(articleId, listId)) {
                throw new AppException(ErrorCode.ARTICLE_ALREADY_IN_SAVED_LIST);
            }

            Article article = articleRepository.findById(articleId)
                    .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));
            SavedArticle savedArticle = SavedArticle.builder()
                    .article(article)
                    .savedList(savedList)
                    .createdAt(LocalDateTime.now())
                    .build();
            savedArticle = savedArticleRepository.save(savedArticle);

        }


        savedListRepository.save(savedList);
        return savedListMapper.toSavedListResponse(savedList);
    }

    public PagedResult<ArticleOverviewResponse> getArticlesInSavedList(String listId, String search, Pageable pageable)  {
        SavedList savedList = savedListRepository.findById(listId)
                .orElseThrow(() -> new AppException(ErrorCode.SAVED_LIST_NOT_EXISTED));
        Page<ArticleOverviewResponse> savedArticles = savedArticleRepository.findSavedArticlesWithFilter(listId, search, pageable)
                .map(savedArticle -> {
                    Article article = savedArticle.getArticle();
                    return articleMapper.toArticleOverviewResponse(article);
                });
        return new PagedResult<ArticleOverviewResponse>(savedArticles);
    }

    public PagedResult<SavedListResponse> getSavedLists(String search, Pageable pageable) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Page<SavedListResponse> savedLists = savedListRepository.findSavedListsWithFilter(username, search, pageable)
                .map(savedListMapper::toSavedListResponse);
        return new PagedResult<>(savedLists);
    }

    public SavedListResponse removeSavedList(String listId){
        SavedList savedList = savedListRepository.findById(listId)
                .orElseThrow(() -> new AppException(ErrorCode.SAVED_LIST_NOT_EXISTED));
        savedListRepository.delete(savedList);
        return savedListMapper.toSavedListResponse(savedList);
    }
    @Transactional
    public SavedListResponse deleteArticleInSavedList(String listId, String articleId){
        SavedList savedList = savedListRepository.findById(listId)
                .orElseThrow(() -> new AppException(ErrorCode.SAVED_LIST_NOT_EXISTED));
        if(!savedArticleRepository.existsByArticle_IdAndSavedList_Id(articleId, listId)){
            throw new AppException(ErrorCode.ARTICLE_NOT_IN_SAVED_LIST);
        }
        savedArticleRepository.removeSavedArticleByArticle_IdAndSavedList_Id(articleId, listId);
        savedList.getSavedArticles().removeIf(savedArticle -> savedArticle.getArticle().getId().equals(articleId));
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
