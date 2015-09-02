'use strict';

/**
 * @ngdoc service
 * @name restService
 * @description
 * # restService
 * Rest Service for Form 471 Internal Modify Tool
 */
angular
    .module('restService', ['form471ViewRestService', 'form471ModifyRestService', 'authenticationRestService'])
    .service('restService',
        function restService(form471ViewRestService, form471ModifyRestService, authenticationRestService) {
            this.viewRestService = form471ViewRestService;
            this.modifyRestService = form471ModifyRestService;
            this.authenticationRestService = authenticationRestService;
        }
    );