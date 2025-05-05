package com.noface.newswebapi.cons;

public enum ReportStatus {
    PENDING("PENDING"),
    ACCEPTED("ACCEPTED"),
    REJECTED("REJECTED"),;

    private String name;
    ReportStatus(String name) {
        this.name = name;
    }
}
