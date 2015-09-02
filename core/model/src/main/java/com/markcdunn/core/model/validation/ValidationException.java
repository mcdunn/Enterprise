package com.markcdunn.core.model.validation;

public class ValidationException
        extends RuntimeException {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    protected ValidationErrorResponse errorResponse;

    public ValidationException() {
        super();
        errorResponse = new ValidationErrorResponse();
    }

    public ValidationException(ValidationErrorResponse errorResponse) {
        super();
        this.errorResponse = errorResponse;
    }

    public ValidationException(Exception t) {
        super(t);
        if (t instanceof ValidationException) {
            errorResponse = ((ValidationException) t).getValidationErrorResponse();
        }
        else {
            errorResponse = new ValidationErrorResponse();
            errorResponse.addValidationError(new ValidationError(t.getMessage()));
        }
    }

    public void setValidationErrorResponse(ValidationErrorResponse errorResponse) {
        this.errorResponse = errorResponse;
    }

    public ValidationErrorResponse getValidationErrorResponse() {
        return errorResponse;
    }
}
