package com.markcdunn.users.management_external;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/users/management")
//@UserAccessRestrictions(requiresPermission = PermissionEnum.USERS_MANAGEMENT)
public class UsersManagementExternalController {

    private static final Logger log = LoggerFactory.getLogger(UsersManagementExternalController.class);

    private final String page = "/WEB-INF/jsp/users/management_external/management_external.jsp";

    /**
     * Processes GET requests to access the Users Management Page.
     *
     * @return ModelAndView for the Users Management Page
     */
    @RequestMapping(value = "", method = RequestMethod.GET)
    public ModelAndView showPage(ModelMap modelMap) {
        return new ModelAndView(page, modelMap);
    }
}
