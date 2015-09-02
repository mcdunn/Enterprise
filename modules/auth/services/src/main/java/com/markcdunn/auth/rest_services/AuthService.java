package com.markcdunn.auth.rest_services;

import org.usac.salsa.core.model.users.User;

import javax.servlet.http.HttpSession;

import java.net.InetAddress;

public interface AuthService {

    /**
     * Log In using userId/password
     * @param userId userId
     * @param password password
     * @return User
     */
    User logIn(String userId, String password, HttpSession session, String userAgentString, InetAddress inetAddress);

    /**
     * Log Out users
     * @param user the logged in users
     * @param session the users's session
     */
    void logOut(User user, HttpSession session);
}
