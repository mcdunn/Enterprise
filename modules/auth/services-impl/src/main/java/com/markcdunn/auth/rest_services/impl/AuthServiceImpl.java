package com.markcdunn.auth.rest_services.impl;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.net.InetAddress;
import java.util.Date;

public class AuthServiceImpl
        implements AuthService {

    private static final Log log = LogFactory.getLog(AuthServiceImpl.class);

// TODO: FIX this... add exception types
    private static final String AUTH_DENIED_MESSAGE = "The User ID / Password entered does not match our records";
    private static final String AUTH_FAILURE_MESSAGE = "The system encountered an error while authenticating the User Id / Password.";
    private static final String ACCOUNT_LOCKED_OUT = "This user account has been temporarily locked because of too many failed log in attempts.  Please try again later.";
    private static final String ACCOUNT_SUSPENDED = "This user account has been locked. Please contact the system administrator for help.";
    private static final String ACCOUNT_EXPIRED = "This user account has expired because it has been inactive for too long. Please contact the system administrator for help.";
    private static final String ACCOUNT_PENDING_APPROVAL = "This user account has not yet been approved by a system administrator, and therefore is not yet ready for use.";
    private static final String ACCOUNT_DEACTIVATED = "This user account has been deactivated. If you believe this is an error, please contact the system administrator for help.";

    @Override
    public User logIn(String userId, String password, HttpSession session, String userAgentString, InetAddress inetAddress){
        log.info("Authenticating user with userName = '" + userId + "'.");
        User user;
        try {
            user = getUserDataService().getEntity(userId);
            log.info("Attemping to authenticate, user = " + user);
            boolean userAuthenticated = authenticateUser(user, password);
            if ((user == null) || (user.getAccountStatus() == null)) {
                getAuthenticationAuditService().auditLogInFailureUnknownUser(userId, inetAddress);
                throw new AuthenticationException(AUTH_DENIED_MESSAGE);
            }
            switch (user.getAccountStatus()) {
                case PENDING_APPROVAL:
                    getAuthenticationAuditService().auditLogInFailure(UserAccountStatusEnum.PENDING_APPROVAL, user.getId(), inetAddress);
                    throw new AuthenticationException(ACCOUNT_PENDING_APPROVAL);
                case EXPIRED:
                    getAuthenticationAuditService().auditLogInFailure(UserAccountStatusEnum.EXPIRED, user.getId(), inetAddress);
                    throw new AuthenticationException(ACCOUNT_EXPIRED);
                case DEACTIVATED:
                    getAuthenticationAuditService().auditLogInFailure(UserAccountStatusEnum.DEACTIVATED, user.getId(), inetAddress);
                    throw new AuthenticationException(ACCOUNT_DEACTIVATED);
                case SUSPENDED:
                    getAuthenticationAuditService().auditLogInFailure(UserAccountStatusEnum.SUSPENDED, user.getId(), inetAddress);
                    throw new AuthenticationException(ACCOUNT_SUSPENDED);
                case LOCKED_OUT:
// TODO: If they are already locked out, check the lockout rules and allow them to log in if they meet the criteria
// TODO: otherwise, deny login and log the event
/*                    Date lastFailedLoginAttempt = user.getUserAccountStatusDate();
                    long failedLoginLockDurationMin = systemConfiguration.getAccountLockoutDurationMins();
                    Date now = new Date();
                    float timeDifferenceMin = (float) (now.getTime() - lastFailedLoginAttempt.getTime()) / (1000 * 60);

                    if ((timeDifferenceMin > failedLoginLockDurationMin) && (failedLoginLockDurationMin != ACCOUNT_LOCKED_INFINITY)) {
                        // Clear the lock and let them attempt to login x times again.
                        transactionCommands.unlockAccount(user.getId(), inetAddress);
                        // refresh user since processing will continue
                        entityManager.refresh(user);
                    }
                    else {
                        transactionCommands.lockAccount(user.getId(), inetAddress);
                        // no need to refresh user as we are raising an exception
                        throw new AuthenticationException(ACCOUNT_LOCKED_AUTO);
                    }*/
                    getAuthenticationAuditService().auditLogInFailure(UserAccountStatusEnum.LOCKED_OUT, user.getId(), inetAddress);
                    throw new AuthenticationException(ACCOUNT_LOCKED_OUT);
            }

            if (!userAuthenticated) {
                getAuthenticationAuditService().auditLogInFailureInvalidPassword(userId, inetAddress);
                log.info("User " + userId + " attempted login with invalid password.");

                // Lockout the user account if too many failed attempts.
//                if (checkUserAccountLockout(user.getId(), systemConfiguration, inetAddress)) {
                    // no need to refresh user as we are raising an exception
//                    throw new AuthenticationException(ACCOUNT_LOCKED_OUT);
//                } else {
//                    throw new AuthenticationException(AUTH_DENIED_MESSAGE);
//                }
            }
        }
        catch (AuthenticationException ae){
            throw ae;
        }
        catch (Exception e) {
            log.error("A failure occurred while attempting to validate login for'" + userId + "'.", e);
            throw new AuthenticationException(AUTH_FAILURE_MESSAGE);
        }

// TODO: only allow a single login at a time?
        // remove any existing session for this user
//        if (getUserSessionService().existsUserSession(username) && !systemConfiguration.isAllowConcurrentLogins()) {
//            auditLogService.logAuditLogMessage(new AuditLogMessage(AuditLogTypeEnum.AUTH_FORCE_LOGOUT,
//                    user.getMasterUnitList().getMasterUnitListNumber(), user.getUsername(),
//                    "System configuration disallows concurrent logins, prior user session invalidated."));
//            log.info("Login destroying current session for userIf='" + userId + "'.");
//            getUserSessionService().removeUserSession(username);
//        }

        // register session
        getUserSessionService().addUserSession(user, session);

        // log success
        getAuthenticationAuditService().auditLogIn(user.getId(), inetAddress);

        // update last login date
        user.setLastLogInDate(new Date());

        // set internal user flag
        if (isInternalInetAddress(inetAddress)) {
            user.setInternalUser(true);
        }
        else {
            user.setInternalUser(false);
        }

        return user;
    }

    @Override
    public void logOut(User user, HttpSession session){
        try {
            session.invalidate();
        }
        catch (Exception e){
            // ignore
        }

        getUserSessionService().removeUserSession(user);
// TODO: audit log entry for this
//        InetAddress inetAddress = (InetAddress)session.getAttribute("salsa.logIn.inetAddress");
//        getAuthenticationAuditService().auditLogOut(user.getId(), inetAddress);
    }

// TODO: Support setting account status here, maybe password reset as well?
// TODO: These activities should all be logged to the audit log
// TODO: Does this belong here or in OrganizationSecurityService? Or just OrganizationDataService
/*
    public void unlockAccount(String userId, InetAddress inetAddress){
        User user = userDao.getUser(userId);
        user.setAccountStatus(OrganizationStatus.ACTIVE);
        getAuthenticationAuditService().auditAccountStatusChanged(user.getId(), inetAddress);
    }

    public void suspendAccount(String userId, InetAddress inetAddress){
        User user = userDao.getUser(userId);
        user.setAccountStatus(OrganizationStatus.SUSPENDED);
        getAuthenticationAuditService().auditAccountSuspended(userId, inetAddress);
    }

    public void lockOutAccount(String userId, User admin, InetAddress inetAddress){
        User user = userDao.getUser(userId);
        user.setAccountStatus(OrganizationStatus.LOCKED_OUT);
        getAuthenticationAuditService().auditAccountLockedOut(userId, admin, inetAddress);
    }
*/
    public boolean setUserAccountLockout(String userId, InetAddress inetAddress) {
/*
        boolean lockOut = false;
        User user = userDao.getUser(userId);
// TODO: each system needs to identify itself and then separate configs for each system can be maintained in the database
SystemConfiguration systemConfiguration = systemConfigurationService.getSystemConfiguration();
        if ((systemConfiguration.getMaxFailedLoginAttemptsLockoutCount() > 0) &&
            !(user.getAccountStatus() == OrganizationStatus.PROTECTED)) {
            int failedLoginAttempts = getLastConsecutiveLoginAttemptFailedCount(userId, PWD_ATTEMPT_WINDOW_DAYS);
            if (failedLoginAttempts >= systemConfiguration.getMaxFailedLoginAttemptsLockoutCount()) {
                user.setAccountStatus(OrganizationStatus.LOCKED_BY_FAILURES);
                getAuthenticationAuditService().logAccountLocked(userId, inetAddress);
                userDao.modifyUser(user);
                return true;
            }
        }*/
        return false;
    }

    private boolean authenticateUser(User user, String password) {
        log.debug("Attempting to authenticate " + user);
        if (StringUtils.isBlank(password)) {
            log.info("A blank password was provided for authentication, denied.");
            return false;
        }

        String hashPassword = EncryptionUtils.calculateHash(password);
        if ((user != null) && (user.getPwdHash() != null) && user.getPwdHash().equals(hashPassword)) {
            log.info("The password matches for " + user + ", access permitted.");
            return true;
        }
        else {
            log.info("The password does not match for " + user + ", access denied.");
            return false;
        }
    }

    private boolean isInternalInetAddress(InetAddress inetAddress) {
        // TODO: implement some logic to check for IP address inside the firewall
        return true;
    }

    protected UserDataService getUserDataService() {
        return null;
    }

    protected AuthenticationAuditService getAuthenticationAuditService() {
        return null;
    }

    protected UserSessionService getUserSessionService() {
        return null;
    }

//    protected SystemConfigurationService getSystemConfigurationService() {
//        return null;
//    }
}
