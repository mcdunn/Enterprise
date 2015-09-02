package com.markcdunn.core.model.validation;

import javax.validation.ConstraintViolation;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * JSON-ready representation of Validation Errors.
 * 
 * For each constraint violation, there is a code which represents the error type, a root object for which the
 * validation error occurred, a path within that object to the field that was in violation, the field in violation, and
 * the error message.
 * 
 * @author gtassone
 * 
 */
public class ValidationErrorResponse {

    public List<ValidationError> errors;

    public ValidationErrorResponse() {
        errors = new ArrayList<>();
    }

    public ValidationErrorResponse(ValidationError error) {
        errors = new ArrayList<>();
        errors.add(error);
    }

    public ValidationErrorResponse(List<ValidationError> errors) {
        this.errors = errors;
    }

    public void addValidationError(ValidationError error) {
        errors.add(error);
    }

    public void addValidationErrors(Collection<ValidationError> errors) {
        this.errors.addAll(errors);
    }

    public void addValidationErrors(ValidationErrorResponse other) {
        this.errors.addAll(other.errors);
    }

    public static ValidationErrorResponse fromConstraintViolations(Collection<ConstraintViolation<?>> violations,int rowNum) {
        ValidationErrorResponse response = new ValidationErrorResponse();
        for (ConstraintViolation<?> violation : violations) {
            ValidationError error = new ValidationError();
            error.setErrorCode(violation.getConstraintDescriptor().getAnnotation().getClass().getSimpleName());
            error.setErrorField(violation.getPropertyPath() == null ? null : violation.getPropertyPath().toString());
            error.setErrorMessage(violation.getMessage());
            error.setErrorPath("Row "+ rowNum);
            error.setErrorRoot(null);
            error.setBadValue(violation.getInvalidValue() == null ? null : violation.getInvalidValue().toString());
            response.addValidationError(error);
        }
        return response;
    }

    public List<ValidationError> getErrors() {
        return errors;
    }

    public String toString() {
        return "ValidationErrorResponse {" +
                "errors=[" + getErrors() + "]" +
                "}";
    }
}
