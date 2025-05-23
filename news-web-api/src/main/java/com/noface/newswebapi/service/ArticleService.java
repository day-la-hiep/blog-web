package com.noface.newswebapi.service;

import com.cloudinary.Cloudinary;
import com.noface.newswebapi.cons.ArticleApprovedStatus;
import com.noface.newswebapi.cons.ArticleStatus;
import com.noface.newswebapi.dto.PagedResult;
import com.noface.newswebapi.dto.article.*;
import com.noface.newswebapi.dto.mapper.SavedListMapper;
import com.noface.newswebapi.entity.*;
import com.noface.newswebapi.exception.AppException;
import com.noface.newswebapi.exception.ErrorCode;
import com.noface.newswebapi.dto.mapper.ArticleMapper;
import com.noface.newswebapi.dto.mapper.CategoryMapper;
import com.noface.newswebapi.repository.*;
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
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
    @Autowired
    private SavedListRepository savedListRepository;
    @Autowired
    private SavedArticleRepository savedArticleRepository;
    @Autowired
    private SavedListMapper savedListMapper;

    public ArticleResponse createNewArticle(ArticleCreateRequest request) throws IOException {
        Article article = articleMapper.asArticle(request);
        User author = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName())
                .orElseThrow(() -> {
                    throw new AppException(ErrorCode.MISSING_ARTICLE_AUTHOR);
                });
        Article newArticle = new Article();
        articleMapper.updateArticle(newArticle, article);
        newArticle.setName(generateUniqueTitle(request.getName()));
        newArticle.setDateCreated(LocalDateTime.now());
        newArticle.setArticleCategories(new HashSet<>());
        newArticle.setStatus(ArticleStatus.DRAFT.getName());
        newArticle.setApprovedStatus(ArticleApprovedStatus.NONE.getName());
        newArticle.setAuthor(author);
        newArticle.setArticleCategories(new HashSet<>());
        newArticle.setLastUpdated(LocalDateTime.now());
        for (String categoryId : request.getCategoryIds()) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
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
        final Article article = articleRepository.getArticleById(articleId)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));
        if(article.getStatus().equals(ArticleStatus.DRAFT.getName())) {
            articleMapper.updateArticle(article, articleRequest);

            Set<ArticleCategory> articleCategories = article.getArticleCategories();
            articleCategories.clear();
            articleCategories.addAll(articleRequest.getCategoryIds().stream()
                    .map(categoryId -> {
                        return ArticleCategory.builder()
                                .article(article)
                                .category(categoryRepository.findById(categoryId)
                                        .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED)))
                                .build();
                    }).toList());
            article.setStatus(ArticleStatus.DRAFT.getName());
            return articleMapper.toArticleResponse(articleRepository.save(article));
        }
        else {
            throw new AppException(ErrorCode.ARTICLE_NOT_DRAFT);
        }
    }


    public ArticleSubmitResponse submitArticle(String articleId) {
        Article article = articleRepository.getArticleById(articleId)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));
        article.setLastUpdated(LocalDateTime.now());
        if(article.getStatus().equals(ArticleStatus.DRAFT.getName())) {
            article.setStatus(ArticleStatus.PENDING.getName());
            article = articleRepository.save(article);
            return ArticleSubmitResponse.builder()
                    .id(article.getId())
                    .name(article.getName())
                    .title(article.getTitle())
                    .status(article.getStatus())
                    .approvedStatus(article.getApprovedStatus())
                    .build();
        } else {
            throw new AppException(ErrorCode.ARTICLE_NOT_DRAFT);
        }
    }

    public ArticleSubmitResponse unsubmitArticle(String articleId){
        Article article = articleRepository.getArticleById(articleId)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));
        article.setLastUpdated(LocalDateTime.now());
        if(article.getStatus().equals(ArticleStatus.PENDING.getName())) {
            article.setStatus(ArticleStatus.DRAFT.getName());
            article = articleRepository.save(article);
            return ArticleSubmitResponse.builder()
                    .id(article.getId())
                    .name(article.getName())
                    .title(article.getTitle())
                    .status(article.getStatus())
                    .approvedStatus(article.getApprovedStatus())
                    .build();
        } else {
            throw new AppException(ErrorCode.ARTICLE_NOT_PENDING);
        }
    }

    public ArticleSubmitResponse undoAcceptedArticle(String articleId) {

        Article article = articleRepository.getArticleById(articleId)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));
        article.setLastUpdated(LocalDateTime.now());
        article.setPublishedDate(null);
        if(article.getStatus().equals(ArticleStatus.DONE.getName())) {
            article.setStatus(ArticleStatus.PENDING.getName());
            article.setApprovedStatus(ArticleApprovedStatus.NONE.getName());
            article = articleRepository.save(article);
            return ArticleSubmitResponse.builder()
                    .id(article.getId())
                    .name(article.getName())
                    .title(article.getTitle())
                    .status(article.getStatus())
                    .approvedStatus(article.getApprovedStatus())
                    .build();
        } else {
            throw new AppException(ErrorCode.ARTICLE_NOT_DRAFT);
        }
    }

    public ArticleSubmitResponse acceptArticle(String articleId){
        Article article = articleRepository.getArticleById(articleId)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));
        article.setLastUpdated(LocalDateTime.now());
        article.setPublishedDate(LocalDateTime.now());
        if(article.getStatus().equals(ArticleStatus.PENDING.getName())) {
            article.setStatus(ArticleStatus.DONE.getName());
            article.setApprovedStatus(ArticleApprovedStatus.ACCEPTED.getName());
            article = articleRepository.save(article);
            return ArticleSubmitResponse.builder()
                    .id(article.getId())
                    .name(article.getName())
                    .title(article.getTitle())
                    .status(article.getStatus())
                    .approvedStatus(article.getApprovedStatus())
                    .build();
        } else {
            throw new AppException(ErrorCode.ARTICLE_NOT_PENDING);
        }
    }

    public ArticleSubmitResponse rejectArticle(String articleId){
        Article article = articleRepository.getArticleById(articleId)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));
        article.setLastUpdated(LocalDateTime.now());
        if(article.getStatus().equals(ArticleStatus.PENDING.getName())) {
            article.setStatus(ArticleStatus.DRAFT.getName());
            article.setApprovedStatus(ArticleApprovedStatus.REJECTED.getName());
            article = articleRepository.save(article);
            return ArticleSubmitResponse.builder()
                    .id(article.getId())
                    .name(article.getName())
                    .title(article.getTitle())
                    .status(article.getStatus())
                    .approvedStatus(article.getApprovedStatus())
                    .build();
        } else {
            throw new AppException(ErrorCode.ARTICLE_NOT_PENDING);
        }
    }


    public ArticleResponse getArticleById(String id) {
        return articleMapper.toArticleResponse(articleRepository.getArticleById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED)));
    }

    public ArticleResponse getPublicArticleById(String id){
        Article article = articleRepository.getArticleById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));
        if(!article.getApprovedStatus().equals(ArticleApprovedStatus.ACCEPTED.getName())) {
            throw new AppException(ErrorCode.ARTICLE_NOT_EXISTED);
        }
        return articleMapper.toArticleResponse(article);
    }

    public PagedResult<PublicArticleOverViewResponse> getPublicArticleOverViews(
            String search,
            LocalDateTime publishedStartDate, LocalDateTime publishedEndDate,
            Pageable pageable
    ) {
        Page<PublicArticleOverViewResponse> articles = articleRepository.findArticles(search,
                null, null, publishedStartDate, publishedEndDate,
                null, ArticleApprovedStatus.ACCEPTED.getName(), pageable)
                .map(articleMapper::toPublicArticleOverViewResponse);
        return new PagedResult<>(articles);
    }


    public PagedResult<ArticleOverviewResponse> getArticlesWithFilter(
            String search,
            LocalDateTime updateStartDate, LocalDateTime updateEndDate,
            String status, String approvedStatus, Pageable pageable) {
        status = normalizeStatus(status);
        approvedStatus = normalizeArticleApprovedStatus(approvedStatus);
        Page<ArticleOverviewResponse> articles = articleRepository
                .findArticles(search, updateStartDate, updateEndDate, null, null,
                        status, approvedStatus, pageable).map(articleMapper::toArticleOverviewResponse );
        return new PagedResult<ArticleOverviewResponse>(articles);
    }

    public ArticleDeleteResponse removeArticleById(String id) {
        Article article = articleRepository.getArticleById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));
        if(article.getStatus().equals(ArticleStatus.DRAFT.getName())) {
            throw new AppException(ErrorCode.ARTICLE_NOT_DRAFT);
        }
        ArticleResponse articleResponse = articleMapper.toArticleResponse(article);
        articleRepository.delete(article);
        return ArticleDeleteResponse.builder()
                .id(article.getId())
                .message("Article deleted successfully")
                .success(true)
                .build();
    }



    public boolean isOwned(String username, String articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));
        return article.getAuthor().getUsername().equals(username);
    }

    public PagedResult<ArticleOverviewResponse> getArticlesByUsername(
            String username, String search, LocalDateTime updateStartDate,
            LocalDateTime updateEndDate, String status, String approvedStatus, Pageable pageable
    ) {

        try {
            if (status != null) {
                status = ArticleStatus.valueOf(status.toUpperCase()).name();
            }
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_STATUS);
        }
        Page<Article> articles = articleRepository.findArticlesWithUsernameAndFilter(search, updateStartDate, updateEndDate,
                null, null, username, status, approvedStatus, pageable);
        Page<ArticleOverviewResponse> articleOverviewResponses = articleRepository
                .findArticlesWithUsernameAndFilter(search, updateStartDate, updateEndDate,
                        null, null, username, status, approvedStatus, pageable)
                .map(articleMapper::toArticleOverviewResponse );
        return new PagedResult<>(articleOverviewResponses);
    }
    public PagedResult<ArticleOverviewResponse> getArticlesByCategorySlug(
            String categorySlug, String search, LocalDateTime publishedStartDate,
            LocalDateTime publishedEndDate, String status, String approvedStatus, Pageable pageable
    ){
        Category category = categoryRepository.getBySlug(categorySlug)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));
        Page<ArticleOverviewResponse> articles = articleRepository
                .findArticlesByCategoryId(search, null, null,
                        publishedStartDate, publishedEndDate, category.getId(), status, approvedStatus, pageable)
                .map(articleMapper::toArticleOverviewResponse );
        return new PagedResult<>(articles);
    }

    public PagedResult<ArticleOverviewResponse> getArticlesByCategoryId(
            String categoryId, String search, LocalDateTime updateStartDate,
            LocalDateTime updateEndDate, String status, String approvedStatus, Pageable pageable
    ) {
        try {
            if (status != null) {
                status = ArticleStatus.valueOf(status.toUpperCase()).name();
            }
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_STATUS);
        }
        Page<ArticleOverviewResponse> articles = articleRepository
                .findArticlesByCategoryId(search, updateStartDate, updateEndDate,
                        null, null, categoryId, status, approvedStatus, pageable)
                .map(articleMapper::toArticleOverviewResponse );
        return new PagedResult<>(articles);
    }


    public void updateArticleContent(Article source, Article target) {

        target.setTitle(source.getTitle());
        target.setContent(source.getContent());
        target.setSummary(source.getSummary());
        target.setThumbnailUrl(source.getThumbnailUrl());

        if(target.getArticleCategories() != null) {
            target.getArticleCategories().clear();
        } else {
            target.setArticleCategories(new HashSet<>());
        }
        for(ArticleCategory articleCategory : source.getArticleCategories()) {
            target.getArticleCategories().add(
                    ArticleCategory.builder()
                            .article(target)
                            .category(articleCategory.getCategory())
                            .build()
            );
        }
    }


    public ArticleResponse duplicateArticle(String sourceArticleId, String articleName) {
        Article sourceArticle = articleRepository.getArticleById(sourceArticleId)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));
        Article newArticle = new Article();
        updateArticleContent(sourceArticle, newArticle);
        newArticle.setName(articleName);
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.MISSING_ARTICLE_AUTHOR));
        newArticle.setAuthor(author);
        newArticle.setStatus(ArticleStatus.DRAFT.getName());
        newArticle.setApprovedStatus(ArticleApprovedStatus.NONE.getName());
        newArticle.setLastUpdated(LocalDateTime.now());
        return articleMapper.toArticleResponse(articleRepository.save(newArticle));
    }

    public ArticleResponse importArticle(String sourceArticleId, String targetArticleId){
        Article sourceArticle = articleRepository.getArticleById(sourceArticleId)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));
        Article targetArticle = articleRepository.getArticleById(targetArticleId)
                .orElseThrow(() -> new AppException(ErrorCode.ARTICLE_NOT_EXISTED));
        updateArticleContent(sourceArticle, targetArticle);
        targetArticle.setLastUpdated(LocalDateTime.now());
        return articleMapper.toArticleResponse(articleRepository.save(targetArticle));
    }

    public String normalizeArticleApprovedStatus(String status) {
        if(status == null) return null;
        try {
            ArticleApprovedStatus.valueOf(status.toUpperCase());
            return status.toUpperCase();
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_APPROVED_STATUS);
        }
    }

    public String normalizeStatus(String status) {
        if(status == null) return null;
        try {
            ArticleStatus.valueOf(status.toUpperCase());
            return status.toUpperCase();
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_STATUS);
        }
    }

    private String generateUniqueTitle(String baseTitle) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Article> existingArticles = articleRepository
                .findArticlesByAuthorUsernameAndNameStartingWith(username, baseTitle);
        Set<Integer> usedNumbers = new HashSet<>();
        Pattern pattern = Pattern.compile(Pattern.quote(baseTitle) + "(?: \\((\\d+)\\))?$");

        boolean hasBase = false;

        for (Article post : existingArticles) {
            Matcher matcher = pattern.matcher(post.getName());
            if (matcher.matches()) {
                if (matcher.group(1) != null) {
                    int number = Integer.parseInt(matcher.group(1));
                    usedNumbers.add(number);
                } else {
                    hasBase = true;
                }
            }
        }

        if (!hasBase) {
            return baseTitle;
        }

        for (int i = 1; i <= usedNumbers.size() + 1; i++) {
            if (!usedNumbers.contains(i)) {
                return baseTitle + " (" + i + ")";
            }
        }

        // fallback (nên không bao giờ tới đây)
        return baseTitle + " (" + (usedNumbers.size() + 1) + ")";
    }

}

