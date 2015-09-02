package com.markcdunn.auth.spring;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.method.HandlerMethod;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;

public class AuthInterceptor
        extends HandlerInterceptorAdapter {

	private static final Log log = LogFactory.getLog(AuthInterceptor.class);

	// TODO: use one authInterceptor but make the exceptions to what requires
	// authorization configurable?

	@Autowired
	UserSecurityService userSecurityService;

	@Override
	// @Metered(name = "pageRequest", group = "Requests", rateUnit =
	// java.util.concurrent.TimeUnit.MINUTES)
	public boolean preHandle(HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse, Object object)
			throws Exception {

		// TODO: fix this code... it's too long and it's ugly

		// Set the Request Url in the request object to get the base for the
		// app.
		String requestUrl = httpServletRequest.getRequestURL().toString();

		log.debug("Checking access to URL: " + requestUrl);

		String contextPath = httpServletRequest.getContextPath();
		if (StringUtils.isBlank(contextPath)) {
			contextPath = "/";
		}
		requestUrl = requestUrl.substring(0,
				requestUrl.indexOf(contextPath, 10) + contextPath.length());
		if (!contextPath.equals("/")) {
			requestUrl += "/";
		}
		httpServletRequest.setAttribute("requestBaseUrl", requestUrl);

		// TODO: Configure globals like version number, etc here. A lot of these
		// should come from properties files
		// httpServletRequest.setAttribute("appName", "SALSA");
		// httpServletRequest.setAttribute("versionNumber", "0.0.0.0");
		// httpServletRequest.setAttribute("environmentName", "DEVELOPMENT");
		// httpServletRequest.setAttribute("copyrightYears", "2014");
		// httpServletRequest.setAttribute("contextPath",
		// httpServletRequest.getContextPath());

		String requestUri = httpServletRequest.getRequestURI();
		// TODO: Consider changing this so that we can decorate "safe"
		// controllers/urls with a UserAccessRestriction setting
		// (authenticationNotRequired)
		// TODO: indicating that the page does not require the users to be
		// logged in. e.g. log in page, account request page, help page?
		// TODO: hard coding URIs here is not very elegant
		// TODO: also, CSS and JS requests should NOT be going through here...
		// configure a resources handler, please!
		if (requestUri.endsWith(".js") || requestUri.endsWith(".css")
				|| requestUri.endsWith(".html") || requestUri.endsWith(".png")) {
			return true;
		}

		HttpSession session = httpServletRequest.getSession();
		// String userId = (String)session.getAttribute("salsa.userId");

		// if (log.isDebugEnabled()){
		// log.debug("Authentication userId = " + userId);
		// }

		// TODO: Find a better way to do this...
		// For handling redirect requests, extract out the target of the
		// redirect first.
		/*
		 * if (httpServletRequest.getRequestURI().contains("/redir/")) {
		 * requestURI = requestURI.substring(requestURI.indexOf("/redir/") + 6);
		 * log.debug("Intercepted a redirect request.  redirectURL = " +
		 * requestURI); session.setAttribute("redirectURL", requestURI); }
		 */
		// If there is no user data in the session, the user is not logged in
		/*
		 * if (StringUtils.isBlank(userId)) {
		 * 
		 * // If this was an AJAX request, it is probably something embedded in
		 * a page or a popup, sending the HTML for // the log in page is simply
		 * going to get parsed incorrectly and display an error (or nothing at
		 * all) // Instead, for any AJAX request that we get, we are going to
		 * send back an error in the response that will // will indicate that
		 * the page where the AJAX request was made needs to send the users back
		 * to the log in page // This solves the problem of a users sitting on a
		 * page with AJAX until their session times out and then // clicking
		 * refresh or something else that launches an AJAX request and they end
		 * up with strange results if
		 * (HttpRequestUtils.isAjaxRequest(httpServletRequest)){
		 * httpServletResponse.sendRedirect(httpServletRequest.getContextPath()
		 * + "/authorizationErrorJSON"); return false; } else {
		 * httpServletResponse.sendRedirect(httpServletRequest.getContextPath()
		 * + "/logIn"); return false; } }
		 */

		// TODO: return 403 for AJAX requests that fail auth check

		// Get user data from the session
		// TODO: salsa.users, etc should be a constant somewhere
		User user = (User) session.getAttribute("salsa.user");
		// httpServletRequest.setAttribute("user", user);
		// Organization organization =
		// (Organization)session.getAttribute("salsa.organization");
		// httpServletRequest.setAttribute("organization", organization);

		// Allow the application to specify a URL to go back to after logging
		// back in? This is tricky since the application
		// is most likely NOT completely RESTful and may rely on some
		// statefullness somewhere...
		/*
		 * String redirectURL = (String) session.getAttribute("redirectURL"); if
		 * (redirectURL != null) { session.removeAttribute("redirectURL"); if
		 * (log.isDebugEnabled()){ log.debug("Redirecting to: " + redirectURL);
		 * }
		 * httpServletResponse.sendRedirect(httpServletRequest.getContextPath()
		 * + redirectURL); return false; }
		 */

		// TODO: devOnly and internalOnly are flags we should be able to set
		// TODO: somewhere/somehow to allow us to lock the application(s)
		// temporarily
		// The point of devOnly is to allow us to lock the entire application
		// with 1 setting so that only developers can access it
		// The point of internalOnly is two-fold:
		// 1 Allow us to lock the application to the outside world temporarily,
		// e.g. shortly after a new release
		// 2 Allow us to limit access to internal facing portals so that they
		// can not ever be accessed outside the firewall
		boolean devOnly = false;
		boolean internalOnly = false;

		if (devOnly) {
			log.warn("Note that the system is in developer-only mode.");
			PageNotificationUtils
					.addError(
							"The system is currently unavailable.  "
									+ "Try again in a few moments, or contact a system administrator for additional information.",
							session);
		}

		if (internalOnly) {
			log.warn("Note that the system is in internal-only mode.");
			PageNotificationUtils
					.addError(
							"The system is currently unavailable.  "
									+ "Try again in a few moments, or contact a system administrator for additional information.",
							session);
		}

		final boolean userAuthorized = checkUserAccess(httpServletRequest,
				object, user, devOnly, internalOnly);
		if (!userAuthorized) {
			log.info("Blocking user's access to " + requestUri);
			// TODO: Should audit this probably
			if (user == null) {
				log.info("Unauthenticated user attempted to access "
						+ requestUri + " redirecting to login page");
				session.setAttribute("redirectUrl", requestUri);
				httpServletResponse.sendRedirect(requestUrl + "auth/logIn");
			}
            else {
                session.setAttribute("redirectUrl", requestUri);
				httpServletResponse.sendRedirect(requestUrl + "auth/accessDenied");
			}
			return false;
		} else {

			// if user wants go to login page, let it be
			if (requestUri.contains("auth/logIn")&& user!=null) {
				log.info("user attempted to access to login page");
				safeSessionInvalidate(session);
				// session.setAttribute("redirectUrl", requestUri);
				httpServletResponse.sendRedirect(requestUrl + "auth/logIn");
				return false;
			}
		}

		// Add the Page object to the request so it can be used by the
		// breadcrumbs
		addPageInfo(httpServletRequest, object);

		// hack to add system build properties to the request (for access by
		// footer)
		// Properties buildProperties =
		// (Properties)applicationContext.getBean("buildProperties");
		// httpServletRequest.setAttribute("buildProperties", buildProperties);

		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
	}

	private void safeSessionInvalidate(HttpSession session) {
		try {
			session.invalidate();
		} catch (Exception e) {
			// ignore
		}
	}

	/**
	 * @param handler
	 *            handler
	 * @param user
	 *            users entity to check for access permission
	 * @return true/false
	 * @throws Exception
	 */
	private boolean checkUserAccess(HttpServletRequest httpServletRequest,
			Object handler, User user, boolean devOnly, boolean internalOnly) {

		if (!(handler instanceof HandlerMethod)) {
			log.debug("Handler object is not a HandlerMethod, returning true.");
			return true;
		}

		HandlerMethod handlerMethod = (HandlerMethod) handler;
		Object targetBean = handlerMethod.getBean();
		Method targetMethod = handlerMethod.getMethod();

		// If the target method is not null and is annotated, check its access
		// restrictions
		// Check the method first because it can only be more restrictive than
		// class level, not less
		if ((targetMethod != null)
				&& targetMethod
						.isAnnotationPresent(UserAccessRestrictions.class)) {
			Annotation annotation = targetMethod
					.getAnnotation(UserAccessRestrictions.class);
			if (!isUserAccessPermitted(annotation, user, devOnly, internalOnly)) {
				return false;
			}
		}

		// If the class is not null and is annotated, check its access
		// restrictions
		if ((targetBean != null)
				&& targetBean.getClass().isAnnotationPresent(
						UserAccessRestrictions.class)) {
			Annotation annotation = targetBean.getClass().getAnnotation(
					UserAccessRestrictions.class);
			if (!isUserAccessPermitted(annotation, user, devOnly, internalOnly)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * @param annotation
	 *            annotation with arguments
	 * @param user
	 *            users entity to validate
	 * @return true/false
	 */
	private boolean isUserAccessPermitted(Annotation annotation, User user,
			boolean requiresDeveloper, boolean requiresInternalUser) {

		if (annotation == null) {
			log.debug("No annotation, returning default true.");
			return true;
		}

		if (annotation instanceof UserAccessRestrictions) {
			UserAccessRestrictions userAccessRestrictions = (UserAccessRestrictions) annotation;

			// If access is not restricted, return true
			if (!userAccessRestrictions.accessRestricted()) {
				log.debug("Access Restriction has accessRestricted as false, permitting access.");
				return true;
			}

			// If access is restricted and we have no user data, return false
			if (user == null) {
				return false;
			}

			// Determine if user is authorized
			AccessRestrictions accessRestrictions = new AccessRestrictions<PermissionEnum>(
					userAccessRestrictions.requiresPermission(),
					userAccessRestrictions.requiresAnyPermission(),
					userAccessRestrictions.requiresAllPermissions(),
					requiresDeveloper, requiresInternalUser);
			return AuthUtils.passesAuthenticationChecks(
					user.getPermissionsSet(), user.isInternalUser(),
					accessRestrictions);
		}

		return true;
	}

	private void addPageInfo(HttpServletRequest httpServletRequest,
			Object handler) {
		if (!(handler instanceof HandlerMethod)) {
			log.debug("Handler object is not a HandlerMethod, returning.");
			return;
		}

		// If the target method is not null and is annotated with a PageId, use
		// it to add a Page object to the request
		HandlerMethod handlerMethod = (HandlerMethod) handler;
		Method targetMethod = handlerMethod.getMethod();
		if ((targetMethod != null)
				&& targetMethod.isAnnotationPresent(PageId.class)) {
			Annotation annotation = targetMethod.getAnnotation(PageId.class);
			PageId pageId = (PageId) annotation;
			if (!StringUtils.isBlank(pageId.value())) {
				// TODO: look into the Pages / breadcrumbs design... right now
				// Pages is in Core Portal which is probably wrong
				httpServletRequest.setAttribute("page",
						Pages.getPage(pageId.value()));
			}
		}

	}
}