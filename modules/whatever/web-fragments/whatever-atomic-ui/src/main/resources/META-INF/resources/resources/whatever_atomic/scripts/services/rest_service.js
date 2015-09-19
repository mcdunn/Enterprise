'use strict';

/**
 * @ngdoc service
 * @name restService
 * @description
 * # restService
 * Rest Service for Whatever Management
 */
angular
    .module('whatever')
    .service('restService',
            ['$http', '$q', 'restConfigService', 'coreUtils',
        function restService($http, $q, restConfigService, coreUtils) {
            var urlConfiguration = restConfigService.getUrlConfiguration();

            this.searchWhatevers = function () {
                var deferred = $q.defer();
                $http.get(coreUtils.stringFormat(urlConfiguration.whateverSearch))
                    .success(
                        function (data) {
                            deferred.resolve(data);
                        }
                    )
                    .error(
                        function (data, code) {
                            deferred.reject(code);
                        }
                    );
                return deferred.promise;
            };

            this.addWhatever = function (whatever) {
                var deferred = $q.defer();
                $http.post(coreUtils.stringFormat(urlConfiguration.whateverAdd), whatever)
                    .success(
                        function (data) {
                            deferred.resolve(data);
                        }
                    )
                    .error(
                        function (data, code) {
                            deferred.reject(code);
                        }
                    );
                return deferred.promise;
            };

            this.retrieveWhatever = function (id) {
                var deferred = $q.defer();
                if ((id != 0) && (!id)) {
                    deferred.reject();
                    return deferred.promise;
                }
                $http.get(coreUtils.stringFormat(urlConfiguration.whateverRetrieve, id))
                    .success(
                        function(data) {
                            deferred.resolve(data);
                        }
                    )
                    .error(
                        function(data, code) {
                            deferred.reject(code);
                        }
                    );
                return deferred.promise;
            };

            this.modifyWhatever = function (whatever) {
                var deferred = $q.defer();
                $http.put(coreUtils.stringFormat(urlConfiguration.whateverModify, whatever.id), whatever)
                    .success(
                        function(data) {
                            deferred.resolve(data);
                        }
                    )
                    .error(
                        function(data, code) {
                            deferred.reject(code);
                        }
                    );
                return deferred.promise;
            };

            this.deleteWhatever = function (id) {
                var deferred = $q.defer();
                $http.delete(coreUtils.stringFormat(urlConfiguration.whateverDelete, id), null)
                    .success(
                        function (data) {
                            deferred.resolve(data);
                        }
                    )
                    .error(
                        function (data, code) {
                            deferred.reject(code);
                        }
                    );
                return deferred.promise;
            };

            this.saveWhatevers = function (whatevers) {
                var deferred = $q.defer();
                $http.post(coreUtils.stringFormat(urlConfiguration.whateversSave), whatevers)
                    .success(
                        function (data) {
                            deferred.resolve(data);
                        }
                    )
                    .error(
                        function(data, code) {
                            deferred.reject(code);
                        }
                    );
                return deferred.promise;
            };
        }
    ]);