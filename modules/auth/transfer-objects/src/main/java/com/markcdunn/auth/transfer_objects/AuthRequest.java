package com.markcdunn.auth.transfer_objects;

public class AuthRequest {

    private String userId;
    private String password;

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserId() {
        return userId;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }
}
