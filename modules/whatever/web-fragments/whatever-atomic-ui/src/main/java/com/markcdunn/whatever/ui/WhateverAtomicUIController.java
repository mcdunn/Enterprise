package com.markcdunn.whatever.ui;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Controller
@RequestMapping(value = "/whatevers")
//@UserAccessRestrictions(requiresPermission = PermissionEnum.WHATEVER)
public class WhateverAtomicUIController {

    private static final Logger log = LoggerFactory.getLogger(WhateverAtomicUIController.class);

    private final String page = "/WEB-INF/jsp/whatever_atomic/whatever.jsp";

    /**
     * Processes GET requests to access the Whatevers Page.
     *
     * @return ModelAndView for the Whatevers Page
     */
    @RequestMapping(value = "/atomic", method = RequestMethod.GET, produces="text/html")
    public ModelAndView showPage(HttpServletRequest request, @RequestParam Map<String, String> parameters, ModelMap modelMap) {
        try {
            modelMap.put("parameters", new ObjectMapper().writer().writeValueAsString(parameters));
        }
        catch (Exception e) {
            modelMap.put("parameters", "{}");
        }
        return new ModelAndView(page, modelMap);
    }
}
