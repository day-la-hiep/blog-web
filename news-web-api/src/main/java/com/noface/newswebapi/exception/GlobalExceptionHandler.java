package com.noface.newswebapi.exception;


import com.cloudinary.Api;
import com.noface.newswebapi.dto.ApiResponse;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.sql.SQLIntegrityConstraintViolationException;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(exception = AppException.class)
    public ResponseEntity<ApiResponse> handleAppException(AppException e){
        ErrorCode errorCode = e.getErrorCode() != null ? e.getErrorCode() : ErrorCode.UNKNOW_ERROR;
        ApiResponse response = new ApiResponse();
        response.setMessage(errorCode.getMessage());
        response.setCode(errorCode.getCode());
        return ResponseEntity.badRequest().body(response);
    }
    @ExceptionHandler(exception =  SQLIntegrityConstraintViolationException.class)
    public ResponseEntity<ApiResponse> handleSQLIntegrityConstraintViolationException(SQLIntegrityConstraintViolationException e){
        ApiResponse response = new ApiResponse();
        response.setMessage(ErrorCode.DATA_INTEGRITY_VIOLATION.getMessage());
        response.setCode(ErrorCode.DATA_INTEGRITY_VIOLATION.getCode());
        response.setResult(e.getLocalizedMessage());
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(exception = ConstraintViolationException.class)
    public ResponseEntity<ApiResponse> handleConstraintViolationException(ConstraintViolationException e){
        ApiResponse response = new ApiResponse();
        response.setMessage(ErrorCode.INVALID_DATA.getMessage());
        response.setCode(ErrorCode.INVALID_DATA.getCode());
        response.setResult(e.getLocalizedMessage());
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(exception = HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse> handleHttpMessageNotReadableException(HttpMessageNotReadableException e){
        ApiResponse response = new ApiResponse();
        response.setMessage(ErrorCode.INVALID_REQUEST.getMessage());
        response.setCode(ErrorCode.INVALID_REQUEST.getCode());
        response.setResult(e.getLocalizedMessage());
        return ResponseEntity.badRequest().body(response);
    }

//    @ExceptionHandler(exception = Exception.class)
//    public ResponseEntity<ApiResponse> handleException(Exception e){
//        ApiResponse response = new ApiResponse();
//        response.setMessage(ErrorCode.UNKNOW_ERROR.getMessage());
//        response.setCode(ErrorCode.UNKNOW_ERROR.getCode());
//        response.setResult(e.getLocalizedMessage());
//        return ResponseEntity.badRequest().body(response);
//    }

}
