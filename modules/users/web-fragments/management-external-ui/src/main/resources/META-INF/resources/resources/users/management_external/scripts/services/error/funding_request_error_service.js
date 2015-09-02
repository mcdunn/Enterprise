'use strict';

angular
    .module('fundingRequestErrorService', [])
    .service('fundingRequestErrorService',
    function errorService() {

        this.types = {
        	"INVALID_VALUE" : "Invalid Value",
        	//REST service general error messages
            "DATE_INVALID":"Invalid Date",
            "DUP_FRN_INVALID":"Invalid Duplicate Funding Request Number",
            "PRE_FRN_INVALID" : "Invalid Previous FRN Number",
            
            "CONTRACT_NUMBER_MISSING" : "Contract Number is missing",
            
            //Key Information Error Messages
            "SERVICE_START_BEFORE_EXP_DATE" : "Service End Date must be after the Service Start Date",
            "SERVICE_TYPE_MISSING" : "Service Type is required",
            
            "FORM470_NUMBER_MISSING": "Form 470 Number is Required",
            "FORM470_NUMBER_INVALID":"The 470 number must be 15 digits Number",
            "FORM470_NUMBER_NOT_FOUND": "The Form 470 application number entered was not found",
            "IA_470_EXCEMPT_MISSING": "You must select the exemption explanation",
            
            "SPIN_MISSING": "You must select a valid Service Provider",
            "SPIN_INVALID":"The SPIN must be 9 numeric characters",
            "SPIN_NOT_FOUND" : "The Service Provider could not be found",
            "SPIN_NOT_ELIGIBLE_TELE" : "Service Provider is not eligible to provide telecommunication service",
            
            "BAN_DUPLICATE" : "Duplicate Billing Account Number",
            "BAN_TOO_LONG" : "BAN must be in 50 digits",
            "PURCHASE_TYPE_MISSING" : "Purchase Type is required", 
            "SERVICE_START_MISSING" : "Need to specify the Service Start Date",
            "SERVICE_START_BEFORE_AWARD" : "Services Start Date must be after the Award Date",
            "SERVICE_START_OUT" : "Service Start Date must be in current Funding Year",
            
            "SERVICE_END_MISSING" : "Need to specify the Service End Date",
            "SERVICE_END_BEFORE_START" : "Service End Date must be after the Service Start Date",
            "SERVICE_END_OUT" : "Service End Date must be in current Funding Year",
            
            "CONTRACT_END_MISSING" : "Need to specify the Date Your Contract Expires",
            "CONTRACT_END_BEFORE_START" : "Services Start Date must be before the Contract Expire Date",
            "CONTRACT_END_BEFORE_AWARD" : "Contract Expire Date must be after Awarded Date",
            "CONTRACT_END_OUT" : "Contract Expire Date must be in or after current Funding Year",
            
            "AWARD_DATE_MISSING" : "Need to specify the date you Awarded Your contract",
            "AWARD_DATE_OUT": "Contract Award Date must be in or prior to current Funding Year",

            "EXTENSION_MISSING" : "Need to specify if this is contact has voluntary extentions",
            "EXTENSIONS_LEFT_INVALID" : "Extensions Left must be a valid number between 0 and 99",
            "REMAINING_LENGTH_INVALID" : "Remaining Contract must be a valid number between 1 and 99",
            "MASTERCONTRACT_MISSING" : "Need to specify if this Funding Request covered under a master contract",
            
            "IS_CONTINUED_FRN_MISSING": "Need to specify if this Funding Request a continuation of an FRN from a previous funding year based on a multi-year contract",
            "CONTINUED_FRN_MISSING" : "Previous FRN Number must be provided",
            "CONTINUED_FRN_INVALID" : "Previous FRN Number is not valid",
            "CONTINUED_FRN_NOT_FOUND" : "Previous FRN Number is not found",
            
            "RESTRICTIONS_MISSING" : "Please provide Restriction Information",
            "RESTRICTION_TYPE_MISSING" : "The Restriction Type must be provided",
            "RESTRICTION_CITATION_MISSING" : "The Restriction Citation must be provided",
            
            //Item 21 Error Messages
            
            "ITEM21_SERVICE_TYPE_MISSING": "Type of Service is required",
            "ITEM21_PRODUCT_MISSING": "Type of Product Being Maintained is required",
            "ITEM21_CONNECTION_TYPE_MISSING": "Type of Connection is Required",
            "ITEM21_PURPOSE_MISSING": "Purpose is required",
            
            "LINES_MISSING": "# of Lines is required",
            "LINES_INVALID": "# of Lines is invalid",
            
            "QUANTITY_MISSING": "Quantity is required",
            "QUANTITY_INVALID": "Quantity is invalid",

            "QUANTITY_UNIT_MISSING": "Quantity Unit is required",
            
            "COST_ALLOCATION_INVALID": "Cost Allocation Amount should be between 0-100",
            

            "MAKE_MISSING": "Make of Covered Equipment is required",
            "OTHER_MAKE_MISSING" : "Other Make is required",
            
            "MODEL_MISSING": "Model of Covered Equipment is required",
            
            "UPLOAD_SPEED_MISSING": "Upload/Download Speed is required",
            "UPLOAD_SPEED_INVALID": "Upload Speed is invalid",
            "UPLOAD_UNITS_MISSING": "Upload Units is required",
            
            "DOWNLOAD_SPEED_MISSING": "Download Speed is required",
            "DOWNLOAD_SPEED_INVALID": "Download Speed is invalid",
            "DOWNLOAD_UNITS_MISSING": "Download Units is required",
            
            "BURST_BANDWIDTH_MISSING": "Burst Bandwidth is required",
            "BURST_SPEED_MISSING": "Burst Speed is required",
            "BURST_SPEED_INVALID": "Burst Speed is invalid",
            "BURST_UNITS_MISSING": "Burst Units is required",
            
            "LAST_MILE_MISSING": "last Mile is required",
            
            "LEASE_AGREEMENT_MISSING": "Lease or Non-Purchase Agreement is required",
            
            "MONTHLY_ELIGIBLE_COST_INVALID": "Invalid Total Monthly Recurring Eligible Cost",
            "MONTHLY_INELIGIBLE_COST_INVALID": "Invalid Total Monthly Recurring Ineligible Cost",
            "ONE_TIME_ELIGIBLE_COST_INVALID": "Invalid Total One-Time Eligible Cost",
            "ONE_TIME_INELIGIBLE_COST_INVALID": "Invalid Total One-Time Ineligible Cost",
            
            "EXTENDED_COST_MISSING": "Extended Cost cannot be zero. Please enter Monthly Eligible Cost/One Time Eligible Cost.",

            //manage recipients Error Messages
            "CAT_1_REMAINING_AMOUNT_NOT_ZERO": "Remaining should be 0",
            "CAT_2_REMAINING_AMOUNT_NOT_ZERO": "Remaining should be $0.00",
            "CAT_1_LINE_NUMBER_MISSING": "# of Lines per Entity is missing",
            "CAT_1_LINE_NUMBER_INVALID": "# of Lines per Entity is invalid",
            "CAT_2_ELIGIBLE_COST_MISSING": "Eligible Cost per Entity is missing",
            "CAT_2_ELIGIBLE_COST_INVALID": "Eligible cost per Entity is invalid",
            
            "ITEM21__MISSING" : "Line Item is required",
            "RECIPIENT_MISSING" : "Entity is required"
            	
        };

        this.errors = [];

        this.init = function() {
            this.errors = [];
        };

        this.setCommonErrorService = function(commonErrorService) {
            this.commonErrorService = commonErrorService;
        };

        this.isError = function (frn, item21Index, recipientIndex, fieldName) {
            return this.commonErrorService.isError(this.errors, [frn, item21Index, recipientIndex, fieldName]);
        };

        this.addError = function (frn, item21Index, recipientIndex, fieldName, message, value) {
            this.errors.push({
                'indices': [frn, item21Index, recipientIndex, fieldName],
                'message': message,
                'value': value
            });
        };

        this.removeError = function (frn, item21Index, recipientIndex, fieldName, message) {
            this.errors = this.commonErrorService.removeError(this.errors, [frn, item21Index, recipientIndex, fieldName], message);
        };

        this.removeErrorsByType = function(type) {
            this.errors = this.commonErrorService.removeErrorsByType(this.errors, type);
        };

        this.getErrorMessage = function (frn, item21Index, recipientIndex, fieldName) {
            return this.commonErrorService.getErrorMessage(this.errors, [frn, item21Index, recipientIndex, fieldName]);
        };

        this.getErrorCount = function(frn, item21Index, recipientIndex, fieldName) {
            return this.commonErrorService.getErrorCount(this.errors, [frn, item21Index, recipientIndex, fieldName]);
        };

        this.getErrors = function (frn, item21Index, recipientIndex, fieldName) {
            return this.commonErrorService.getErrors(this.errors, [frn, item21Index, recipientIndex, fieldName]);
        };

        this.processRESTServiceErrors = function(frn, errors) {
            for (var i = 0; i < errors.length; i++) {
                var error = errors[i];
                this.addError(frn, error.errorRoot, error.errorPath, error.errorField,
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
    			if(errorField == "duplicateFundingRequestNumber"){
    				message = this.types.DUP_FRN_INVALID;
    			}
    			else if(errorField == "form470Number"){
    				message = this.types.FORM470_NUMBER_INVALID;
    			}
    			else if(errorField == "spinNumber"){
    				message = this.types.SPIN_INVALID;
    			}
    			else if(errorField == "continuedFundingRequestNumber"){
    				message = this.types.PRE_FRN_INVALID;
    			}
    			else if(errorField == "lines"){
    				message = this.types.QUANTITY_INVALID;
    			}
    		}
    		else if(error.errorCode == "AssertTrue"){
    			if(errorField == "contractNullWhenAppropriate"){
    				message = this.types.CONTRACT_NUMBER_MISSING;
	    		}
	    		else if(errorField == "restrictionCitationConstraintSatisfied"){
	    			message = this.types.RESTRICTION_CITATION_MISSING;
	    		}
	    		else if(errorField == "serviceStartBeforeExpiration"){
	    			message = this.types.SERVICE_START_BEFORE_EXP_DATE;
	    		}
    		}
    		else if(error.errorCode == "ValidDate"){
    			message = this.types.DATE_INVALID;
    		}
            
            return message;
        }
    }
);