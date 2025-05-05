package com.noface.newswebapi.cons;

public enum UserRole {
    USER("USER"), ADMIN("ADMIN"), MODERATOR("MODERATOR")
    ;
    private String name;
    UserRole(String name) {
        this.name = name;
    }
}
