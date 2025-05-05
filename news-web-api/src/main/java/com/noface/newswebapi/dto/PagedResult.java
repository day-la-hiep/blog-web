package com.noface.newswebapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PagedResult<T> {
    public PagedResult(Page<T> page) {
        this.items = page.getContent();
        this.totalPages = page.getTotalPages();
        this.totalItems = page.getTotalElements();
        this.page = page.getNumber();
        this.limit = page.getSize();
        Sort sort = page.getSort();
        this.sortBy = sort != null ? sort.toString() : null;

    }
    private int page;
    private int limit;
    private String sortBy;
    private long totalPages;
    private long totalItems;
    private List<T> items;

}
