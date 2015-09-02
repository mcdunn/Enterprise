'use strict';

/**
 * @ngdoc service
 * @name restService
 * @description
 * # restService
 * Rest Service for Whatever Management
 */
angular
    .module('whateverRestService', ['whateverRestConfigService'])
    .service('whateverRestService',
        function restService($http, $q, whateverRestConfigService) {
            // TODO: put this somewhere common
            String.format = function () {
                var s = arguments[0];
                for (var i = 0; i < arguments.length - 1; i++) {
                    var reg = new RegExp("\\{" + i + "\\}", "gm");
                    s = s.replace(reg, arguments[i + 1]);
                }

                return s;
            };

            // AngularJS will instantiate a singleton by calling "new" on this function
            var urlConfiguration = whateverRestConfigService.getUrlConfiguration();

            this.searchWhatevers = function() {
                var deferred = $q.defer();
                $http.get(String.format(urlConfiguration.whateverSearch))
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

            this.addWhatever = function(whatever) {
                var deferred = $q.defer();
                $http.post(String.format(urlConfiguration.whateverAdd), whatever)
                    .success(
                        function (data) {
                            deferred.resolve(data);
                        }
                    )
                    .error(
                        function (error) {
                            deferred.reject(error);
                        }
                    );
                return deferred.promise;
            };

            this.retrieveWhatever = function(id) {
                var deferred = $q.defer();
                if ((id != 0) && (!id)) {
                    deferred.reject();
                    return deferred.promise;
                }
                $http.get(String.format(urlConfiguration.whateverRetrieve, id))
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

            this.modifyWhatever = function(whatever) {
                var deferred = $q.defer();
                $http.put(String.format(urlConfiguration.whateverModify, whatever.id), whatever)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            };

            this.deleteWhatever = function(id) {
                var deferred = $q.defer();
                $http.delete(String.format(urlConfiguration.whateverDelete, id), null)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            };
        }
    );