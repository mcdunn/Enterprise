<!doctype html>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<c:set var="baseUrl" value="${pageContext.request.contextPath}/" scope="request"/>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">

        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Whatever Management</title>

        <jsp:include page="../core/angular/angular_styles.jsp">
            <jsp:param name="baseUrl" value="${baseUrl}"/>
        </jsp:include>

        <link rel="stylesheet" href="${baseUrl}resources/whatever_atomic/css/whatever.css">
       
    </head>
    <body ng-app="whatever" ng-controller="whateverCtrl">

        <script>
            var baseUrl = "${baseUrl}";
            var parameters = ${parameters};
        </script>

        <jsp:include page="../core/angular/angular_scripts.jsp">
            <jsp:param name="baseUrl" value="${baseUrl}"/>
        </jsp:include>


        <script src="${baseUrl}resources/whatever_atomic/scripts/whatever.js"></script>
        <script src="${baseUrl}resources/whatever_atomic/scripts/services/data_service.js"></script>
        <script src="${baseUrl}resources/whatever_atomic/scripts/services/error_service.js"></script>
        <script src="${baseUrl}resources/whatever_atomic/scripts/services/rest_service.js"></script>
        <script src="${baseUrl}resources/whatever_atomic/scripts/services/rest_config_service.js"></script>
        <script src="${baseUrl}resources/whatever_atomic/scripts/services/validation_service.js"></script>
        <script src="${baseUrl}resources/whatever_atomic/scripts/services/resource_urls_service.js"></script>
        <script src="${baseUrl}resources/whatever_atomic/scripts/controllers/ctrl.js"></script>
        <script src="${baseUrl}resources/whatever_atomic/scripts/filters/filters.js"></script>

        <div ng-include src="'${baseUrl}resources/whatever_atomic/html/whatever.html'"></div>
    </body>
</html>