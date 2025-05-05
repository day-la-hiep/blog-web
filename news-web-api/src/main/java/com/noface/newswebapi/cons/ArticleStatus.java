package com.noface.newswebapi.cons;

public enum ArticleStatus {
    DRAFT("DRAFT"),
    PENDING("PENDING"),
    DONE("DONE"),

    ;
    private String name;
    ArticleStatus(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
