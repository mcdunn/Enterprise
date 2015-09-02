'use strict';

/**
 * @ngdoc service
 * @name corePopupService
 * @description
 * # corePopupService
 * Base Popup Service
 */
angular.module('core')
    .service('corePopupService',
            ['$modal', '$rootScope',
        function popupService($modal, $rootScope) {
            var currentPopup = null;
            this.displayError = function (text, errorTitle, errorObject) {
                var tempScope = $rootScope.$new();
                tempScope.errorText = text;
                tempScope.errorTitle = errorTitle;
                tempScope.errorObject = errorObject;
                var modalInstance = $modal.open({
                    templateUrl: 'partials/modal-error.html',
                    scope: tempScope,
                    size: 'sm'
                });

                //since the scope is on rootScope, we should clean up after ourselves or else this will never get destroyed
                modalInstance.result.then(function () {
                    tempScope.$destroy();
                }, function () {
                    tempScope.$destroy();
                });
                return modalInstance;
            };

            this.displayPopup = function (templateUrl, scope, options) {

                // Prevent opening of same popup twice
                if (currentPopup && currentPopup == templateUrl) {
                    return;
                }
                var defaults = {
                    templateUrl: templateUrl,
                    scope: scope
                };

                angular.extend(defaults, options);

                currentPopup = templateUrl;
                var modalInstance = $modal.open(defaults);

                modalInstance.result.then(function () {
                    currentPopup = null; //set to null so we know it's been closed or canceled
                }, function () {
                    currentPopup = null;
                });

                return modalInstance;
            };
        }
    ]);
