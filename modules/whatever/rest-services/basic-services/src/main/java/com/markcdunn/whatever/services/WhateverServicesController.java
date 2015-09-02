package com.markcdunn.whatever.services;

import com.markcdunn.core.daos.search.SearchResults;
import com.markcdunn.core.model.Modification;
import com.markcdunn.core.model.ModificationType;
import com.markcdunn.core.services.ServiceException;
import com.markcdunn.core.services.ServiceExceptionType;
import com.markcdunn.core.spring.exceptions.BadRequestException;
import com.markcdunn.core.spring.exceptions.ForbiddenException;
import com.markcdunn.core.spring.exceptions.InternalServerErrorException;
import com.markcdunn.core.spring.exceptions.NotFoundException;
import com.markcdunn.core.spring.responses.DeleteResponse;
import com.markcdunn.whatever.entities.WhateverEntity;
import com.markcdunn.whatever.model.Whatever;
import com.markcdunn.whatever.spring.WhateverCreateResponse;
import com.markcdunn.whatever.spring.WhateverModificationsResponse;
import com.markcdunn.whatever.spring.WhateverModifyResponse;
import com.markcdunn.whatever.transfer_objects.WhateverListWrapper;
import com.markcdunn.whatever.transfer_objects.WhateverModificationWrapper;
import com.markcdunn.whatever.transfer_objects.WhateverWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
//@UserAccessRestrictions(requiresPermission=PermissionEnum.WHATEVER)
public class WhateverServicesController {

    @SuppressWarnings("unused")
    private static Logger log = LoggerFactory.getLogger(WhateverServicesController.class);

    @Autowired
    @Qualifier("whateverDataService")
    private WhateverDataService whateverDataService;

    /**
     * Processes GET requests to retrieve the list of Whatevers.
     *
     * @param request HttpServletRequest
     * @return JSON encoded list of Whatevers
     */
    @RequestMapping(value = "/whatevers", method = RequestMethod.GET, produces="application/json")
//    @WhateverAccessRestrictions(requiresPermission = PermissionEnum.WHATEVER)
    @ResponseBody
    public WhateverListWrapper getWhatevers(HttpServletRequest request, @RequestParam Map<String, String> parameters) {
        log.info("getWhatevers called");

        try {
            WhateverSearchCriteria criteria = new WhateverSearchCriteria(parameters);
            SearchResults<Whatever> results = whateverDataService.search(criteria);
            return new WhateverListWrapper(results.getResults());
        }
        catch (ServiceException e) {
            String message = "Unable to retrieve Whatevers";
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
            String message = "Unable to retrieve Whatevers";
            log.error(message, e);
            throw new InternalServerErrorException(message);
        }
    }

    /**
     * Processes GET requests to retrieve a Whatever.
     *
     * @param id The id of the Whatever to retrieve
     * @return JSON encoded Whatever object
     */
    @RequestMapping(value ="/whatever/{id}", method = RequestMethod.GET)
    @ResponseBody
//    @VerifyAccess("whatevers", id)
    public WhateverWrapper getWhatever(HttpServletRequest request, @PathVariable String id) {
        log.info("getWhatever called id = " + id);

        try {
            Whatever whatever = whateverDataService.get(id);
            if (whatever != null) {
                return new WhateverWrapper(whatever);
            }
            else {
                String message = "Whatever '" + id + "' not found";
                log.error(message);
                throw new NotFoundException(message);
            }
        }
        catch (ServiceException e) {
            String message = "Unable to retrieve Whatever '" + id + "'";
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
            String message = "Unable to retrieve Whatever '" + id + "'";
            log.error(message, e);
            throw new InternalServerErrorException(message);
        }
    }

    /**
     * Processes PUT requests to update a Whatever.
     * If the Whatever is not found, it returns an error rather than create a new one.
     *
     * @param id The id of the Whatever to update
     * @param whateverWrapper The Whatever to create
     * @param errors Validation errors
     * @return JSON encoded Whatever object
     */
    @RequestMapping(value = "/whatever/{id}", method = RequestMethod.PUT)
//    @VerifyAccess("whatevers", id)
    @ResponseBody
    public WhateverModifyResponse putWhatever(HttpServletRequest request, @PathVariable String id,
           @RequestBody @Valid WhateverWrapper whateverWrapper, BindingResult errors) {
        log.info("putWhatever called id = " + id);

        try {
            Whatever originalWhatever = whateverDataService.get(id);
            if (originalWhatever == null) {
                String message = "Cannot update Whatever '" + id + "', record not found";
                log.error(message);
                throw new NotFoundException(message);
            }

            Whatever whatever = WhateverEntity.newInstance(WhateverEntity.class);
            whateverWrapper.getWhatever(whatever);
            // The ID from the RESTful URL is more reliable than whatever might be in the ID field of the object
            // Override the object's ID value with the value from the URl
            whatever.setId(id);
            whatever = whateverDataService.update(whatever);
            return new WhateverModifyResponse(new WhateverWrapper(whatever));
        }
        catch (ServiceException e) {
            String message = "Unable to modify Whatever '" + id + "'";
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
            String message = "Unable to modify Whatever '" + id + "'";
            log.error(message, e);
            throw new InternalServerErrorException(message);
        }
    }

