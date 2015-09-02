package com.markcdunn.core.spring.exceptions;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.markcdunn.core.model.validation.ValidationError;
import com.markcdunn.core.model.validation.ValidationErrorResponse;
import com.markcdunn.core.model.validation.ValidationException;
import com.markcdunn.core.services.ServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;

/**
 * Represents a set of validation errors.
 */
public class SalsaValidationException
        extends ValidationException {

    private static final long serialVersionUID = 1L;

    private static Logger log = LoggerFactory.getLogger(SalsaValidationException.class);

    public SalsaValidationException() {
        super();
    }

    public SalsaValidationException(Exception t) {
        super(t);
    }

    public SalsaValidationException(ValidationErrorResponse validationErrorResponse) {
        super(validationErrorResponse);
    }

    public static SalsaValidationException fromConstraintViolationException(ConstraintViolationException exception) {
        SalsaValidationException newException = new SalsaValidationException(exception);
        for (ConstraintViolation<?> violation : exception.getConstraintViolations()) {
            ValidationError error = new ValidationError();
            error.errorCode = violation.getConstraintDescriptor().getAnnotation().getClass().getSimpleName();
            error.errorField = null;
            error.errorMessage = violation.getMessage();
            error.errorPath = null;
            error.errorRoot = null;
            error.badValue = violation.getInvalidValue().toString();
            newException.getValidationErrorResponse().addValidationError(error);
        }
        return newException;
    }
    
    

    public static SalsaValidationException fromBindingResult(BindingResult result) {
        SalsaValidationException newException = new SalsaValidationException();
        for (ObjectError oe : result.getAllErrors()) {
            if (oe instanceof FieldError) {
                FieldError fe = (FieldError) oe;
                ValidationError error = new ValidationError();
                error.errorCode = fe.getCode();
                error.errorField = fe.getField();
                error.errorMessage = fe.getDefaultMessage();
                error.errorPath = null;
                error.errorRoot = fe.getObjectName();
                error.badValue = fe.getRejectedValue() == null ? null : fe.getRejectedValue().toString();
                newException.getValidationErrorResponse().addValidationError(error);

            }
            else {
                log.error("Ignored Error Type : {}\n{}", oe.getClass(), oe);
            }
        }
        return newException;
    }

    public static SalsaValidationException fromMessageNotReadableException(HttpMessageNotReadableException ex) {
        SalsaValidationException newException = new SalsaValidationException(ex);
        if (ex.getCause() instanceof JsonMappingException) {
            JsonMappingException jme = (JsonMappingException) ex.getCause();
            ValidationError error = new ValidationError();
            /*
             * System.out.println(jme.getLocalizedMessage()); System.out.println(jme.getMessage());
             * System.out.println(jme.getPathReference()); System.out.println(jme.getCause());
             * System.out.println(jme.toString()); System.out.println(jme.getLocation());
             * System.out.println(jme.getPath()); System.out.println(jme.getPathReference());
             */
            error.errorCode = null;
            if ((jme.getPath() != null) && (jme.getPath().size() > 0 )) {
                error.errorField = jme.getPath().get(jme.getPath().size() - 1).getFieldName();
            }
            error.errorMessage = jme.toString();
            if ((jme.getPath() != null) && (jme.getPath().size() > 0 )) {
                error.errorPath = jme.getPath().get(0).getFieldName();
            }
            error.errorRoot = null;
            error.badValue = null;
            newException.getValidationErrorResponse().addValidationError(error);

        }
        // e.g. JsonParseException or any other exception
        else {
            ValidationError error = new ValidationError();

            /*
             * System.out.println(ex.getLocalizedMessage()); System.out.println(ex.getMessage());
             * System.out.println(ex.getCause()); System.out.println(ex.toString());
             * System.out.println(ex.getRootCause());
             */

            error.errorCode = null;
            error.errorField = null;
            error.errorMessage = ex.getCause().toString();
            error.errorPath = null;
            error.errorRoot = null;
            error.badValue = null;
            newException.getValidationErrorResponse().addValidationError(error);
        }

        return newException;
    }


    public static SalsaValidationException fromServiceException(ServiceException ex) {
        SalsaValidationException newException = new SalsaValidationException(ex);
        ValidationError error = new ValidationError();
        error.errorCode = null;
        error.errorField = null;
        error.errorMessage = ex.toString();
        error.errorPath = null;
        error.errorRoot = null;
        error.badValue = null;
        newException.getValidationErrorResponse().addValidationError(error);
        return newException;
    }

    
    public static SalsaValidationException fromForbiddenException(ForbiddenException ex) {
        SalsaValidationException newException = new SalsaValidationException(ex);
//        ValidationError error = new ValidationError();
//        error.errorCode = null;
//        error.errorField = null;
//        error.errorMessage = ex.toString();
//        error.errorPath = null;
//        error.errorRoot = null;
//        error.badValue = null;
//        newException.getValidationErrorResponse().addValidationError(error);
        return newException;
    }
    
}
