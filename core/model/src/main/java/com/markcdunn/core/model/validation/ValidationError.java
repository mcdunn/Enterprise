package com.markcdunn.core.model.validation;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class ValidationError {
    public String errorCode;
    public String errorRoot;
    public String errorPath;
    public String errorField;
    public String errorMessage;
    public String badValue;
    public Object errorObject;

    public ValidationError() {
    }

    public ValidationError(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorRoot(String errorRoot) {
        this.errorRoot = errorRoot;
    }

    public String getErrorRoot() {
        return errorRoot;
    }

    public void setErrorPath(String errorPath) {
        this.errorPath = errorPath;
    }

    public String getErrorPath() {
        return errorPath;
    }

    public void setErrorField(String errorField) {
        this.errorField = errorField;
    }

    public String getErrorField() {
        return errorField;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setBadValue(String badValue) {
        this.badValue = badValue;
    }

    public String getBadValue() {
        return badValue;
    }

    public void setErrorObject(Object errorObject) {
        this.errorObject = errorObject;
    }

    @JsonIgnore
    public Object getErrorObject() {
        return errorObject;
    }

    public String toString() {
        return "ValidationError {" +
                "errorCode=" + errorCode +
                ", errorRoot=" + errorRoot +
                ", errorPath=" + errorPath +
                ", errorField=" + errorField +
                ", errorMessage=" + errorMessage +
                ", badValue=" + badValue +
                ", errorObject=" + errorObject +
                "}";
    }
}
