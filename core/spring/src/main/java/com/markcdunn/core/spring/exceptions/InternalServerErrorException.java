package com.markcdunn.core.spring.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
public class InternalServerErrorException
        extends RuntimeException {

    private String message;

    public InternalServerErrorException() {
    }

    public InternalServerErrorException(String message) {
        this.message = message;
    }

    @Override
    public String getMessage() {
        return message;
    }
}

