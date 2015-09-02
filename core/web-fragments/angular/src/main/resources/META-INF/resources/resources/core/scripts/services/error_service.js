'use strict';

/**
 * @ngdoc service
 * @name coreErrorService
 * @description
 * # coreErrorService
 * Base Error Service
 */
angular
    .module('core')
    .service('coreErrorService',
        function errorService() {
            this.errors = [];

            this.init = function() {
                this.errors = [];
            };

            this.isError = function(object, fields) {
                if (this.errors) {
                    for (var i = 0; i < this.errors.length; i++) {
                        if (isMatch(this.errors[i], object, fields)) {
                            return true;
                        }
                    }
                }
                return false;
            };

            this.createError = function(object, fields, message, value) {
                return {
                    'object': object,
                    'fields': fields,
                    'message': message,
                    'value': value
                };
            };

            this.setErrors = function(errors) {
console.log("setting errors to " + errors);
                this.errors = errors;
                if ((errors == null) && (typeof errors == 'undefied')) {
                    this.errors = [];
                }
            };

            this.addError = function(object, fields, message, value) {
                this.errors.push({
                    'object': object,
                    'fields': fields,
                    'message': message,
                    'value': value
                });
            };

            this.removeError = function(object, fields, message) {
                var newErrors = [];
                for (var i = 0; i < this.errors.length; i++) {
                    var messageMatch = true;
                    if ((message != null) && (typeof message !== 'undefined')) {
                        if (this.errors[i].message != message) {
                            messageMatch = false;
                        }
                    }
                    if (!messageMatch || !isMatch(this.errors[i], object, fields)) {
                        newErrors.push(this.errors[i]);
                    }
                }
                this.errors = newErrors;
                return this.errors;
            };

            this.removeErrors = function(object, fields) {
                var newErrors = [];
                for (var i = 0; i < this.errors.length; i++) {
                    if (!isMatch(this.errors[i], object, fields)) {
                        newErrors.push(this.errors[i]);
                    }
                }
                this.errors = newErrors;
                return this.errors;
            };

            this.removeErrorsByType = function(type) {
                var newErrors = [];
                for (var i = 0; i < this.errors.length; i++) {
                    var error = this.errors[i];
                    if (this.errors[i].message != type) {
                        newErrors.push(this.errors[i]);
                    }
                }
                this.errors = newErrors;
                return this.errors;
            };

            this.removeAllErrors = function() {
                this.errors = {};
            };

            this.getErrorMessage = function (object, fields) {
                var errorString = "<ul class='clean-list spaced-items error-message'>";
                for (var i = 0; i < this.errors.length; i++) {
                    if (isMatch(this.errors[i], object, fields)) {
                        errorString += this.generateErrorMessage(this.errors[i]);
                    }
                }
                return errorString + "</ul>";
            };

            this.getErrorCount = function(object, fields) {
                var errorCount = 0;
                for (var i = 0; i < this.errors.length; i++) {
                    if (isMatch(this.errors[i], object, fields)) {
                        errorCount++;
                    }
                }
                return errorCount;
            };

            this.getErrors = function (object, fields) {
                var matchingErrors = [];
                for (var i = 0; i < this.errors.length; i++) {
                    if (isMatch(this.errors[i], object, fields)) {
                        matchingErrors.push(this.errors[i]);
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

            var isMatch = function (error, object, fields) {
                if ((object != null) && (typeof object !== 'undefined') && (error.object != object)) {
                    return false;
                }
                if (fields != null) {
                    for (var i = 0; i < fields.length; i++) {
                        var field = fields[i];
                        if ((field != null) && (typeof field !== 'undefined') && (error.fields[i] != field)) {
                            return false;
                        }
                    }
                }
                return true;
            }
        }
    );