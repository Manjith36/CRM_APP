package com.examly.springapp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        String message = ex.getMessage();
        if (message.contains("CustomerType")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid customerType"));
        }
        if (message.contains("InteractionType")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid interactionType"));
        }
        if (message.contains("InteractionStatus")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid status"));
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Invalid request format"));
    }
}