package com.noface.newswebapi.cons;

public enum ArticleStatus {
    DRAFT("draft"),
    PUBLISHED("published"),
    PENDING("pending"),

    ;
    private String name;
    ArticleStatus(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
