package com.noface.newswebapi.cons;

public enum ReportStatus {
    PENDING("PENDING"),
    RESOLVED("RESOLVED"),;

    private String name;
    ReportStatus(String name) {
        this.name = name;
    }
}
