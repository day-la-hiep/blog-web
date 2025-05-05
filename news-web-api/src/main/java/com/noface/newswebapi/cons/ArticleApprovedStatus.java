package com.noface.newswebapi.cons;

public enum ArticleApprovedStatus {
    ACCEPTED("ACCEPTED"),
    REJECTED("REJECTED"),
    NONE("NONE");
    ;
    private String name;
    private ArticleApprovedStatus(String name) {
        this.name = name;
    }
    public String getName() {
        return name;
    }
}
