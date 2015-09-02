<!doctype html>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<c:set var="baseUrl" value="${pageContext.request.contextPath}/" scope="request"/>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">

        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>FCC Form 471 View - Funding Year 2015</title>

        <!--jsp:include page="../../../core/global_css.jsp"-->
            <!--jsp:param name="baseUrl" value="${baseUrl}" /-->
        <!--/jsp:include-->

        <!--link rel="stylesheet" href="${baseUrl}resources/users/management-external/css/management_external.css"-->
       
    </head>
    <body ng-app="form471View" ng-controller="form471ViewCtrl">

        <!--jsp:include page="../../../core/global_scripts.jsp"-->
            <!--jsp:param name="baseUrl" value="${baseUrl}" /-->
        <!--/jsp:include-->

        <!-- Authentication Services -->
        <!--script src="${baseUrl}resources/authentication/scripts/services/authentication_rest_config_service.js"></script-->
        <!--script src="${baseUrl}resources/authentication/scripts/services/authentication_rest_service.js"></script-->

        <!--script src="${baseUrl}resources/form471/modify/internal/scripts/services/services.js"></script-->

        <script>
            var baseUrl = "${baseUrl}";
        </script>

        <!--div ng-include src="'${baseUrl}resources/users/management_external/management_external.html'"></div-->
    </body>
</html>