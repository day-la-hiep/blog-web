package com.noface.newswebapi.cons;

public enum CommentReportStatus {
    PENDING("PENDING"),
    ACCEPTED("ACCEPTED"),
    SKIPPED("SKIPPED"),

    ;
    private String name;
    CommentReportStatus(String name) {
        this.name = name;
    }
}
