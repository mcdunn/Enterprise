package com.markcdunn.core.spring.filters;

import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Properties;

/**
 * Servlet filter that adds CORS headers.
 * 
 * @author Mark Dunn
 * 
 */
@Component
public class CorsFilter
        extends GenericFilterBean {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        
        HttpServletResponse response = (HttpServletResponse) res;
//        if (new Boolean(getProperties().getProperty("salsa.corsAllowed"))) {
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
            response.setHeader("Access-Control-Max-Age", "3600");
            response.setHeader("Access-Control-Allow-Headers", "x-requested-with, origin, content-type, accept, pragma");
//        }
        chain.doFilter(req, res);
    }

//    private Properties getProperties() {
//        final WebApplicationContext applicationContext = WebApplicationContextUtils.getWebApplicationContext(this.getServletContext());
//        Properties props = (Properties) applicationContext.getBean("salsaProperties");
//        return props;
//    }

    @Override
    public void destroy() {
    }
}
