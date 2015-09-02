package com.markcdunn.auth.spring;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.net.InetAddress;

@Service("authService")
public class AuthServiceSpring
        extends AuthServiceImpl {

    private static final Log log = LogFactory.getLog(AuthServiceSpring.class);

    @Autowired
    private UserDataService userDataService;

    @Autowired
    private AuthenticationAuditService authenticationAuditService;

    @Autowired
    private UserSessionService userSessionService;

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRED, readOnly = false)
    public User logIn(String userId, String password, HttpSession session, String userAgentString,
                            InetAddress inetAddress){
        return super.logIn(userId, password, session, userAgentString, inetAddress);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void logOut(User user, HttpSession session){
        super.logOut(user, session);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public boolean setUserAccountLockout(String userId, InetAddress inetAddress) {
        return super.setUserAccountLockout(userId, inetAddress);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected UserDataService getUserDataService() {
        return userDataService;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected AuthenticationAuditService getAuthenticationAuditService() {
        return authenticationAuditService;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected UserSessionService getUserSessionService() {
        return userSessionService;
    }
}
