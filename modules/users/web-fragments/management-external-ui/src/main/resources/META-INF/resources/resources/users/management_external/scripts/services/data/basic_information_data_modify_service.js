'use strict';

angular
    .module('basicInformationDataModifyService', [])
    .service('basicInformationDataModifyService',
    function dataModifyService($q, $timeout) {

        var dataModifyService = this;

        this.load = function(application, scope) {
        	this.waitForData(application, scope);
        };

        this.waitForData = function(application, scope) {
        	waitForData(application, scope).then(
                    function (basicInformation) {
                        scope.basicInformation = processRetrievedBasicInformation(basicInformation);
                        scope.basicInformationReady = true;
                    },
                    function () {
                        dataModifyService.waitForData(application, scope);
                    }
                );
        };
        
        var waitForData = function(application, scope) {
            var deferred = $q.defer();
            $timeout(
                function() {
                    var basicInformation = application.basicInformation
                    if (basicInformation) {
                        deferred.resolve(basicInformation);
                    }
                    else {
                        deferred.reject();
                    }
                }, 500, false
            );
            return deferred.promise;
        };

        var processRetrievedBasicInformation = function(basicInformation) {
        	basicInformation.retrieved = true;
            return angular.copy(basicInformation);
        };

        this.cleanupBasicInformationForSave = function (basicInformation) {

            // Clone the Basic Information object so it can be cleaned up safely
            var cleanedBasicInformation = angular.copy(basicInformation);
            
            // Delete unneeded fields from the basicInformation data
            deleteUnneededBasicInformationFields(cleanedBasicInformation);

            return cleanedBasicInformation;
        };
        
        var deleteUnneededBasicInformationFields = function(basicInformation) {
         
            delete basicInformation.retrieved;
        };

    }
);