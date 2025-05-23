package com.noface.newswebapi.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.fasterxml.jackson.databind.cfg.CoercionInputShape;
import com.noface.newswebapi.cons.ArticleStatus;
import com.noface.newswebapi.dto.article.ArticleResponse;
import com.noface.newswebapi.dto.article.UploadImageResponse;
import com.noface.newswebapi.entity.Article;
import com.noface.newswebapi.entity.User;
import com.noface.newswebapi.exception.AppException;
import com.noface.newswebapi.exception.ErrorCode;
import com.noface.newswebapi.dto.mapper.ArticleMapper;
import com.noface.newswebapi.repository.ArticleRepository;
import com.noface.newswebapi.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@Slf4j
public class FileUploadService {
    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private ArticleRepository articleRepository;
    @Autowired
    private ArticleMapper articleMapper;
    @Autowired
    private UserRepository userRepository;

    public String uploadImage(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap("resource_type", "auto"));
        return uploadResult.get("secure_url").toString();
    }

    public Map uploadImage(MultipartFile file,
                              String folder, String name, boolean overwrite) throws IOException {

        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "public_id", name,
                        "folder", folder,
                        "overwrite", overwrite,
                        "resource_type", "image"
                )
        );
        return uploadResult;
    }

    public Map uploadImage(MultipartFile file,
                           String folder,  boolean overwrite) throws IOException {

        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", folder,
                        "overwrite", overwrite,
                        "resource_type", "image"
                )
        );
        return uploadResult;
    }
    public String uploadArticleImages(String articleId, MultipartFile file) throws IOException {
        articleRepository.getArticleById(articleId)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        String folder = String.format("/users/%s/articles/%s", username, articleId);
        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", folder,
                        "resource_type", "image"
                )
        );
        return uploadResult.get("secure_url").toString();
    }

    public UploadImageResponse uploadUserAvatar(String username, MultipartFile file) throws IOException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        String folder = String.format("/users/%s/avatar", username);

        Map uploadResult = uploadImage(file, folder, "avatar", true);

        String imageUrl = uploadResult.get("secure_url").toString();
        user.setAvatarUrl(imageUrl);
        return UploadImageResponse.builder()
                .success(true)
                .url(imageUrl)
                .build();
    }
    public ArticleResponse uploadArticleThumbnail(String articleId, MultipartFile file) {


        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        String folder = String.format("/users/%s/articles/%s/thumbnail", username, articleId);
        try {
            Article article = articleRepository.getArticleById(articleId)
                    .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));
            if(article.getStatus().equals(ArticleStatus.DRAFT.getName())==false){
                throw new AppException(ErrorCode.ARTICLE_NOT_DRAFT);
            }
            Map uploadResult = uploadImage(file, folder, "thumbnail", true);
            String imageUrl = uploadResult.get("secure_url").toString();
            log.info(imageUrl);
            article.setThumbnailUrl(imageUrl);
            article.setLastUpdated(LocalDateTime.now());
            articleRepository.save(article);
            return articleMapper.toArticleResponse(article);
        } catch (IOException e) {
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

}
