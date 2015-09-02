'use strict';

/**
 * @ngdoc service
 * @name restConfigService
 * @description
 * # restConfigService
 * Rest Config Service for Whatever Management
 */
angular
    .module('whatever')
    .service('restConfigService',
        function restConfigService() {
            var config = {
                whateverSearch: baseUrl + "whatevers",
                whateverAdd: baseUrl + "whatevers",
                whateverRetrieve: baseUrl + "whatever/{0}",
                whateverModify: baseUrl + "whatever/{0}",
                whateverDelete:baseUrl + "whatever/{0}",
                whateversSave:baseUrl + "whatever/modifications"
            };

            this.getUrlConfiguration = function () {
                return config;
            };
        }
    );