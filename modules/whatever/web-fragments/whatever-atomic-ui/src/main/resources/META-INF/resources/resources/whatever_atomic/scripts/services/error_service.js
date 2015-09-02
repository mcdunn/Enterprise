'use strict';

/**
 * @ngdoc service
 * @name errorService
 * @description
 * # errorService
 * Error Service for Whatever Management
 */
angular
    .module('whatever')
    .service('errorService',
            ['$timeout', 'coreErrorService', 'coreUtils', 'moPaginationService',
        function errorService($timeout, coreErrorService, coreUtils, moPaginationService) {

            this.types = {
                "MISSING_FIELD1":"Field1 is a Required Field",
                "MISSING_FIELD2":"Field2 is a Required Field",
                "INVALID_FIELD1_FIELD2":"Field1 and Field2 Contain the Same Value",
                "DUPLICATE_FIELD1":"Field1 Value Duplicated",
                "DUPLICATE_FIELD2":"Field2 Value Duplicated"
            };

            this.init = function() {
                coreErrorService.init();
            };

            this.isError = function(whatever, fields) {
                return coreErrorService.isError(whatever, fields);
            };

            this.createError = function(whatever, fields, message, value) {
                return coreErrorService.createError(whatever, fields, message, value);
            };

            this.setErrors = function(errors) {
                coreErrorService.setErrors(errors);
            };

            this.addError = function(whatever, fields, message, value) {
                coreErrorService.addError(whatever, fields, message, value);
            };

            this.removeError = function(whatever, fields, message) {
                return coreErrorService.removeError(whatever, fields, message);
            };

            this.removeErrors = function(whatever, fields) {
                return coreErrorService.removeErrors(whatever, fields);
            };

            this.removeErrorsByType = function(type) {
                return coreErrorService.removeErrorsByType(type);
            };

            this.getErrorMessage = function(whatever, fields) {
                return coreErrorService.getErrorMessage(whatever, fields);
            };

            this.getErrorCount = function(whatever, fields) {
                return coreErrorService.getErrorCount(whatever, fields);
            };

            this.getErrors = function(whatever, fields) {
                return coreErrorService.getErrors(whatever, fields);
            };

            this.generateErrorMessage = function (error) {
                coreErrorService.generateErrorMessage(error);
            };

            this.goToError = function (error) {
                var id = this.getErrorLocationId(error);
                if (id) {
                    // TODO: this will have to change if we change the way we store the error data
                    moPaginationService.showRow("whatevers", error.object.index);
                    var utils = this;
                    $timeout(function () {
                        utils.scrollToImmediately(id);
                        // Give the element focus / make it editable
                        $("#" + id).trigger("click");
                        $timeout(function () {
                            $("#" + id + "_input").trigger("focus");
                        }, 200);
                    }, 300);
                }
            };

            this.getErrorLocationId = function(error) {
                var id = "whatever_" + error.object.index;
                for (var i = 0; i < error.fields.length; i++) {
                    var field = error.fields[i];
                    if (!coreUtils.isBlank(field)) {
                        id += "_" + field;
                    }
                }
                if (id === "whatever") {
                    return null;
                }
                return id;
            };

            // TODO: put this in a utility service
            this.scrollToImmediately = function(id) {
                var $panel = $('#' + id);
                var newTop = $panel.offset().top;
                $('html, body').animate({
                    scrollTop: newTop
                }, 0);
            };

            this.processRESTServiceErrors = function(errors) {
//                for (var i = 0; i < errors.length; i++) {
//                    var error = errors[i];
//                    this.addError(error.errorRoot, error.errorPath, error.errorField,
//                        this.generateRESTErrorMessage(error), error.badValue);
//                }
            };

            this.generateRESTErrorMessage = function(error) {
//                if (error.errorCode == "INVALID_VALUE") {
//                    // TODO: convert generic server errors to more specific UI errors
//                    if (error.index3 === "type") {
//                        return this.types.INVALID_BILLED_ENTITY_TYPE;
//                    }
//                }
//                else {
//                    return this.types[error.errorCode];
//                }
            };
        }
    ]);