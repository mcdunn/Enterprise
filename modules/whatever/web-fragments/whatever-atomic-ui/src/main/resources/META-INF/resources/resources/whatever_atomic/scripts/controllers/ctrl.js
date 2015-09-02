'use strict';

/**
 * @ngdoc function
 * @name whateverCtrl
 * @description
 * # whateverCtrl
 * Controller for Whatever Management
 */
angular
    .module('whatever')
    .controller('whateverCtrl',
            ['$scope', '$filter', '$timeout', 'moPaginationService', 'resourceUrlsService', 'dataService',
                'modificationService', 'errorService',
        function ($scope, $filter, $timeout, moPaginationService, resourceUrlsService, dataService, modificationService,
                errorService) {

            // Copy JS variables set up by the JSP into the scope
            $scope.baseUrl = baseUrl;
            $scope.parameters = parameters;

            // Initialize services
            $scope.resourceUrlsService = resourceUrlsService;
            resourceUrlsService.init($scope.baseUrl + "resources/");
            $scope.dataService = dataService;
            dataService.init();
            $scope.modificationService = modificationService;
            modificationService.init();
            $scope.errorService = errorService;
            errorService.init();
        }
    ]);
