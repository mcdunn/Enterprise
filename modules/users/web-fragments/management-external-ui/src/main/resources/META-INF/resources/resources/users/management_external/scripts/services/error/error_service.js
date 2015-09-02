'use strict';

/**
 * @ngdoc service
 * @name errorService
 * @description
 * # errorService
 * Error Service for Form 471 Internal Modify Tool
 */
angular
    .module('errorService', ['basicInformationErrorService','discountCalculationErrorService', 'fundingRequestsErrorService',
            'fundingRequestErrorService'])
    .service('errorService',
        function restService(basicInformationErrorService, discountCalculationErrorService, fundingRequestsErrorService, fundingRequestErrorService) {
            this.basicInformation = basicInformationErrorService;
            this.basicInformation.setCommonErrorService(this);
    		this.discountCalculation = discountCalculationErrorService;
            this.discountCalculation.setCommonErrorService(this);
            this.fundingRequests = fundingRequestsErrorService;
            this.fundingRequests.setCommonErrorService(this);
            this.fundingRequest = fundingRequestErrorService;
            this.fundingRequest.setCommonErrorService(this);

            this.isError = function (errors, indices) {
                for (var i = 0; i < errors.length; i++) {
                    if (isMatch(errors[i], indices)) {
                        return true;
                    }
                }
                return false;
            };

            this.removeError = function (errors, indices, message) {
                var newErrors = [];
                for (var i = 0; i < errors.length; i++) {
                    var messageMatch = true;
                    if ((message != null) && (typeof message !== 'undefined')) {
                        if (errors[i].message != message) {
                            messageMatch = false;
                        }
                    }
                    if (!messageMatch || !isMatch(errors[i], indices)) {
                        newErrors.push(errors[i]);
                    }
                }
                return newErrors;
            };

            this.removeErrorsByType = function(errors, type) {
                var newErrors = [];
                for (var i = 0; i < errors.length; i++) {
                    var error = errors[i];
                    if (errors[i].message != type) {
                        newErrors.push(errors[i]);
                    }
                }
                return newErrors;
            };

            this.getErrorMessage = function (errors, indices) {
                var errorString = "<ul class='clean-list spaced-items error-message'>";
                for (var i = 0; i < errors.length; i++) {
                    if (isMatch(errors[i], indices)) {
                        errorString += this.generateErrorMessage(errors[i]);
                    }
                }
                return errorString + "</ul>";
            };

            this.getErrorCount = function(errors, indices) {
                var errorCount = 0;
                for (var i = 0; i < errors.length; i++) {
                    if (isMatch(errors[i], indices)) {
                        errorCount++;
                    }
                }
                return errorCount;
            };

            this.getErrors = function (errors, indices) {
                var matchingErrors = [];
                for (var i = 0; i < errors.length; i++) {
                    if (isMatch(errors[i], indices)) {
                        matchingErrors.push(errors[i]);
                    }
                }
                return matchingErrors;
            };

            this.generateErrorMessage = function (error) {
                if ((error.value == null) || (typeof error.value === 'undefined')) {
                    return "<li><b>" + error.message + ":</b>*BLANK*</li>";
                }
                else {
                    return "<li><b>" + error.message + ":</b> " + error.value + "</li>";
                }
            };

            var isMatch = function (error, indices) {
                for (var j = 0; j < indices.length; j++) {
                    var index = indices[j];
                    if ((index != null) && (typeof index !== 'undefined')) {
                        if (error.indices[j] != index) {
                            return false;
                        }
                    }
                }
                return true;
            }
        }
    );