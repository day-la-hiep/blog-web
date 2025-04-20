package com.noface.newswebapi.service;

import com.cloudinary.Cloudinary;
import com.noface.newswebapi.cons.ArticleStatus;
import com.noface.newswebapi.dto.ArticleOverview;
import com.noface.newswebapi.dto.request.article.ArticleCreateRequest;
import com.noface.newswebapi.dto.request.article.ArticleUpdateRequest;
import com.noface.newswebapi.dto.response.article.ArticleOverviewResponse;
import com.noface.newswebapi.dto.response.article.ArticleResponse;
import com.noface.newswebapi.entity.Article;
import com.noface.newswebapi.entity.Category;
import com.noface.newswebapi.entity.User;
import com.noface.newswebapi.exception.AppException;
import com.noface.newswebapi.exception.ErrorCode;
import com.noface.newswebapi.mapper.ArticleMapper;
import com.noface.newswebapi.mapper.CategoryMapper;
import com.noface.newswebapi.repository.ArticleRepository;
import com.noface.newswebapi.repository.CategoryRepository;
import com.noface.newswebapi.repository.UserRepository;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@AllArgsConstructor
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class ArticleService {
    @Autowired
    ArticleRepository articleRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ArticleMapper articleMapper;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private CategoryMapper categoryMapper;
    @Autowired
    private FileUploadService fileUploadService;
    @Autowired
    private Cloudinary cloudinary;

    public ArticleResponse createNewArticle(ArticleCreateRequest request) throws IOException {
        Article article = articleMapper.asArticle(request);
        User author = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> {
            throw new AppException(ErrorCode.MISSING_ARTICLE_AUTHOR);
        });
        Article newArticle = new Article();
        articleMapper.updateArticle(newArticle, article);
        newArticle.setCategories(new HashSet<>());
        newArticle.setDateCreated(LocalDateTime.now());
        newArticle.setLastUpdated(LocalDateTime.now());
        newArticle.setStatus(ArticleStatus.DRAFT.getName());
        for (Category categoryItem : article.getCategories()) {
            String slug;
            if (categoryItem.getSlug() != null) {
                slug = categoryItem.getSlug();
            } else {
                slug = categoryMapper.nameToSlug(categoryItem.getName());
            }
            Category category = categoryRepository.save(Category.builder().slug(slug).name(categoryItem.getName()).build());

            newArticle.getCategories().add(category);
        }
        newArticle.setAuthor(author);
        Article savedArticle = articleRepository.save(newArticle);
        return articleMapper.toArticleResponse(savedArticle);
    }


    public ArticleResponse updateArticle(String articleId,  ArticleUpdateRequest articleRequest) {
        Article newArticleContent = articleMapper.asArticle(articleRequest);
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Article oldArticle = articleRepository.getArticleById(articleId).orElseThrow(
                () -> {
                    throw new AppException(ErrorCode.ARTICLE_NOT_EXISTED);
                });
        if(newArticleContent.getCategories() != null) {
            for (Category category : newArticleContent.getCategories()) {
                categoryRepository.save(category);
            }
        }

        oldArticle.setLastUpdated(LocalDateTime.now());
        articleMapper.updateArticle(oldArticle, newArticleContent);
        ArticleResponse response = articleMapper.toArticleResponse(articleRepository.save(oldArticle));
        return response;
    }

    public ArticleResponse updateArticleStatus(String articledId, String status) {
        Article article = articleRepository.getArticleById(articledId)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));
        article.setLastUpdated(LocalDateTime.now());
        article.setStatus(ArticleStatus.valueOf(status.toUpperCase()).getName());
        return articleMapper.toArticleResponse(articleRepository.save(article));
    }

    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    public ArticleResponse getArticleById(String id) {
        return articleMapper.toArticleResponse(articleRepository.getArticleById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED)));
    }


    public Stream<ArticleOverviewResponse> getArticlesWithFilter(
            String id, String title,
            LocalDateTime startDate, LocalDateTime endDate,
            String status, Pageable pageable) {

        Page<ArticleOverview> articles = articleRepository
                .findArticlesWithAuthor(id, title, startDate, endDate, status, pageable);

        return articles.stream().map(article -> articleMapper.toArticleOverviewResponse(article));
    }

    public ArticleResponse removeArticleById(String id) {
        Article article = articleRepository.getArticleById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));
        ArticleResponse articleResponse = articleMapper.toArticleResponse(article);
        articleRepository.delete(article);
        return articleResponse;
    }


    public long getNumberOfArtilce(
            String id,
            String title,
            String articleStatus,
            LocalDateTime startDate,
            LocalDateTime endDate
    ) {
        return articleRepository.countArticlesWithFilters(id, title, startDate, endDate, articleStatus);
    }

    public boolean isOwned(String username, String articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));
        return article.getAuthor().getUsername().equals(username);
    }
    public List<ArticleResponse> getArticlesByUserId(String id, Pageable pageable){
        User user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        List<Article> articles = articleRepository.getArticleByAuthor_Id(id, pageable).stream().toList();
        return articles.stream().map(articleMapper::toArticleResponse).collect(Collectors.toList());
    }

}

