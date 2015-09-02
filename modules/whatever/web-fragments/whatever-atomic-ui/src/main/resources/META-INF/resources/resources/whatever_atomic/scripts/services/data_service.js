'use strict';

/**
 * @ngdoc service
 * @name dataService
 * @description
 * # dataService
 * Data Service for Whatever Management
 */
angular
    .module('whatever')
    .service('dataService',
            ['$q', 'coreDataService', 'restService', 'errorService', 'validationService',
        function dataService($q, coreDataService, restService, errorService, validationService) {

            this.data = coreDataService;
            this.fieldList = [['id'], ['field1'], ['field2']];

            this.init = function() {
                coreDataService.init();
                this.searchObjects();
            };

            this.appendObject = function(object) {
                coreDataService.appendObject(object);
            };

            this.insertObject = function(object, index) {
                coreDataService.insertObject(object, index);
            };

            this.searchObjects = function() {
                restService.searchWhatevers().then(
                    function (results) {
                        coreDataService.setObjects(results.whatevers);
                        for (var i = 0; i < coreDataService.objects.length; i++) {
                            var whatever = coreDataService.objects[i];
                            whatever.originalData = angular.copy(whatever);
                        }
                        errorService.setErrors(validationService.validate(coreDataService.objects));
                    }
                    , function (httpErrorCode) {
                    }
                );
            };

            this.saveNewObject = function(whatever) {
                var deferred = $q.defer();
// TODO: validate whatever here
                restService.addWhatever(whatever).then(
                    function(addResponse) {
                        var whatever = addResponse.whateverCreateResponse.whatever;
                        coreDataService.appendObject(whatever);
                        deferred.resolve(whatever);
                    }
                    , function (httpErrorCode) {
                        deferred.reject(httpErrorCode);
                    }
                );
                return deferred.promise;
            };

            this.modifyObject = function(whatever) {
                var deferred = $q.defer();
// TODO: validate whatever here
                var index = whatever.index;
                delete whatever.index;
                restService.modifyWhatever(whatever, whatever.id).then(
                    function(modifyResponse) {
                        var whatever = modifyResponse.whateverModifyResponse.whatever;
                        whatever.index = index;
                        coreDataService.replace(whatever);
                        deferred.resolve(whatever);
                    }
                    , function(httpErrorCode) {
                        deferred.reject(httpErrorCode);
                    }
                );
                return deferred.promise;
            };

            this.deleteObject = function(whatever) {
                restService.deleteWhatever(whatever.id).then(
                    function(deleteResponse) {
                        coreDataService.removeObject(whatever);
                    }
                    , function(httpErrorCode) {
                    }
                );
            };

            this.saveObjects = function(objects) {
                restService.saveWhatevers(objects).then(
                    function(saveResponse) {
                        coreDataService.setObjects(saveResponse.whatevers);
                    }
                    , function(httpErrorCode) {
                    }
                );
            };
        }
    ]);