    /**
     * Processes POST requests to create a Whatever.
     *
     * @param whateverWrapper The Whatever to create
     * @param errors Validation errors
     * @return JSON encoded Whatever object
     */
    @RequestMapping(value ="/whatevers", method = RequestMethod.POST)
    @ResponseBody
    public WhateverCreateResponse postWhatevers(HttpServletRequest request,
            @RequestBody @Valid WhateverWrapper whateverWrapper, BindingResult errors) {
        log.info("postWhatevers called");

        try {
            Whatever whatever = WhateverEntity.newInstance(WhateverEntity.class);
            whateverWrapper.getWhatever(whatever);
            whatever = whateverDataService.create(whatever);
            return new WhateverCreateResponse(new WhateverWrapper(whatever));
        }
        catch (ServiceException e) {
            String message = "Unable to save new Whatever '" + whateverWrapper + "'";
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
            String message = "Unable to save new Whatever '" + whateverWrapper + "'";
            log.error(message, e);
            throw new InternalServerErrorException(message);
        }
    }

    /**
     * Processes DELETE requests to delete a Whatever.
     * If the Whatever is not found, a 404 response is returned
     *
     * @param id The id of the Whatever to delete
     * @return JSON encoded Whatever object
     */
    @RequestMapping(value ="/whatever/{id}", method = RequestMethod.DELETE)
//    @VerifyAccess("whatevers", id)
    @ResponseBody
    public DeleteResponse deleteWhatever(HttpServletRequest request, @PathVariable String id) {
        log.info("deleteWhatever called id = " + id);

        try {
            Whatever whatever = whateverDataService.get(id);
            if (whatever == null) {
                String message = "Cannot delete Whatever '" + id + "', record not found";
                log.error(message);
                throw new NotFoundException(message);
            }
            whateverDataService.delete(whatever);
            return new DeleteResponse();
        }
        catch (ServiceException e) {
            String message = "Unable to delete Whatever '" + id + "'";
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
            String message = "Unable to delete Whatever '" + id + "'";
            log.error(message, e);
            throw new InternalServerErrorException(message);
        }
    }

    /**
     * Processes POST requests to apply Whatever modifications.
     *
     * @param whateverModificationWrappers The Whatever modifications to apply
     * @param errors Validation errors
     */
    @RequestMapping(value ="/whatever/modifications", method = RequestMethod.POST)
    @ResponseBody
    public WhateverModificationsResponse postWhateverModifications(HttpServletRequest request,
            @RequestBody @Valid List<WhateverModificationWrapper> whateverModificationWrappers, BindingResult errors) {
        log.info("postWhateverModifications called");

        try {
            List<Modification<Whatever>> modifications = new ArrayList<>();
            for (WhateverModificationWrapper modificationWrapper : whateverModificationWrappers) {
                Modification<Whatever> modification = new Modification<>();
                modification.setEntity(modificationWrapper.getWhatever(new WhateverEntity()));
                if (Boolean.valueOf(modificationWrapper.getRemoved())) {
                    if (!Boolean.valueOf(modificationWrapper.getAdded())) {
                        modification.setType(ModificationType.DELETE);
                    }
                    else {
                        // If "added" and "deleted" flag are both set, do nothing
                        // If it was already there, it won't be removed and it if wasn't it won't be added
                        continue;
                    }
                }
                else if (Boolean.valueOf(modificationWrapper.getAdded())) {
                    modification.setType(ModificationType.CREATE);
                }
                else {
                    modification.setType(ModificationType.UPDATE);
                }
                modifications.add(modification);
            }
            return new WhateverModificationsResponse(whateverDataService.applyModifications(modifications));
        }
        catch (ServiceException e) {
            String message = "Unable to apply Whatever modifications '" + whateverModificationWrappers + "'";
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
            String message = "Unable to apply Whatever modifications '" + whateverModificationWrappers + "'";
            log.error(message, e);
            throw new InternalServerErrorException(message);
        }
    }
}
