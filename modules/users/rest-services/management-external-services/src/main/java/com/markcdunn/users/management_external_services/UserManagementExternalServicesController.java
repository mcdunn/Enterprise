package com.markcdunn.users.management_external_services;

import com.markcdunn.core.daos.search.SearchResults;
import com.markcdunn.core.services.ServiceException;
import com.markcdunn.core.services.ServiceExceptionType;
import com.markcdunn.core.spring.exceptions.BadRequestException;
import com.markcdunn.core.spring.exceptions.ForbiddenException;
import com.markcdunn.core.spring.exceptions.InternalServerErrorException;
import com.markcdunn.core.spring.exceptions.NotFoundException;
import com.markcdunn.users.model.User;
import com.markcdunn.users.services.UserDataService;
import com.markcdunn.users.services.UserSearchCriteria;
import com.markcdunn.users.transfer_objects.UserListWrapper;
import com.markcdunn.users.transfer_objects.UserWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Controller
//@UserAccessRestrictions(requiresPermission=PermissionEnum.USER_MANAGEMENT_EXTERNAL)
public class UserManagementExternalServicesController {

    @SuppressWarnings("unused")
    private static Logger log = LoggerFactory.getLogger(UserManagementExternalServicesController.class);

    @Autowired
    @Qualifier("userDataService")
    private UserDataService userDataService;

    /**
     * Processes GET requests to retrieve the list of Users.
     *
     * @param request HttpServletRequest
     * @return JSON encoded list of Users
     */
    @RequestMapping(value="/users", method=RequestMethod.GET)
//    @UserAccessRestrictions(requiresPermission = PermissionEnum.USER_MANAGEMENT_EXTERNAL)
    @ResponseBody
    public UserListWrapper getUsers(HttpServletRequest request, @RequestParam Map<String, String> parameters) {
        log.info("getUsers called");

        try {
            UserSearchCriteria criteria = new UserSearchCriteria(parameters);
            SearchResults<User> results = userDataService.search(criteria);
            return new UserListWrapper(results.getResults());
        }
        catch (ServiceException e) {
            String message = "Unable to retrieve Users";
            if (e.getType() == ServiceExceptionType.NOT_FOUND) {
                throw new NotFoundException(message);
            }
            log.error(message, e);
            throw new InternalServerErrorException(message);
        }
        catch (BadRequestException | NotFoundException | ForbiddenException e) {
            throw e;
        }
        catch (Exception e) {
            String message = "Unable to retrieve Users";
            log.error(message, e);
            throw new InternalServerErrorException(message);
        }
    }

    /**
     * Processes GET requests to retrieve a User.
     *
     * @param id The id of the User to retrieve
     * @return JSON encoded User object
     */
    @RequestMapping(value ="/user/{id}", method = RequestMethod.GET)
    @ResponseBody
//    @VerifyAccess("users", id)
    public UserWrapper getUser(HttpServletRequest request, @PathVariable String id) {
        log.info("getUser called id = " + id);

        try {
            User user = userDataService.get(id);
            if (user != null) {
                return new UserWrapper(user);
            }
            else {
                String message = "User '" + id + "' not found";
                log.error(message);
                throw new NotFoundException(message);
            }
        }
        catch (ServiceException e) {
            String message = "Unable to retrieve User '" + id + "'";
            if (e.getType() == ServiceExceptionType.NOT_FOUND) {
                throw new NotFoundException(message);
            }
            log.error(message, e);
            throw new InternalServerErrorException(message);
        }
        catch (BadRequestException | NotFoundException | ForbiddenException e) {
            throw e;
        }
        catch (Exception e) {
            String message = "Unable to retrieve User '" + id + "'";
            log.error(message, e);
            throw new InternalServerErrorException(message);
        }
    }
}
