'use strict';


angular
    .module('whateverServices', ['whateverRestService'])
    .service('whateverServices',
        function whateverServices($q, whateverRestService) {

            this.whatevers = null;

            this.searchWhatevers = function() {
                var whateverServices = this;
                whateverRestService.searchWhatevers().then(
                    function (results) {
                        whateverServices.setWhatevers(results.whatevers);
                    }
                    , function (httpErrorCode) {
                    }
                );
            };

            this.addWhatever = function(whatever) {
                var deferred = $q.defer();
// TODO: validate whatever here
console.log("calling restService.addWhatever");
                var whateverServices = this;
                whateverRestService.addWhatever(whatever).then(
                    function (addResponse) {
                        var whatever = addResponse.whateverCreateResponse.whatever;
                        whateverServices.appendWhatever(whatever);
                        deferred.resolve(whatever);
                    }
                    , function (httpErrorCode) {
                        deferred.reject(httpErrorCode);
                    }
                );
                return deferred.promise;
            };

            this.modifyWhatever = function(whatever) {
                var deferred = $q.defer();
// TODO: validate whatever here
                var whateverServices = this;
                var index = whatever.index;
                delete whatever.index;
                whateverRestService.modifyWhatever(whatever, whatever.id).then(
                    function (modifyResponse) {
                        var whatever = modifyResponse.whateverModifyResponse.whatever;
                        whatever.index = index;
                        whateverServices.replaceWhatever(whatever);
                        deferred.resolve(whatever);
                    }
                    , function (httpErrorCode) {
                        deferred.reject(httpErrorCode);
                    }
                );
                return deferred.promise;
            };

            this.deleteWhatever = function(whatever) {
                var whateverServices = this;
                whateverRestService.deleteWhatever(whatever.id).then(
                    function (deleteResponse) {
                        whateverServices.removeWhatever(whatever);
                    }
                    , function (httpErrorCode) {
                    }
                );
            };

            this.setWhatevers = function(whatevers) {
                this.whatevers = this.resetIndices(whatevers);
            };

            this.appendWhatever = function(whatever) {
                if (!this.whatevers) {
                    this.whatevers = [];
                }
                this.whatevers.push(whatever);
                whatever.index = this.whatevers.indexOf(whatever);
            };

            this.insertWhatever = function(whatever, index) {
                if (!this.whatevers) {
                    this.whatevers = [];
                }
                this.whatevers.splice(index, 0, whatever);
                this.resetIndices(whatevers);
            };

            this.replaceWhatever = function(whatever) {
                this.whatevers[whatever.index] = whatever;
            };

            this.removeWhatever = function(whatever) {
                this.whatevers.splice(whatever.index, 1);
                this.resetIndices(this.whatevers);
            };

            this.resetIndices = function(whatevers) {
                for (var i = 0; i < whatevers.length; i++) {
                    whatevers[i].index = i;
                }
                return whatevers;
            }
        }
    );