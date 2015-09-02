package com.markcdunn.core.spring.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class BadRequestException
        extends RuntimeException {

    /**
     * 
     */
    private static final long serialVersionUID = 1L;
    private String message;

    public BadRequestException() {
    }

    public BadRequestException(String message) {
        this.message = message;
    }

    @Override
    public String getMessage() {
        return message;
    }
}

