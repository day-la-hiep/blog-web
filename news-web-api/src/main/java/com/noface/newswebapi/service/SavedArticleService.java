package com.noface.newswebapi.service;

import com.noface.newswebapi.dto.mapper.SavedArticleMapper;
import com.noface.newswebapi.dto.request.SavedArticleRequest;
import com.noface.newswebapi.dto.response.SavedArticleResponse;
import com.noface.newswebapi.entity.SavedArticle;
import com.noface.newswebapi.exception.AppException;
import com.noface.newswebapi.exception.ErrorCode;
import com.noface.newswebapi.repository.SavedArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SavedArticleService {
    @Autowired
    private SavedArticleRepository savedArticleRepository;

    @Autowired
    private SavedArticleMapper savedArticleMapper;
    public SavedArticleResponse updateSavedArticle(String savedArticleId,
                                                   SavedArticleRequest request){

        SavedArticle savedArticle = savedArticleRepository
                .findById(savedArticleId).orElseThrow(
                        () -> new AppException(ErrorCode.SAVED_ARTICLE_NOT_EXISTED));
        savedArticle.setNote(request.getNote());
        return savedArticleMapper.toResponse(savedArticleRepository.save(savedArticle));
    }
}
