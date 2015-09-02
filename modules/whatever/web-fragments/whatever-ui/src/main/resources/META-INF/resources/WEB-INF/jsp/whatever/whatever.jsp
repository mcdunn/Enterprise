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

        <link rel="stylesheet" href="${baseUrl}resources/whatever/css/whatever.css">
       
    </head>
    <body ng-app="whatever" ng-controller="whateverCtrl">

        <script>
            var baseUrl = "${baseUrl}";
            var parameters = ${parameters};
        </script>

        <jsp:include page="../core/angular/angular_scripts.jsp">
            <jsp:param name="baseUrl" value="${baseUrl}"/>
        </jsp:include>

        <script src="${baseUrl}resources/whatever/scripts/whatever.js"></script>
        <script src="${baseUrl}resources/whatever/scripts/services/whatever_rest_service.js"></script>
        <script src="${baseUrl}resources/whatever/scripts/services/whatever_rest_config_service.js"></script>
        <script src="${baseUrl}resources/whatever/scripts/services/whatever_services.js"></script>
        <script src="${baseUrl}resources/whatever/scripts/controllers/whatever_ctrl.js"></script>
        <script src="${baseUrl}resources/whatever/scripts/controllers/whatever_add_ctrl.js"></script>
        <script src="${baseUrl}resources/whatever/scripts/controllers/whatever_modify_ctrl.js"></script>

        <div ng-include src="'${baseUrl}resources/whatever/html/whatever.html'"></div>
    </body>
</html>