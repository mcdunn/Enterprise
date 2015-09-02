'use strict';

/**
 * @ngdoc function
 * @name whateverAddCtrl
 * @description
 * # whateverAddCtrl
 * Controller for Adding Whatevers
 */
angular
    .module('whatever')
    .controller('whateverAddCtrl',
    ['$scope', 'whateverServices',
        function ($scope, whateverServices) {
            $scope.whatever = {};

            $scope.isSaveButtonEnabled = function() {
                // TODO: validate input first
                return true;
            };

            $scope.save = function() {
                whateverServices.addWhatever($scope.whatever).then(
                    function (whatever) {
                        $scope.$dismiss();
                    }
                    , function (httpErrorCode) {
                    }
                );
            };

            $scope.cancel = function() {
                $scope.$dismiss();
            };
        }
    ]);
