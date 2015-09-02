'use strict';

angular
    .module('basicInformationValidationService', ['errorService'])
    .service('basicInformationValidationService',
    function validationService(errorService) {
    	/*
    	 * BEGIN Member validation functions
    	 */
    	this.isEntityActive = function (billedEntity) {
    		return billedEntity.status === "Active";
    	};
        
        this.validateBENChange = function(billedEntity){
//        	console.log(basicInformation);
        	errorService.basicInformation.removeError(billedEntity.number);
        	errorService.basicInformation.removeErrorsByType(errorService.basicInformation.types.INACTIVE_BILLED_ENTITY);
        	
        	if (billedEntity.number == null || billedEntity.number == "") {
    			errorService.basicInformation.addError('number',
    					errorService.basicInformation.types.BEN_MISSING, billedEntity.number);
    					billedEntity.name = null;
    		}
        	else if (!this.isEntityActive(billedEntity)) {
                errorService.basicInformation.addError('number',
    					errorService.basicInformation.types.INACTIVE_BILLED_ENTITY, billedEntity.number);
                billedEntity.name = null;
            }
        	
        
        }
		/*
		 * END Group validation functions
		 */
    }
);