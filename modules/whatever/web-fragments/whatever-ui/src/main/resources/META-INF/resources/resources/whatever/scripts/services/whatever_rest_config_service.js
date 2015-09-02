'use strict';

/**
 * @ngdoc service
 * @name restConfigService
 * @description
 * # restConfigService
 * Rest Config Service for Whatever Management
 */
angular
    .module('whateverRestConfigService', [])
    .service('whateverRestConfigService',
        function restConfig() {
            var config = {
                whateverSearch: baseUrl + "whatevers",
                whateverAdd: baseUrl + "whatevers",
                whateverRetrieve: baseUrl + "whatever/{0}",
                whateverModify: baseUrl + "whatever/{0}",
                whateverDelete:baseUrl + "whatever/{0}"
            };

            this.getUrlConfiguration = function () {
                return config;
            };
        }
    );