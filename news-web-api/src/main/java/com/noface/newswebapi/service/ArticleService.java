package com.noface.newswebapi.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.noface.newswebapi.cons.ArticleStatus;
import com.noface.newswebapi.dto.request.ArticleRequest;
import com.noface.newswebapi.dto.response.ArticleResponse;
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
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
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

    public ArticleResponse createNewArticle(ArticleRequest articleRequest) throws IOException {
        Article article = articleMapper.asArticle(articleRequest);
        User author = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> {
            throw new AppException(ErrorCode.MISSING_ARTICLE_AUTHOR);
        });
        Article newArticle = new Article();
        articleMapper.updateArticle(newArticle, article);
        newArticle.setCategories(new HashSet<>());
        newArticle.setDateCreated(LocalDateTime.now());
        newArticle.setLastUpdated(LocalDateTime.now());
        newArticle.setStatus(ArticleStatus.DRAFT);
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


    public ArticleResponse updateArticle(Long articleId,  Article newArticleContent) {
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
        if (newArticleContent.getStatus() != oldArticle.getStatus()) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication instanceof JwtAuthenticationToken) {
                log.info(authentication.getAuthorities().toString());
                if (authentication.getAuthorities().stream().anyMatch(
                        grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"))) {
                    updateArticlePublishedStatus(oldArticle, newArticleContent.getStatus(), userRepository.findByUsername(username)
                            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)));
                }
            }
        }

        oldArticle.setLastUpdated(LocalDateTime.now());
        articleMapper.updateArticle(oldArticle, newArticleContent);
        ArticleResponse response = articleMapper.toArticleResponse(articleRepository.save(oldArticle));
        return response;
    }

    @PreAuthorize("hasAuthority('ROLE_MODERATOR') || hasAuthority('ROLE_ADMIN')")
    public void updateArticlePublishedStatus(Article article, ArticleStatus articleStatus, User moderator) {
        article.setLastUpdated(LocalDateTime.now());
        article.setModerator(moderator);
        article.setStatus(articleStatus);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') || hasAuthority('ROLE_MODERATOR')")
    @PostAuthorize("returnObject.result.author.username == authentication.name")
    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    public ArticleResponse getArticleById(Long id) {
        return articleMapper.toArticleResponse(articleRepository.getArticleById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED)));
    }


    public Stream<ArticleResponse> getArticlesWithFilter(String id, String title, String authorName,
                                                         LocalDateTime startDate, LocalDateTime endDate,
                                                         ArticleStatus status, Pageable pageable) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.getAuthorities().stream().anyMatch((grantedAuthority)
                -> grantedAuthority.getAuthority().equals("ROLE_ADMIN")
                || grantedAuthority.getAuthority().equals("ROLE_MODERATOR"))) {
            return articleRepository.findArticlesWithFilter(id, title, null, authorName,
                    startDate, endDate, status, pageable).stream().map(articleMapper::toArticleResponse);
        } else {
            return articleRepository.findArticlesWithFilter(id, title, authentication.getName(), ""
                    , startDate, endDate, status, pageable).stream().map(articleMapper::toArticleResponse);
        }

    }

    public ArticleResponse removeArticleById(Long id) {
        Article article = articleRepository.getArticleById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));
        ArticleResponse articleResponse = articleMapper.toArticleResponse(article);
        articleRepository.delete(article);
        return articleResponse;
    }

    public long getNumberOfArticle() {
        return articleRepository.count();
    }

    public long getNumberOfArtilce(
            String title,
            String id,
            ArticleStatus articleStatus,
            LocalDateTime startDate,
            LocalDateTime endDate,
            String authorName
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.getAuthorities().stream().anyMatch((grantedAuthority)
                -> grantedAuthority.getAuthority().equals("ROLE_ADMIN")
                || grantedAuthority.getAuthority().equals("ROLE_MODERATOR"))) {
            return articleRepository.getNumberOfArticle(title, id, articleStatus, null, startDate, endDate, authorName);
        } else {
            return articleRepository.getNumberOfArticle(title, id, articleStatus, authentication.getName(),
                    startDate, endDate, authorName);

        }
    }

    public boolean isOwned(String username, Long articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));
        return article.getAuthor().getUsername().equals(username);
    }

}

