package com.markcdunn;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HomeController {

    @RequestMapping(value="home")
    @ResponseBody
    public String goHome() {
        return "TEST";
    }
}
