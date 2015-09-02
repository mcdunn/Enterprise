package com.markcdunn.core.services;

/**
 * Base Service Exception class.
 * 
 * @author gtassone
 *
 */
public class ServiceException
        extends Exception {

    /**
     * 
     */
    private static final long serialVersionUID = 1L;
 
    private ServiceExceptionType type;
    private String message;

    public ServiceException(ServiceExceptionType type) {
        this(type, null, null);
    }

    public ServiceException(ServiceExceptionType type, Exception exception) {
        this(type, exception, null);
    }

    public ServiceException(ServiceExceptionType type, String message) {
        this(type, null, message);
    }

    public ServiceException(ServiceExceptionType type, Exception exception, String message) {
        super(message, exception);
        this.type = type;
        this.message = message;
    }

    public ServiceExceptionType getType() {
        return type;
    }

    public String getMessage() {
        if (message != null) {
            return message;
        }
        return super.getMessage();
    }
}
