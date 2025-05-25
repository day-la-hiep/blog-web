package com.noface.newswebapi.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {
    USERNAME_EXISTED(1001, "User name existed"),
    USER_NOT_EXISTED(1002, "User not existed"),
    UNKNOW_ERROR(9999, "Unknow error"),
    WRONG_USERNAME_PASSWORD(1003, "Username or password is wrong"),
    INVALID_SORT_PARAM(1004, "Invalid sort param"),
    MISSING_ARTICLE_AUTHOR(1005, "Missing article author" ),
    UNAUTHENTICATED(1006, "Unauthenticated"),
    ARTICLE_NOT_EXISTED(1007, "Article is not existed"),
    CATEGORY_NOT_EXISTED(1008, "Category is not existed"),
    FILE_UPLOAD_FAILED(1009, "File upload failed"),
    COMMENT_NOT_EXISTED(1010, "Comment is not existed"),
    ADD_COMMENT_FAILED(1011, "Add comment failed"),
    SAVED_LIST_NOT_EXISTED(1012, "Saved list not existed" ),

    SAVED_ARTICLE_NOT_EXISTED(1013,"Saved article not existed" ),
    ARTICLE_ALREADY_IN_SAVED_LIST(1014, "Article already in this saved list"),
    INVALID_STATUS(1015, "Status invalid"),
    DATA_INTEGRITY_VIOLATION(1016, "Data integrity violation"),

    INVALID_CATEGORY_PARENT(1017, "Invalid category parent, category must be only 2 level depths"),
    IDENTICAL_PARENT_CATEGORY(1018, "Parent category and category must not be identical" ),
    ARTICLE_NOT_DRAFT(1019, "Article not in draft status"),
    ARTICLE_NOT_PENDING(1020, "Article not in pending status"),
    ARTICLE_NOT_PUBLISHED(1021, "Article not in publish status"),
    INVALID_APPROVED_STATUS(1022, "Invalid article approved status"), ARTICLE_NOT_IN_SAVED_LIST(1023, "Article not in saved list"),
    INVALID_PASSWORD(1024, "Invalid password"), INVALID_ROLE(1025, "INVALID ROLE NAME"),
    ROLE_NOT_EXISTED(1026, "Role not existed"), USER_ALREADY_HAVE_ROLE(1027, "User already have this role"),
    USER_DOES_NOT_HAVE_ROLE(1028, "User dont have this role"),

    INVALID_REPORT_TARGET_TYPE( 1029, "Invalid report target type"),
    REPORT_NOT_EXISTED(1030, "Report not existed"),
    INVALID_REPORT_STATUS(1031, "Invalid report status"),
    INVALID_REQUEST(1032, "Invalid request"),

    INVALID_DATA(1033, "Invalid data"), CANT_EDIT_ROOT_ADMIN_ROLE(1034, "Cant edit root admin role");


    ErrorCode(int code, String message){
        this.code = code;
        this.message = message;
    }
    public int code;
    public String message;
}
