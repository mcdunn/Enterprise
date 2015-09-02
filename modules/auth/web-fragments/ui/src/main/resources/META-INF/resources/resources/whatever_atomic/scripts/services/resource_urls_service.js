'use strict';

/**
 * @ngdoc service
 * @name resourceUrlsService
 * @description
 * # resourceUrlsService
 * Resource URLs Service for Whatever Management
 */
angular
    .module('whatever')
    .service('resourceUrlsService',
        function resourceUrlsService() {
            this.resourceUrls = {};
            this.init = function(resourcesUrl) {
                this.resourceUrls.pagination = {};
                this.resourceUrls.pagination.template =
                    resourcesUrl + "pagination/html/pagination.html";
                this.resourceUrls.pagination.smallTemplate =
                    resourcesUrl + "pagination/html/pagination-small.html";
                this.resourceUrls.pagination.firstIcon =
                    resourcesUrl + "pagination/images/first-page-small.png";
                this.resourceUrls.pagination.previousIcon =
                    resourcesUrl + "pagination/images/previous-page-small.png";
                this.resourceUrls.pagination.nextIcon =
                    resourcesUrl + "pagination/images/next-page-small.png";
                this.resourceUrls.pagination.lastIcon =
                    resourcesUrl + "pagination/images/last-page-small.png";
            };
        }
    );