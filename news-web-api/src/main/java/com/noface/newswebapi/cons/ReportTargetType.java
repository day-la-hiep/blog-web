package com.noface.newswebapi.cons;

public enum ReportTargetType {
    COMMENT("COMMENT"),
    ARTICLE("ARTICLE"),
    ;

    private String name;


    ReportTargetType(String name) {
        this.name = name;
    }
}
