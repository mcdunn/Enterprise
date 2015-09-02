package com.markcdunn.auth.rest_services;

import java.net.InetAddress;
import java.util.HashSet;
import java.util.Properties;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
@UserAccessRestrictions(accessRestricted = false)
public class AuthController {

    private static final Log log = LogFactory.getLog(AuthController.class);

    private static final String logInPage = "/WEB-INF/jsp/authentication/log_in.jsp";
    private static final String accessDeniedPage = "/WEB-INF/jsp/authentication/accessDenied.jsp";

    @Autowired
    @Qualifier("legacyAuthenticationService")
    private AuthenticationService authenticationService;

    @Autowired
    @Qualifier("salsaProperties")
    public Properties props;

    @RequestMapping(value = "/auth/logIn", method = RequestMethod.GET)
    public String showLogInPage(HttpServletRequest request, HttpServletResponse response) {

        log.error("showLogInPage called");

        if (isUserLoggedIn(request)) {
            log.debug("User is already logged in to the system.");
            try {
                response.sendRedirect((String) request.getSession().getAttribute("redirectUrl"));
            }
            catch (Exception e) {
                try {
                    response.sendRedirect(request.getContextPath() + "/");
                }
                catch (Exception ex) {
                    // Do nothing
                }
            }
            return null;
        }
        return logInPage;
    }

    @RequestMapping(value = "/auth/logIn", headers = {"content-type=application/x-www-form-urlencoded"},
            method = RequestMethod.POST)
    @ResponseBody
    public AuthResponse doFormLogIn(HttpServletRequest request, HttpSession session, AuthRequest authRequest) {
        return doLogIn(request, session, authRequest);
    }

    @RequestMapping(value = "/auth/logIn", headers = {"content-type=application/json"}, method = RequestMethod.POST)
    @ResponseBody
    public AuthResponse doJsonLogIn(HttpServletRequest request, HttpSession session,
            @RequestBody AuthRequest authRequest) {
        return doLogIn(request, session, authRequest);
    }

    private AuthResponse doLogIn(HttpServletRequest request, HttpSession session, @RequestBody AuthRequest authRequest) {
        log.info("doLogIn called");

        String redirectUrl = (String) request.getSession().getAttribute("redirectUrl");
        log.info("redirectUrl = " + redirectUrl);

        log.error("userId = " + authRequest.getUserId() + " password = " + authRequest.getPassword());

        if (isUserLoggedIn(request)) {
            log.debug("User is already logged in to the system.");
            return new AuthResponse(true, redirectUrl);
        }

        User user;
        try {
            String userAgent = HttpRequestUtils.getUserAgent(request);
            InetAddress inetAddress = HttpRequestUtils.remoteIp(request);
            log.info("Authenticating users with userId = '" + authRequest.getUserId() + "', userAgent = '" + userAgent
                    + "', inetAddress = '" + inetAddress + "'.");

            Boolean ignoreSecurity = null;
            // enable system enviroment var setting first
            if (StringUtils.isNotBlank(System.getProperty("salsa.ignoreInternalUserSecurity"))) {

                ignoreSecurity = Boolean.valueOf(System.getProperty("salsa.ignoreInternalUserSecurity"));

            }

            if (ignoreSecurity == null) {
                ignoreSecurity = Boolean.valueOf(props.getProperty("salsa.ignoreInternalUserSecurity"));
            }
            if (ignoreSecurity) {
                // Role role = new RoleEntity();
                // user = new org.usac.salsa.core.entities.impl.users.UserEntity();
                user = UserEntity.newInstance();
                Set<PermissionEnum> permissions = new HashSet<>();
                for (PermissionEnum permission : PermissionEnum.getAllEnums()) {
                    if (permission != null) {
                        permissions.add(permission);
                    }
                }

                user.setPermissionsSet(permissions);
                // user.setRole(role);
            }
            else {
                if (StringUtils.isBlank(authRequest.getUserId())) {
                    log.info("Blank user id submitted to Log In");
                    return new AuthResponse(false);
                }

                if (StringUtils.isBlank(authRequest.getPassword())) {
                    log.info("Blank password submitted to Log In");
                    return new AuthResponse(false);
                }

                user =
                        authenticationService.logIn(authRequest.getUserId(), authRequest.getPassword(), session,
                                userAgent, inetAddress);
                // Set<PermissionEnum> permissions = new HashSet<>();
                // permissions.add(PermissionEnum.SYSTEM_ADMINISTRATION);
                // Role role = new RoleEntity();
                // role.setPermissionsSet(permissions);
                // user = new UserEntity();
                // user.setRole(role);

                if (user == null) {
                    log.info("Attempt to login failed, userId = " + authRequest.getUserId());
                    return new AuthResponse(false);
                }
            }

            // Login valid, add to session:
            session.setAttribute("salsa.user", user);
            session.setAttribute("salsa.userId", authRequest.getUserId());

            if (StringUtils.isBlank(redirectUrl)) {
                redirectUrl = request.getContextPath();
            }

            log.info("Log In successful, redirecting to " + redirectUrl);
            return new AuthResponse(true, redirectUrl);
        }
        catch (AuthenticationException e) {
            log.warn("An AuthenticationException was encountered while attempting to validate login for userId ='"
                    + authRequest.getUserId() + "'");
            return new AuthResponse(false);
        }
        catch (Exception e) {
            log.error("A failure occurred while attempting to validate login for userId = '" + authRequest.getUserId()
                    + "'", e);
            return new AuthResponse(false);
        }
    }

    @RequestMapping(value = "/auth/accessDenied")
    public ModelAndView doAccessDenied(HttpServletRequest request) {
        ModelMap modelMap = new ModelMap();
        modelMap.put("redirectUrl", request.getSession().getAttribute("redirectUrl"));
        ModelAndView modelAndView = new ModelAndView(accessDeniedPage, modelMap);
        return modelAndView;
    }

    @RequestMapping(value = "/auth/logOut")
    public void doLogOut(HttpServletRequest httpServletRequest) {
        User user = (User) httpServletRequest.getSession().getAttribute("salsa.user");
        if (user != null) {
            authenticationService.logOut(user, httpServletRequest.getSession());
        }
    }

    @RequestMapping(value = "/auth/authorizationError")
    @ResponseBody
    public AuthorizationErrorResponse returnAuthorizationError() {
        return new AuthorizationErrorResponse();
    }

    private boolean isUserLoggedIn(HttpServletRequest httpServletRequest) {
        HttpSession session = httpServletRequest.getSession();
        String userName = (String) session.getAttribute("salsa.userId");
        return !StringUtils.isBlank(userName);
    }
}
