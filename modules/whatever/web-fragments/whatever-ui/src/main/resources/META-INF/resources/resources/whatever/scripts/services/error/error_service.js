'use strict';

/**
 * @ngdoc service
 * @name errorService
 * @description
 * # errorService
 * Error Service for Form 471 Internal Modify Tool
 */
angular
    .module('whatever')
    .service('errorService',
        function restService() {
            this.types = {
                "INVALID_VALUE":"Invalid Value"
            };

            this.errors = [];

            this.init = function() {
                this.errors = [];
            };

            this.setCommonErrorService = function(commonErrorService) {
                this.commonErrorService = commonErrorService;
            };

            this.isError = function (groupIndex, memberIndex, fieldName) {
                return this.commonErrorService.isError(this.errors, [groupIndex, memberIndex, fieldName]);
            };

            this.addError = function (groupIndex, memberIndex, fieldName, message, value) {
                this.errors.push({
                    'indices': [groupIndex, memberIndex, fieldName],
                    'message': message,
                    'value': value
                });
            };

            this.removeError = function (groupIndex, memberIndex, fieldName, message) {
                this.errors = this.commonErrorService.removeError(this.errors, [groupIndex, memberIndex, fieldName], message);
            };

            this.removeErrorsByType = function(type) {
                this.errors = this.commonErrorService.removeErrorsByType(this.errors, type);
            };

            this.getErrorMessage = function (groupIndex, memberIndex, fieldName) {
                return this.commonErrorService.getErrorMessage(this.errors, [groupIndex, memberIndex, fieldName]);
            };

            this.getErrorCount = function(groupIndex, memberIndex, fieldName) {
                return this.commonErrorService.getErrorCount(this.errors, [groupIndex, memberIndex, fieldName]);
            };

            this.getErrors = function (groupIndex, memberIndex, fieldName) {
                return this.commonErrorService.getErrors(this.errors, [groupIndex, memberIndex, fieldName]);
            };

            this.processRESTServiceErrors = function(errors) {
                for (var i = 0; i < errors.length; i++) {
                    var error = errors[i];
                    this.addError(error.errorRoot, error.errorPath, error.errorField,
                        this.generateRESTErrorMessage(error), error.badValue);
                }
            };

            this.generateErrorMessage = function (error) {
                // TODO: do special message formatting here
                if (error.message === this.types.NO_BILLED_ENTITIES) {
                    return "<li><b>" + error.message + "</b></li>";
                }
                else {
                    this.commonErrorService.generateErrorMessage(error);
                }
            };

            this.generateRESTErrorMessage = function(error) {
                if (error.errorCode == "INVALID_VALUE") {
                    // TODO: convert generic server errors to more specific UI errors
                    if (error.index3 === "type") {
                        return this.types.INVALID_BILLED_ENTITY_TYPE;
                    }
                }
                else {
                    return this.types[error.errorCode];
                }
            };

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