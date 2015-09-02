package com.markcdunn.auth.transfer_objects;

import java.io.Serializable;

public class AuthResponse
        implements Serializable {

    private Boolean authorized;
    private String redirectUrl;

    public AuthResponse(Boolean isAuthorized) {
        this.authorized = isAuthorized;
    }

    public AuthResponse(Boolean isAuthorized, String redirectUrl) {
        this.authorized = isAuthorized;
        this.redirectUrl = redirectUrl;
    }

    public Boolean getAuthorized() {
        return authorized;
    }

    public String getRedirectUrl() {
        return redirectUrl;
    }
}
