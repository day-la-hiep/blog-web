package com.noface.newswebapi.service;

import com.cloudinary.Cloudinary;
import com.noface.newswebapi.cons.ArticleStatus;
import com.noface.newswebapi.dto.ArticleOverview;
import com.noface.newswebapi.dto.request.CategoryRequest;
import com.noface.newswebapi.dto.request.article.ArticleCreateRequest;
import com.noface.newswebapi.dto.request.article.ArticleUpdateRequest;
import com.noface.newswebapi.dto.response.article.ArticleOverviewResponse;
import com.noface.newswebapi.dto.response.article.ArticleResponse;
import com.noface.newswebapi.entity.Article;
import com.noface.newswebapi.entity.ArticleCategory;
import com.noface.newswebapi.entity.Category;
import com.noface.newswebapi.entity.User;
import com.noface.newswebapi.exception.AppException;
import com.noface.newswebapi.exception.ErrorCode;
import com.noface.newswebapi.dto.mapper.ArticleMapper;
import com.noface.newswebapi.dto.mapper.CategoryMapper;
import com.noface.newswebapi.repository.ArticleCategoryRepository;
import com.noface.newswebapi.repository.ArticleRepository;
import com.noface.newswebapi.repository.CategoryRepository;
import com.noface.newswebapi.repository.UserRepository;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    private ArticleCategoryRepository articleCategoryRepository;
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
        newArticle.setArticleCategories(new HashSet<>());
        newArticle.setDateCreated(LocalDateTime.now());
        newArticle.setLastUpdated(LocalDateTime.now());
        newArticle.setStatus(ArticleStatus.DRAFT.getName());
        newArticle.setAuthor(author);
        for (CategoryRequest categoryRequest : request.getCategories()) {
            String slug;
            if (categoryRequest.getSlug() == null || categoryRequest.getSlug().isEmpty()) {
                slug = categoryMapper.nameToSlug(categoryRequest.getName());
            } else {
                slug = categoryRequest.getSlug();
            }
            Category category;
            if (categoryRepository.existsBySlug(slug)) {
                category = categoryRepository.getBySlug(slug);
            } else {
                category = categoryRepository.saveAndFlush(
                        Category.builder()
                                .name(categoryRequest.getName())
                                .slug(slug)
                                .build()
                );
            }
            newArticle.getArticleCategories().add(
                    ArticleCategory.builder()
                            .article(newArticle)
                            .category(category)
                            .build()
            );

        }
        newArticle = articleRepository.save(newArticle);

        return articleMapper.toArticleResponse(newArticle);
    }


    public ArticleResponse updateArticle(String articleId, ArticleUpdateRequest articleRequest) {
        Article article = articleRepository.getArticleById(articleId)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));
        articleMapper.updateArticle(article, articleRequest);
        List<ArticleCategory> articleCategories = articleCategoryRepository
                .findArticleCategoryByArticle_Id(article.getId());
        List<String> categorySlugs = articleRequest.getCategories()
                .stream()
                .map(CategoryRequest::getSlug)
                .collect(Collectors.toList());
        for (ArticleCategory articleCategory : articleCategories) {
            if (!categorySlugs.contains(articleCategory.getCategory().getSlug())) {
                articleCategoryRepository.delete(articleCategory);
            }
        }
        for (CategoryRequest categoryRequest : articleRequest.getCategories()) {
            String categorySlug = categoryRequest.getSlug();
            String name = categoryRequest.getName();
            if (articleCategories.stream().noneMatch(ac -> ac.getCategory().getSlug().equals(categorySlug))) {
                Category category = categoryRepository.getCategoryBySlug(categorySlug).orElse(
                        categoryRepository.save(
                                Category.builder()
                                        .slug(categorySlug)
                                        .name(name)
                                        .build()
                        )
                );
                articleCategoryRepository.save(
                        ArticleCategory.builder()
                                .article(article)
                                .category(category)
                                .build()
                );
            }
        }
        return articleMapper.toArticleResponse(article);
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
            String search,
            LocalDateTime startDate, LocalDateTime endDate,
            String status, Pageable pageable) {

        Page<ArticleOverview> articles = articleRepository
                .findArticlesWithAuthor(search, startDate, endDate, status, pageable);

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
            String search,
            String articleStatus,
            LocalDateTime startDate,
            LocalDateTime endDate
    ) {
        return articleRepository.countArticlesWithFilters( search, startDate, endDate, articleStatus);
    }

    public boolean isOwned(String username, String articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));
        return article.getAuthor().getUsername().equals(username);
    }

    public List<ArticleResponse> getArticlesByUserId(String id, Pageable pageable) {
        User user = userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        List<Article> articles = articleRepository.getArticleByAuthor_Id(id, pageable).stream().toList();
        return articles.stream().map(articleMapper::toArticleResponse).collect(Collectors.toList());
    }

    public List<ArticleOverviewResponse> getArticlesByCategorySlug(String categorySlug, Pageable pageable) {
        Page<ArticleOverview> articleOverviews = articleRepository.getArticlesByCategorySlug(categorySlug, pageable);
        return articleOverviews
                .stream()
                .map(articleMapper::toArticleOverviewResponse)
                .collect(Collectors.toList());
    }
}

