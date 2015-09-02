'use strict';

/**
 * @ngdoc service
 * @name restConfigService
 * @description
 * # restConfigService
 * Rest Config Service for Form 471 Internal Modify Tool
 */
angular
    .module('restConfigService',
    ['form471ViewRestConfigService', 'form471ModifyRestConfigService', 'authenticationRestConfigService'])
    .service('restConfigService',
        function restConfigService(form471ViewRestConfigService, form471ModifyRestConfigService,
                                   authenticationRestConfigService) {
            this.viewRestConfigService = form471ViewRestConfigService;
            this.modifyRestConfigService = form471ModifyRestConfigService;
            this.authenticationRestConfigService = authenticationRestConfigService;
        }
    );