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
    ['$scope', '$filter', 'whateverServices', 'popupService',
        function ($scope, $filter, whateverServices, popupService) {

            // Copy JS variables set up by the JSP into the scope
            $scope.baseUrl = baseUrl;
            $scope.parameters = parameters;
            $scope.whateverServices = whateverServices;
// TODO: change this to use the resourceUrlsService?
            $scope.resourceUrls = {};
            $scope.resourceUrls.addWhatever =
                $scope.baseUrl + "/resources/" + "whatever/html/views/whatever_add.html";
            $scope.resourceUrls.modifyWhatever =
                $scope.baseUrl + "/resources/" + "whatever/html/views/whatever_modify.html";
            $scope.resourceUrls.pagination = {};
            $scope.resourceUrls.pagination.template =
                $scope.baseUrl + "/resources/" + "pagination/html/pagination.html";
            $scope.resourceUrls.pagination.smallTemplate =
                $scope.baseUrl + "/resources/" + "pagination/html/pagination-small.html";
            $scope.resourceUrls.pagination.firstIcon =
                $scope.baseUrl + "/resources/" + "pagination/images/first-page-small.png";
            $scope.resourceUrls.pagination.previousIcon =
                $scope.baseUrl + "/resources/" + "pagination/images/previous-page-small.png";
            $scope.resourceUrls.pagination.nextIcon =
                $scope.baseUrl + "/resources/" + "pagination/images/next-page-small.png";
            $scope.resourceUrls.pagination.lastIcon =
                $scope.baseUrl + "/resources/" + "pagination/images/last-page-small.png";

            // Execute this after page load
            $scope.whateverServices.searchWhatevers();
//            $scope.whateverServices.errorService.init();

            $scope.addWhatever = function() {
                var scope = $scope.$new();
                popupService.displayPopup($scope.resourceUrls.addWhatever, scope,
                    {"windowClass":"modify-modal","backdrop":"static","keyboard":false});
            };

            $scope.modifyWhatever = function(whatever) {
                var scope = $scope.$new(true);
                scope.whatever = angular.copy(whatever);
                popupService.displayPopup($scope.resourceUrls.modifyWhatever, scope,
                    {"windowClass":"modify-modal","backdrop":"static","keyboard":false});
            };

            $scope.deleteWhatever = function(whatever) {
                whateverServices.deleteWhatever(whatever);
            };
        }
    ]);
/*    .directive("popoverAddWhateverPopup", ["resourceUrlsService",
        function (resourceUrlsService) {
            return {
                restrict: "EA",
                replace: true,
                scope: { title: "@", content: "@", placement: "@", animation: "&", isOpen: "&"},
                templateUrl: resourceUrlsService.getResourceUrls().add.whatever
            };
        }
    ])*/
