package com.noface.newswebapi.cons;

public enum ArticleStatus {
    DRAFT("DRAFT"),
    PUBLISHED("PUBLISHED"),
    PENDING("PENDING"),

    ;
    private String name;
    ArticleStatus(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
