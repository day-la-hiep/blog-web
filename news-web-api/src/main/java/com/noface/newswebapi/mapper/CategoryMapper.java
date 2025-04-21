package com.noface.newswebapi.mapper;

import com.noface.newswebapi.dto.request.CategoryRequest;
import com.noface.newswebapi.dto.response.CategoryResponse;
import com.noface.newswebapi.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.text.Normalizer;
import java.util.Locale;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponse toCategoryResponse(Category category);

    @Mapping(target = "name", qualifiedByName = "normalizeName", source = "name")
    @Mapping(target = "slug", qualifiedByName = "nameToSlug", source = "name")
    Category asCategory(CategoryRequest request);

    @Named("nameToSlug")
    default String nameToSlug(String name){
        if (name== null) return null;

        // Chuẩn hóa Unicode (loại bỏ dấu tiếng Việt)
        String normalized = Normalizer.normalize(name, Normalizer.Form.NFD);
        String withoutDiacritics = normalized.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");

        // Chuyển thành chữ thường & thay thế khoảng trắng, ký tự đặc biệt
        return withoutDiacritics
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9\\s]", "") // Loại bỏ ký tự đặc biệt
                .replaceAll("\\s+", "-") // Thay khoảng trắng bằng dấu '-'
                .replaceAll("-{2,}", "-") // Xóa dấu '-' thừa
                .replaceAll("^-|-$", ""); // Xóa '-' ở đầu hoặc cuối
    }

    default String slugToName(String slug){
        if (slug == null) return null;
        String normalized = Normalizer.normalize(slug, Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
    }

    @Named("normalizeName")
    default String normalizeName(String name){
        if (name == null || name.trim().isEmpty()) return null;

        // Loại bỏ dấu tiếng Việt
        String normalized = Normalizer.normalize(name, Normalizer.Form.NFD);
        String withoutDiacritics = normalized.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");

        // Chuẩn hóa khoảng trắng và viết hoa chữ cái đầu
        String[] words = withoutDiacritics.trim().toLowerCase(Locale.ROOT).split("\\s+");
        StringBuilder result = new StringBuilder();
        for (String word : words) {
            if (!word.isEmpty()) {
                result.append(Character.toUpperCase(word.charAt(0)))
                        .append(word.substring(1))
                        .append(" ");
            }
        }
        return result.toString().trim();
    }

    void updateCategory(@MappingTarget Category category, CategoryRequest request);
}
