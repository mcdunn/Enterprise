'use strict';

angular
    .module('basicInformationErrorService', [])
    .service('basicInformationErrorService',
    function errorService() {

        this.types = {
        	"INVALID_VALUE" : "Invalid Value",
        	//REST service general error messages   
        	"INACTIVE_BILLED_ENTITY":"Inactive Billed Entity",
            "BEN_INVALID":"Invalid Billed Entity Number",
            "FCC_NUMBER_INVALID":"Invalid FCC Registration Number",            
            
            "BEN_MISSING" : "Billed Entity Number is missing"
        };

        this.errors = [];

        this.init = function() {
            this.errors = [];
        };

        this.setCommonErrorService = function(commonErrorService) {
            this.commonErrorService = commonErrorService;
        };

        this.isError = function (fieldName) {
            return this.commonErrorService.isError(this.errors, [fieldName]);
        };

        this.addError = function (fieldName, message, value) {
            this.errors.push({
                'indices': [fieldName],
                'message': message,
                'value': value
            });
        };

        this.removeError = function (fieldName, message) {
            this.errors = this.commonErrorService.removeError(this.errors, [fieldName], message);
        };

        this.removeErrorsByType = function(type) {
            this.errors = this.commonErrorService.removeErrorsByType(this.errors, type);
        };

        this.getErrorMessage = function (fieldName) {
            return this.commonErrorService.getErrorMessage(this.errors, [fieldName]);
        };

        this.getErrorCount = function(fieldName) {
            return this.commonErrorService.getErrorCount(this.errors, [fieldName]);
        };

        this.getErrors = function (fieldName) {
            return this.commonErrorService.getErrors(this.errors, [fieldName]);
        };

        this.processRESTServiceErrors = function(errors) {
            for (var i = 0; i < errors.length; i++) {
                var error = errors[i];
                this.addError(error.errorField,
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
        	var errorField = error.errorField;
        	var message = error.errorMessage;
    		if(error.errorCode == "Digits"){
    			if(errorField == "number"){
    				message = this.types.BEN_INVALID;
    			}
    			else if(errorField == "fccRegistrationNumber"){
    				message = this.types.FCC_NUMBER_INVALID;
    			}
    		}
//    		else if(error.errorCode == "AssertTrue"){
//    			if(errorField == "contractNullWhenAppropriate"){
//    				message = this.types.CONTRACT_NUMBER_MISSING;
//	    		}
//	    		else if(errorField == "restrictionCitationConstraintSatisfied"){
//	    			message = this.types.RESTRICTION_CITATION_MISSING;
//	    		}
//	    		else if(errorField == "serviceStartBeforeExpiration"){
//	    			message = this.types.SERVICE_START_BEFORE_EXP_DATE;
//	    		}
//    		}
//    		else if(error.errorCode == "ValidDate"){
//    			message = this.types.DATE_INVALID;
//    		}
            
            return message;
        }
    }
);