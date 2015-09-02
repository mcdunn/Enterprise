package com.markcdunn.core.spring.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.FORBIDDEN)
public class ForbiddenException
        extends RuntimeException {

    private String message;

    public ForbiddenException() {
    }

    public ForbiddenException(String message) {
        this.message = message;
    }

    @Override
    public String getMessage() {
        return message;
    }
}

