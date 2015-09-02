'use strict';

angular
    .module('fundingRequestsErrorService', [])
    .service('fundingRequestsErrorService',
    function errorService() {

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

        this.isError = function (item21Index, recipientIndex, fieldName) {
            return this.commonErrorService.isError(this.errors, [item21Index, recipientIndex, fieldName]);
        };

        this.addError = function (item21Index, recipientIndex, fieldName, message, value) {
            this.errors.push({
                'indices': [item21Index, recipientIndex, fieldName],
                'message': message,
                'value': value
            });
        };

        this.removeError = function (item21Index, recipientIndex, fieldName, message) {
            this.errors = this.commonErrorService.removeError(this.errors, [item21Index, recipientIndex, fieldName], message);
        };

        this.removeErrorsByType = function(type) {
            this.errors = this.commonErrorService.removeErrorsByType(this.errors, type);
        };

        this.getErrorMessage = function (item21Index, recipientIndex, fieldName) {
            return this.commonErrorService.getErrorMessage(this.errors, [item21Index, recipientIndex, fieldName]);
        };

        this.getErrorCount = function(item21Index, recipientIndex, fieldName) {
            return this.commonErrorService.getErrorCount(this.errors, [item21Index, recipientIndex, fieldName]);
        };

        this.getErrors = function (item21Index, recipientIndex, fieldName) {
            return this.commonErrorService.getErrors(this.errors, [item21Index, recipientIndex, fieldName]);
        };

        this.processRESTServiceErrors = function(errors) {
            for (var i = 0; i < errors.length; i++) {
                var error = errors[i];
                this.addError(this.errors, [error.errorRoot, error.errorPath, error.errorField],
                    this.generateRESTErrorMessage(error), error.badValue);
            }
        };

        this.generateErrorMessage = function (error) {
            // TODO: do special message formatting here
//            if (error.message === this.types.NO_BILLED_ENTITIES) {
//                return "<li><b>" + error.message + "</b></li>";
//            }
//            else {
                this.commonErrorService.generateErrorMessage(error);
//            }
        };

        this.generateRESTErrorMessage = function(error) {
            if (error.errorCode == "INVALID_VALUE") {
                // TODO: convert generic server errors to more specific UI errors
//                if (error.index3 === "type") {
//                    return this.types.INVALID_BILLED_ENTITY_TYPE;
//                }
            }
            else {
                return this.types[error.errorCode];
            }
        }
    }
);