'use strict';

/**
 * @ngdoc function
 * @name whateverModifyCtrl
 * @description
 * # whateverModifyCtrl
 * Controller for Modifying Whatevers
 */
angular
    .module('whatever')
    .controller('whateverModifyCtrl',
    ['$scope', 'whateverServices',
        function ($scope, whateverServices) {
            $scope.isSaveButtonEnabled = function() {
                // TODO: validate input first
                return true;
            };

            $scope.save = function() {
                whateverServices.modifyWhatever($scope.whatever).then(
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
