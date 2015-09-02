'use strict';

angular
    .module('discountCalculationErrorService', [])
    .service('discountCalculationErrorService',
    function errorService() {

        this.types = {
        	//Parent BEN validation messages
            "INVALID_VALUE":"Invalid Value",
            "NO_BILLED_ENTITIES":"No Parent Entities Defined",
            "MULTIPLE_BILLED_ENTITIES":"Multiple Parent Entities Defined",
            "DUPLICATE_BILLED_ENTITIES":"Duplicate Parent Entities Defined",
            "INACTIVE_BILLED_ENTITY":"Inactive Parent Entity",
            "NO_BILLED_ENTITY_TYPE":"No Billed Entity Type",
            "INVALID_BILLED_ENTITY_TYPE":"Invalid Billed Entity Type",
            "NO_ENTITIES":"No Entities Defined",
            
            //Entity Validation Messages
            "ENTITY_NUMBER_MISSING":"Entity Number is Missing",
            "ENTITY_NUMBER_DUPLICATE":"Duplicate Entity Number",
            "ENTITY_NUMBER_INVALID":"Invalid Entity Number",
            "ENTITY_INACTIVE":"Inactive Entity",
            
            "NIF_IND_MISSING":"NIF Must Be Yes or No",
            
            "URBAN_RURAL_STATUS_INVALID":"Invalid Urban/Rural Status",
            "URBAN_RURAL_STATUS_MISSING":"Urban/Rural Status is Missing",
            
            "STUDENT_COUNT_MISSING":"# of Students Full or Part-Time is Missing",
            "STUDENT_COUNT_INCORRECT":"# of Students Full or Part-Time Must Be A Positive Number",
            
    		"NCESCODE_INVALID":"NCES Code Must Only Includes Letters, Numbers, and Dashes",
    		"FCSCCODE_INVALID":"FCSC Code Must Only Includes Letters, Numbers, and Dashes",
    		
	        "MAIN_BRANCH_MISSING":"Main Branch is Missing",
	        
	        "SCHOOL_DISTRICT_NUMBER_MISSING":"School District BEN is Missing",
	        "SCHOOL_DISTRICT_NUMBER_INVALID":"Invalid School District BEN",
	        "SCHOOL_DISTRICT_NUMBER_INACTIVE":"School District BEN is Inactive",
	        
	        "SQUARE_FOOTAGE_MISSING":"Total Square Footage is Missing",
	        "SQUARE_FOOTAGE_INCORRECT":"Total Square Footage Must Be A Positive Number",
	        
	        //WorkSheet Validation Messages
	        "ELIGIBLE_STUDENT_COUNT_MISSING":"Students Attending As Home School is Missing",
        	"ELIGIBLE_STUDENT_COUNT_INCORRECT":"Students Attending As Home School Must Be A Number Between 1 and Students Full or Part Time",
        	"ELIGIBLE_STUDENT_COUNT_INVALID":"Students Attending As Home School Must Be A Positive Number",
        	
    		"CEP_PERCENT_MISSING":"Percentage of Direct Certification Students is Missing",
    		"CEP_PERCENT_INCORRECT":"Percentage of Direct Certification Students Must Be A Number Between 40 And 100",
    		
    		"NSLP_STUDENT_COUNT_MISSING":"Students Eligible For NSLP is Missing",
    		"NSLP_STUDENT_COUNT_INCORRECT":"Students Eligible For NSLP Must Be A Number Between 0 and Students Attending As Home School",
    		
    		
    		//Discount Rate Calculation Validation Messages
    		"TOTAL_STUDENT_ENROLLED_MISSING":"Total # Of Students Enrolled is Missing",
    		"TOTAL_STUDENT_ENROLLED_INCORRECT":"Total # Of Students Enrolled Must Be Between 1 and Total # of Full/Part Time Student",
    		"TOTAL_STUDENT_ENROLLED_INVALID":"Total # Of Students Enrolled Must Be A Positive Number",
    		
    		"TOTAL_STUDENT_NSLP_MISSING":"Total NSLP Students is Missing",
    		"TOTAL_STUDENT_NSLP_INCORRECT":"Total NSLP Students Must Be Between 0 and Total # Of Students Enrolled",
    		"TOTAL_STUDENT_NSLP_INVALID":"Total NSLP Students Must Be A Positive Number",
    			
    		//Back End Validation Message
    		"DUPLICATE_ENTITY_NUMBER":"Duplicate Entity Number",
    		"NO_MAIN_BRANCH":"No Main Branch Defined",
    		"MULTIPLE_MAIN_BRANCHES":"Multiple Main Branched Defined",
    		"ALL_ENTITIES_NIF":"All Entities are NIFs",
    		"SURVEY_INCOMPLETE":"Connectivity Questions are Incomplete"
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
        }
    }
);