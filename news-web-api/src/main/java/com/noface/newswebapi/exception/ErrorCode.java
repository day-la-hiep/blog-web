package com.noface.newswebapi.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import org.springframework.http.HttpStatus;
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

    ;


    ErrorCode(int code, String message){
        this.code = code;
        this.message = message;
    }
    public int code;
    public String message;
}
