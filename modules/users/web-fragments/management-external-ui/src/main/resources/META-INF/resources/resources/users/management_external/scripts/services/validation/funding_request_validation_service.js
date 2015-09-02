'use strict';

angular
    .module('fundingRequestValidationService', ['errorService', 'restService'])
    .service('fundingRequestValidationService',
    function validationService(errorService, restService) {
    	//Validate All the FR key information.
    	this.validatFRKeyInfo = function(keyInformation, fieldName, scope){
    		var frn = keyInformation.fundingRequestNumber;
    		
    		if(fieldName == 'duplicateFundingRequestNumber'){
    			this.validateDupFRN(frn, keyInformation, scope);
    		}
    		if(fieldName == 'serviceType' || fieldName == 'save'){
    			var serviceType = keyInformation.serviceType;
    			errorService.fundingRequest.removeError(frn, null, null, 'serviceType');
    			if((serviceType == null) || (serviceType == undefined) || (serviceType == "") ){
					errorService.fundingRequest.addError(frn, null, null, 'serviceType',
	    					errorService.fundingRequest.types.SERVICE_TYPE_MISSING, serviceType);
				}
    			this.validateForm470(frn, keyInformation);
    		}
    		if(fieldName == 'isIAExempt470' || fieldName == 'isBusinessIA' 
    				|| fieldName == 'form470Number' || fieldName == 'save'){
    			this.validateForm470(frn, keyInformation);
    		}
    		if(fieldName == 'spinNumber' || fieldName == 'save'){
    			this.validateSPIN(frn, keyInformation);
    		}
    		if(fieldName == 'billingAccountNumber' || fieldName == 'save'){
    			this.validteBANs(frn, keyInformation);
    		}
    		if(fieldName == 'purchaseType' || fieldName == 'save'){
    			var purchaseType = keyInformation.purchaseType;
    			errorService.fundingRequest.removeError(frn, null, null, 'purchaseType');
    			if((purchaseType == null) || (typeof purchaseType == undefined) || (purchaseType == "") ){
					errorService.fundingRequest.addError(frn, null, null, 'purchaseType',
	    					errorService.fundingRequest.types.PURCHASE_TYPE_MISSING, purchaseType);
				}
    			
    			this.validateServiceDate(frn, keyInformation);
				this.validateExtension(frn, keyInformation);
				this.validateMaster(frn, keyInformation);
				this.validateContinuedFRN(frn, keyInformation, scope);
    		}
    		if(fieldName == 'startService' || fieldName == 'endService'|| fieldName == 'startContract' 
    				 || fieldName == 'endContract'  || fieldName == 'save'){
    			this.validateServiceDate(frn, keyInformation);
    		}
    		if(fieldName =='hasExtensions' || fieldName == 'noOfExtensions' 
    			    || fieldName == 'totalLength'  || fieldName == 'save'){
    			this.validateExtension(frn, keyInformation);
    		}
    		if(fieldName == 'masterContract' || fieldName == 'save'){
    			this.validateMaster(frn, keyInformation);
    		}
    		if(fieldName == 'isContinuedFundingRequest' || fieldName == 'continuedFundingRequestNumber'  || fieldName == 'save'){
    			this.validateContinuedFRN(frn, keyInformation, scope);
    		}
    		if(fieldName =='hasRestrictions' || fieldName == 'restrictionType' 
    			    || fieldName == 'restrictionCitation'  || fieldName == 'save'){
    			this.validateRestriction(frn, keyInformation);
    		}
    	};
    	
    	this.validateItem21s = function(scope){
    		var frn = scope.fundingRequest.fundingRequestNumber;
    		var item21Count = scope.fundingRequest.item21s.length - Object.keys(scope.fundingRequest.removedItem21Map).length;
    		errorService.fundingRequest.removeError(frn, null, null, 'item21', errorService.fundingRequest.types.ITEM21__MISSING);
    		if(item21Count === 0){
    			errorService.fundingRequest.addError(frn, null, null, 'item21',
    					errorService.fundingRequest.types.ITEM21__MISSING);
    		}
    	};
    	
    	this.validateItem21 = function(scope, item21, fieldName){
    		errorService.fundingRequest.removeError(frn, null, null, 'item21', errorService.fundingRequest.types.ITEM21__MISSING);
    		
    		var frn = scope.fundingRequest.fundingRequestNumber;
    		var category = (scope.fundingRequest.keyInformation.serviceType == 'INTERNAL CONNECTIONS'
				|| scope.fundingRequest.keyInformation.serviceType == 'INTERNAL CONNECTIONS MNT'
				|| scope.fundingRequest.keyInformation.serviceType == 'INTERNAL CONNECTIONS MIBS') ? 2 : 1;    		
   		
    		
    		if(fieldName == 'productType'){
    			var productType = item21.productType;
    			errorService.fundingRequest.removeError(frn, item21.index, null, 'productType');
    			if((productType == null) || (productType == undefined) || (productType == "") ){
					errorService.fundingRequest.addError(frn, item21.index, null, 'productType',
	    					errorService.fundingRequest.types.ITEM21_PRODUCT_MISSING, productType);
				}
    			
    		}
    		//Only validate category fields
    		if(category == '1'){
    			if(fieldName == 'functionType'){
        			var functionType = item21.functionType;
        			errorService.fundingRequest.removeError(frn, item21.index, null, 'functionType');
        			if((functionType == null) || (functionType == undefined) || (functionType == "") ){
    					errorService.fundingRequest.addError(frn, item21.index, null, 'functionType',
    	    					errorService.fundingRequest.types.ITEM21_SERVICE_TYPE_MISSING, functionType);
    				}
        			
        		}
    			
    			if(fieldName == 'purpose'){
        			var purpose = item21.purpose;
        			errorService.fundingRequest.removeError(frn, item21.index, null, 'purpose');
        			if((purpose == null) || (purpose == undefined) || (purpose == "") ){
    					errorService.fundingRequest.addError(frn, item21.index, null, 'purpose',
    	    					errorService.fundingRequest.types.ITEM21_PURPOSE_MISSING, purpose);
    				}
        			
        		}
        		
        		if(fieldName == 'lines'){
        			var lines = item21.lines;
        			errorService.fundingRequest.removeError(frn, item21.index, null, 'lines');
        			if((lines == null) || (typeof lines === 'undefined') || (lines == "") ){
    					errorService.fundingRequest.addError(frn, item21.index, null, 'lines',
    	    					errorService.fundingRequest.types.LINES_MISSING, lines);
    				}
        			else if((lines < 0) || (lines > 999999) || isNaN(lines) ){
    					errorService.fundingRequest.addError(frn, item21.index, null, 'lines',
    	    					errorService.fundingRequest.types.LINES_INVALID, lines);
    				}
        		}
        		
        		if(fieldName == 'lastMile'){
        			var lastMile = item21.lastMile;
        			errorService.fundingRequest.removeError(frn, item21.index, null, 'lastMile');
        			if(typeof lastMile === 'undefined'){
    					errorService.fundingRequest.addError(frn, item21.index, null, 'lastMile',
    	    					errorService.fundingRequest.types.LAST_MILE_MISSING, lastMile);
    				}
        		}
        		
        		if(fieldName == 'bandwidth'){
        			var uploadSpeed = item21.uploadSpeed;
        			var uploadUnits = item21.uploadUnits;
        			var downloadSpeed = item21.downloadSpeed;
        			var downloadUnits = item21.downloadUnits;
        			
        			errorService.fundingRequest.removeError(frn, item21.index, null, 'uploadSpeed');
        			errorService.fundingRequest.removeError(frn, item21.index, null, 'uploadUnits');
        			errorService.fundingRequest.removeError(frn, item21.index, null, 'downloadSpeed');
        			errorService.fundingRequest.removeError(frn, item21.index, null, 'downloadUnits');
        			
        			//Validate Upload speed & unit
        			if((uploadSpeed == null) || (typeof uploadSpeed === 'undefined') || (uploadSpeed == "")){
        				if(scope.fundingRequest.keyInformation.serviceType != 'VOICE SERVICES'){
        					errorService.fundingRequest.addError(frn, item21.index, null, 'uploadSpeed',
            						errorService.fundingRequest.types.UPLOAD_SPEED_MISSING, uploadSpeed);
        				}
        			}
        			else if( isNaN(uploadSpeed) || (uploadSpeed < 0) || (uploadSpeed > 9999)  ){
    					errorService.fundingRequest.addError(frn, item21.index, null, 'uploadSpeed',
    	    					errorService.fundingRequest.types.UPLOAD_SPEED_INVALID, uploadSpeed);
    				}
        			
    				if((uploadUnits == null) || (typeof uploadUnits === 'undefined') || (uploadUnits == "")){
    					if(scope.fundingRequest.keyInformation.serviceType != 'VOICE SERVICES'){
	        				errorService.fundingRequest.addError(frn, item21.index, null, 'uploadUnits',
	        						errorService.fundingRequest.types.UPLOAD_UNITS_MISSING, uploadUnits);
    					}
        			}
    				
    				//Validate Download speed & Unit
    				if((downloadSpeed == null) || (typeof downloadSpeed === 'undefined') || (downloadSpeed == "")){
    					if(scope.fundingRequest.keyInformation.serviceType != 'VOICE SERVICES'){
    						errorService.fundingRequest.addError(frn, item21.index, null, 'downloadSpeed',
        						errorService.fundingRequest.types.DOWNLOAD_SPEED_MISSING, downloadSpeed);
    					}
        			}
    				else if( isNaN(downloadSpeed) || (downloadSpeed < 0) || (downloadSpeed > 9999)  ){
    					errorService.fundingRequest.addError(frn, item21.index, null, 'downloadSpeed',
    	    					errorService.fundingRequest.types.DOWNLOAD_SPEED_INVALID, downloadSpeed);
    				}

    				if((downloadUnits == null) || (typeof downloadUnits === 'undefined') || (downloadUnits == "")){
    					if(scope.fundingRequest.keyInformation.serviceType != 'VOICE SERVICES'){
	        				errorService.fundingRequest.addError(frn, item21.index, null, 'downloadUnits',
	        						errorService.fundingRequest.types.DOWNLOAD_UNITS_MISSING, downloadUnits);
    					}
        			}
        		}
        		
        		if(fieldName == 'burstBandwidth'){
        			var isBurstBandwidth = item21.isBurstBandwidth;
        			var burstSpeed = item21.burstSpeed;
        			var burstUnits = item21.burstUnits;
        			
        			errorService.fundingRequest.removeError(frn, item21.index, null, 'isBurstBandwidth');
        			errorService.fundingRequest.removeError(frn, item21.index, null, 'burstSpeed');
        			errorService.fundingRequest.removeError(frn, item21.index, null, 'burstUnits');
        			
        			if((isBurstBandwidth == null) || (typeof isBurstBandwidth === 'undefined') || (isBurstBandwidth == "")){
        				if((isBurstBandwidth == true) || (isBurstBandwidth == false)){
        					errorService.fundingRequest.removeError(frn, item21.index, null, 'isBurstBandwidth');
        				}
        				else{
        					errorService.fundingRequest.addError(frn, item21.index, null, 'isBurstBandwidth',
            						errorService.fundingRequest.types.BURST_BANDWIDTH_MISSING, isBurstBandwidth);
        				}    				
        			}

        			if(isBurstBandwidth == true){
        				if((burstSpeed == null) || (typeof burstSpeed === 'undefined') || (burstSpeed == "")){
            				errorService.fundingRequest.addError(frn, item21.index, null, 'burstSpeed',
            						errorService.fundingRequest.types.BURST_SPEED_MISSING, burstSpeed);
            			}
        				else if( isNaN(burstSpeed) || (burstSpeed < 0) || (burstSpeed > 9999)  ){
        					errorService.fundingRequest.addError(frn, item21.index, null, 'burstSpeed',
        	    					errorService.fundingRequest.types.BURST_SPEED_INVALID, burstSpeed);
        				}
            			if((burstUnits == null) || (typeof burstUnits === 'undefined') || (burstUnits == "")){
            				errorService.fundingRequest.addError(frn, item21.index, null, 'burstUnits',
            						errorService.fundingRequest.types.BURST_UNITS_MISSING, burstUnits);
            			}
        			}
        			
        			if(fieldName == 'remaining'){
        				var remaining = item21.remaining;
        				errorService.fundingRequest.removeError(frn, item21.index, null, 'remaining');
            			if(remaining > 0){
        					errorService.fundingRequest.addError(frn, item21.index, null, 'remaining',
        	    					errorService.fundingRequest.types.CAT_1_REMAINING_AMOUNT_NOT_ZERO, remaining);
        				}
        			}
        		}
    		}
    		
    		if(category == '2'){
    			if(fieldName == 'functionType'){
        			var functionType = item21.functionType;
        			errorService.fundingRequest.removeError(frn, item21.index, null, 'functionType');
        			if((functionType == null) || (functionType == undefined) || (functionType == "") ){
    					errorService.fundingRequest.addError(frn, item21.index, null, 'functionType',
    	    					errorService.fundingRequest.types.ITEM21_CONNECTION_TYPE_MISSING, functionType);
    				}
        			
        		}
    			
    			if(fieldName == 'leaseAgreement'){
        			var leaseAgreement = item21.leaseAgreement;
        			errorService.fundingRequest.removeError(frn, item21.index, null, 'leaseAgreement');
        			if(leaseAgreement == undefined){
    					errorService.fundingRequest.addError(frn, item21.index, null, 'leaseAgreement',
    	    					errorService.fundingRequest.types.LEASE_AGREEMENT_MISSING, leaseAgreement);
    				}
        			
        		}
    			
    			if(fieldName == 'item21ServiceType'){
    				var item21ServiceType = item21.serviceType;
    				errorService.fundingRequest.removeError(frn, item21.index, null, 'item21ServiceType');
        			if((item21ServiceType == null) || (item21ServiceType == undefined) || (item21ServiceType == "") ){
    					errorService.fundingRequest.addError(frn, item21.index, null, 'item21ServiceType',
    	    					errorService.fundingRequest.types.ITEM21_SERVICE_TYPE_MISSING, item21ServiceType);
    				}
    			}
    			
    			if(fieldName == 'quantity'){
        			var quantity = item21.quantity;
        			errorService.fundingRequest.removeError(frn, item21.index, null, 'quantity');
        			if((quantity == null) || (typeof quantity === 'undefined') || (quantity == "") ){
    					errorService.fundingRequest.addError(frn, item21.index, null, 'quantity',
    	    					errorService.fundingRequest.types.QUANTITY_MISSING, quantity);
    				}
        			else if((quantity < 0) || (quantity > 999999) || isNaN(quantity) ){
    					errorService.fundingRequest.addError(frn, item21.index, null, 'quantity',
    	    					errorService.fundingRequest.types.QUANTITY_INVALID, quantity);
    				}
        		}
    			
    			if(fieldName == 'quantityUnit'){
    				var quantityUnit = item21.quantityUnit;
    				errorService.fundingRequest.removeError(frn, item21.index, null, 'quantityUnit');
        			if((quantityUnit == null) || (quantityUnit == undefined) || (quantityUnit == "") ){
    					errorService.fundingRequest.addError(frn, item21.index, null, 'quantityUnit',
    	    					errorService.fundingRequest.types.QUANTITY_UNIT_MISSING, quantityUnit);
    				}
    			}
    			
    			if(fieldName == 'costAllocationAmt'){
        			var costAllocationAmt = item21.costAllocationAmt;
        			errorService.fundingRequest.removeError(frn, item21.index, null, 'costAllocationAmt');
        			if((costAllocationAmt < 0) || (costAllocationAmt > 100) || isNaN(costAllocationAmt) ){
    					errorService.fundingRequest.addError(frn, item21.index, null, 'costAllocationAmt',
    	    					errorService.fundingRequest.types.COST_ALLOCATION_INVALID, costAllocationAmt);
    				}
        		}
    			
    			if(fieldName == 'make'){
    				var make = item21.make;
    				errorService.fundingRequest.removeError(frn, item21.index, null, 'make');
        			if((make == null) || (make == undefined) || (make == "") ){
    					errorService.fundingRequest.addError(frn, item21.index, null, 'make',
    	    					errorService.fundingRequest.types.MAKE_MISSING, make);
    				}
        			else if(make === 'Other'){
        				var makeOther = item21.makeOther;
        				errorService.fundingRequest.removeError(frn, item21.index, null, 'makeOther');
            			if((makeOther == null) || (makeOther == undefined) || (makeOther == "") ){
        					errorService.fundingRequest.addError(frn, item21.index, null, 'makeOther',
        	    					errorService.fundingRequest.types.OTHER_MAKE_MISSING, model);
        				}
        			}
    			}
    			
    			if(fieldName == 'model'){
    				var model = item21.model;
    				errorService.fundingRequest.removeError(frn, item21.index, null, 'model');
        			if((model == null) || (model == undefined) || (model == "") ){
    					errorService.fundingRequest.addError(frn, item21.index, null, 'model',
    	    					errorService.fundingRequest.types.MODEL_MISSING, model);
    				}
    			}
    		}
    		
    		if(fieldName == 'monthlyEligibleCost'){
    			var monthlyEligibleCost = item21.monthlyEligibleCost;
    			var minCost = 0.00;
    			var maxCost = 2000000;
    			errorService.fundingRequest.removeError(frn, item21.index, null, 'monthlyEligibleCost');
    			if((monthlyEligibleCost < minCost || monthlyEligibleCost > maxCost || isNaN(monthlyEligibleCost)) ){
					errorService.fundingRequest.addError(frn, item21.index, null, 'monthlyEligibleCost',
	    					errorService.fundingRequest.types.MONTHLY_ELIGIBLE_COST_INVALID, monthlyEligibleCost);
				}
    		}
    		
    		if(fieldName == 'monthlyIneligibleCost'){
    			var monthlyIneligibleCost = item21.monthlyIneligibleCost;
    			var minCost = 0.00;
    			var maxCost = 2000000;
    			errorService.fundingRequest.removeError(frn, item21.index, null, 'monthlyIneligibleCost');
    			if((monthlyIneligibleCost < minCost || monthlyIneligibleCost > maxCost || isNaN(monthlyIneligibleCost)) ){
					errorService.fundingRequest.addError(frn, item21.index, null, 'monthlyIneligibleCost',
	    					errorService.fundingRequest.types.MONTHLY_INELIGIBLE_COST_INVALID, monthlyIneligibleCost);
				}
    		}
    		
    		if(fieldName == 'oneTimeEligibleCost'){
    			var oneTimeEligibleCost = item21.oneTimeEligibleCost;
    			var minCost = 0.00;
    			var maxCost = 2000000;
    			errorService.fundingRequest.removeError(frn, item21.index, null, 'oneTimeEligibleCost');
    			if((oneTimeEligibleCost < minCost || oneTimeEligibleCost > maxCost || isNaN(oneTimeEligibleCost)) ){
					errorService.fundingRequest.addError(frn, item21.index, null, 'oneTimeEligibleCost',
	    					errorService.fundingRequest.types.ONE_TIME_ELIGIBLE_COST_INVALID, oneTimeEligibleCost);
				}
    		}
    		
    		if(fieldName == 'oneTimeIneligibleCost'){
    			var oneTimeIneligibleCost = item21.oneTimeIneligibleCost;
    			var minCost = 0.00;
    			var maxCost = 2000000;
    			errorService.fundingRequest.removeError(frn, item21.index, null, 'oneTimeIneligibleCost');
    			if((oneTimeIneligibleCost < minCost || oneTimeIneligibleCost > maxCost || isNaN(oneTimeIneligibleCost)) ){
					errorService.fundingRequest.addError(frn, item21.index, null, 'oneTimeIneligibleCost',
	    					errorService.fundingRequest.types.ONE_TIME_INELIGIBLE_COST_INVALID, oneTimeIneligibleCost);
				}
    		}
    		
    		if(fieldName == 'extendedCost'){
    			var extendedCost = item21.extendedCost;
    			errorService.fundingRequest.removeError(frn, item21.index, null, 'extendedCost');
    			if(extendedCost == 0 ){
					errorService.fundingRequest.addError(frn, item21.index, null, 'extendedCost',
	    					errorService.fundingRequest.types.EXTENDED_COST_MISSING, extendedCost);
				}
    		}
    	};
    	
    	
    	this.validateItem21Recipient=function(fundingRequest, item21, recipient, fieldName){
    		
    		var category = (fundingRequest.keyInformation.serviceType == 'INTERNAL CONNECTIONS'
				|| fundingRequest.keyInformation.serviceType == 'INTERNAL CONNECTIONS MNT'
				|| fundingRequest.keyInformation.serviceType == 'INTERNAL CONNECTIONS MIBS') ? 2 : 1;
    		
    		var frn = fundingRequest.keyInformation.fundingRequestNumber;
    		if (category==1 && !item21.lastMile)
    		{
    			errorService.fundingRequest.removeError(frn, item21.index, recipient.index, null);
    			errorService.fundingRequest.removeError(frn, item21.index, null, 'remaining');
    		}
    		
    		
    		if (category==1 && item21.lastMile)
    		{
    			//Only validte recipients when LastMile = YES (True)
    				if(fieldName == 'quantity'||fieldName=='save'){
                		var quantity = recipient.quantity;
                			errorService.fundingRequest.removeError(frn, item21.index, recipient.index, 'quantity');
                			if((quantity === null) || (quantity === undefined) || (quantity === "") ){
            					errorService.fundingRequest.addError(frn, item21.index, recipient.index, 'quantity',
            	    					errorService.fundingRequest.types.CAT_1_LINE_NUMBER_MISSING, quantity);
            				}
                			if(isNaN(quantity)||quantity<0){
            					errorService.fundingRequest.addError(frn, item21.index, recipient.index, 'quantity',
            	    					errorService.fundingRequest.types.CAT_1_LINE_NUMBER_INVALID, quantity);
            				}
                		}
            		
            		var remaining=item21.remaining;
            		errorService.fundingRequest.removeError(frn,item21.index,null,'remaining');
            		if(!isNaN(remaining))
            			{
            			if (remaining !=0 && remaining != null && remaining !="")
            				{
            				errorService.fundingRequest.addError(frn, item21.index, null, 'remaining',
        	    					errorService.fundingRequest.types.CAT_1_REMAINING_AMOUNT_NOT_ZERO, remaining);
        					}
            			}
    		}
    		if (category==2)
    		{

        		if(fieldName == 'costAllocationAmt'||fieldName=='save'){
            		var costAllocationAmt = recipient.costAllocationAmt;
            			errorService.fundingRequest.removeError(frn, item21.index, recipient.index, 'costAllocationAmt');
            			if((costAllocationAmt === null) || (costAllocationAmt === undefined) || (costAllocationAmt === "")){
        					errorService.fundingRequest.addError(frn, item21.index, recipient.index, 'costAllocationAmt',
        	    					errorService.fundingRequest.types.CAT_2_ELIGIBLE_COST_MISSING, costAllocationAmt);
        				}
            			if(isNaN(costAllocationAmt)||costAllocationAmt<0){
        					errorService.fundingRequest.addError(frn, item21.index, recipient.index, 'costAllocationAmt',
        	    					errorService.fundingRequest.types.CAT_2_ELIGIBLE_COST_INVALID, costAllocationAmt);
        				}
            			}
        		
        		var remaining=item21.remaining;
        		errorService.fundingRequest.removeError(frn,item21.index,null,'remaining');
        		if(!isNaN(remaining))
        			{
        			if (remaining !=0 && remaining != null && remaining !="")
        				{
        				errorService.fundingRequest.addError(frn, item21.index, null, 'remaining',
    	    					errorService.fundingRequest.types.CAT_2_REMAINING_AMOUNT_NOT_ZERO, remaining);
    					}
        			}
        		
    		}
    		
    	};
    	
    	this.validateItem21Recipients = function(fundingRequest, item21){
    		var frn = fundingRequest.fundingRequestNumber;
    		
    		errorService.fundingRequest.removeError(frn, item21.index, null, 'item21Recipients', errorService.fundingRequest.types.RECIPIENT_MISSING);
    		if(item21.entityCount === 0){
    			errorService.fundingRequest.addError(frn, item21.index, null, 'item21Recipients',
    					errorService.fundingRequest.types.RECIPIENT_MISSING);
    		}
    	};
    	
    	//Validate and retrieve Duplicate Funding Request detail
    	this.validateDupFRN = function(frn, keyInformation, scope){
    		var dupFRN = keyInformation.duplicateFundingRequestNumber;
    		errorService.fundingRequest.removeError(frn, null, null, 'duplicateFundingRequestNumber');
    		if(dupFRN != null && dupFRN != '' && dupFRN != undefined ){
    			if(isNaN(dupFRN)){
    			errorService.fundingRequest.addError(frn, null, null, 'duplicateFundingRequestNumber',
    						 errorService.fundingRequest.types.DUP_FRN_INVALID, dupFRN);
    			keyInformation.dupFrnAppNumber = null;
    			keyInformation.dupFrnEntityName = null;
	    		}
	    		else{
	    			restService.modifyRestService.getFundingRequestLimitedDetail(dupFRN, scope.version).then(
	    					function (fundingRequest) {
	                        	if(fundingRequest == null){
	                        		errorService.fundingRequest.addError(frn, null, null, 'duplicateFundingRequestNumber',
												 errorService.fundingRequest.types.DUP_FRN_INVALID, dupFRN);
	                        		keyInformation.dupFrnAppNumber = null;
	                        		keyInformation.dupFrnEntityName = null;
	                        	}
	                        	else {
	                        		keyInformation.dupFrnAppNumber = fundingRequest.applicationNumber;
	                        		keyInformation.dupFrnEntityName = fundingRequest.entityName;
	                        	}
	                        },
	                        function (httpErrorCode) {
	                        	errorService.fundingRequest.addError(frn, null, null, 'duplicateFundingRequestNumber',
										     errorService.fundingRequest.types.DUP_FRN_INVALID, dupFRN);
	                        	keyInformation.dupFrnAppNumber = null;
                        		keyInformation.dupFrnEntityName = null;
	                        });
	    		}
    		}
    	};
    	
    	//Validate Form 470 Number 
		//only when Form470 Number is displayed.
    	this.validateForm470 = function(frn, keyInformation){
    		var form470Number = keyInformation.form470Number;
    		
    		errorService.fundingRequest.removeError(frn, null, null, 'isIAExempt470');
			errorService.fundingRequest.removeError(frn, null, null, 'form470Number');
			errorService.fundingRequest.removeError(frn, null, null, 'isBusinessIA'); 
			
			if(keyInformation.isIAExempt470){
				if(!keyInformation.isBusinessIA){
					errorService.fundingRequest.addError(frn, null, null, 'isBusinessIA',
						     errorService.fundingRequest.types.IA_470_EXCEMPT_MISSING, null);
				}
			}
			else{
				if(keyInformation.serviceType == 'INTERNET ACCESS'){
					if(keyInformation.isIAExempt470 == null || typeof keyInformation.isIAExempt470 == undefined){
						errorService.fundingRequest.addError(frn, null, null, 'isIAExempt470',
		    					errorService.fundingRequest.types.IA_470_EXCEMPT_MISSING);
					}
				}
				
				if((form470Number == null) || (typeof form470Number == undefined) || (form470Number == "") ){
					errorService.fundingRequest.addError(frn, null, null, 'form470Number',
	    					errorService.fundingRequest.types.FORM470_NUMBER_MISSING, form470Number);
				}
				else if(isNaN(form470Number)){
					errorService.fundingRequest.addError(frn, null, null, 'form470Number',
	    					errorService.fundingRequest.types.FORM470_NUMBER_INVALID, form470Number);
				}
				else{
					restService.modifyRestService.getForm470Detail(form470Number).then(
							function (form470) {
	                        	if(form470 == null){
	                        		errorService.fundingRequest.addError(frn, null, null, 'form470Number',
												 errorService.fundingRequest.types.FORM470_NUMBER_NOT_FOUND, form470Number);
	                        	}
	                        },
	                        function (httpErrorCode) {
	                        	errorService.fundingRequest.addError(frn, null, null, 'form470Number',
										     errorService.fundingRequest.types.FORM470_NUMBER_NOT_FOUND, form470Number);
	                        });
				}	
			}
    	};
    	
    	//Validate and retrieve service provider information
    	this.validateSPIN = function(frn, keyInformation){
    		var spin = keyInformation.spinNumber;
    		
        	errorService.fundingRequest.removeError(frn, null, null, 'spinNumber');
        	if(spin == null || spin == '' || typeof spin == undefined){
        		errorService.fundingRequest.addError(frn, null, null, 'spinNumber',
					     errorService.fundingRequest.types.SPIN_MISSING, spin);
        		keyInformation.spinName = null;
        	}
        	else if(isNaN(spin)){
        		errorService.fundingRequest.addError(frn, null, null, 'spinNumber',
					     errorService.fundingRequest.types.SPIN_INVALID, spin);
        		keyInformation.spinName = null;
        	}
        	else{
        		restService.modifyRestService.getServiceProvider(spin).then(
                    	function (data) {
                    		keyInformation.spinName = data.name;
                        },
                        function (httpErrorCode) {
                        	errorService.fundingRequest.addError(frn, null, null, 'spinNumber',
        						     errorService.fundingRequest.types.SPIN_NOT_FOUND, spin);
                        	keyInformation.spinName = null;
                 });
        	}
        	
        };
        
        //validate Billing Account Number
        this.validteBANs = function(frn, keyInformation){
        	var bans = keyInformation.billingAccountNumber;
        	
        	if((bans != null) && (bans != "") && (typeof bans != undefined)){
        		var uniqueBans = {};
            	var duplicateBans = null;
            	
            	errorService.fundingRequest.removeError(frn, null, null, 'billingAccountNumber');
            	//find the duplicate BAN
            	for(var i=0 ; i<bans.length ; i++){
            		var ban = bans[i];
            		if(ban.length > 50){
            			errorService.fundingRequest.addError(frn, null, null, 'billingAccountNumber',
       					     errorService.fundingRequest.types.BAN_TOO_LONG, ban);
            		}
            		if(uniqueBans[ban]){
            			duplicateBans = (duplicateBans == null ? "" :   duplicateBans+ ", " ) + ban;
            		}
            		else{
            			uniqueBans[ban]=1;
            		}
            	}
            	
            	if(duplicateBans != null){
            		errorService.fundingRequest.addError(frn, null, null, 'billingAccountNumber',
    					     errorService.fundingRequest.types.BAN_DUPLICATE, duplicateBans);
            	}
        	}
        };
        
        //Validation for service dates
        this.validateServiceDate = function(frn, keyInformation){
        	errorService.fundingRequest.removeError(frn, null, null, 'startService');
        	errorService.fundingRequest.removeError(frn, null, null, 'endService');
        	errorService.fundingRequest.removeError(frn, null, null, 'startContract');
        	errorService.fundingRequest.removeError(frn, null, null, 'endContract');
        	
        	var serviceStartDate = keyInformation.startService;
        	var serviceEndDate = keyInformation.endService;
        	var contractEndDate = keyInformation.endContract;
        	var contractAwardDate = keyInformation.startContract;
        	
        	if(keyInformation.purchaseType != 'CONTRACT'){
        		//Validate service Start date.
        		if((serviceStartDate == null) || (serviceStartDate == "") || (typeof serviceStartDate == undefined) ){
            		errorService.fundingRequest.addError(frn, null, null, 'startService',
    					     errorService.fundingRequest.types.SERVICE_START_MISSING, null);
            	}
        		else{
    				this.checkFundingYear(frn, serviceStartDate, keyInformation.serviceType, 'startService');
        		}
    				
        		//Validate service End date.
				if((serviceEndDate == null) || (serviceEndDate == "") || (typeof serviceEndDate == undefined)){
    				errorService.fundingRequest.addError(frn, null, null, 'endService',
   					     errorService.fundingRequest.types.SERVICE_END_MISSING, null);
				}
				else{
					this.checkFundingYear(frn, serviceEndDate, keyInformation.serviceType, 'endService');

				}
				
				//Service Start Date should be BEFORE Service End Date
				if( (serviceStartDate != null) && (serviceStartDate != "") && (typeof serviceStartDate != undefined) &&
					(serviceEndDate != null) && (serviceEndDate != "") && (typeof serviceEndDate != undefined)){
    				if( (new Date(serviceEndDate)) < (new Date(serviceStartDate)) ){
            			errorService.fundingRequest.addError(frn, null, null, 'endService',
       					     errorService.fundingRequest.types.SERVICE_END_BEFORE_START, serviceEndDate);
    				}
				}
        	}
        	else{
        		//validate Contract Award Date
        		if((contractAwardDate == null) || (contractAwardDate == "") || (typeof contractAwardDate == undefined) ){
            		errorService.fundingRequest.addError(frn, null, null, 'startContract',
    					     errorService.fundingRequest.types.AWARD_DATE_MISSING, null);
            	}
        		else{
    				this.checkFundingYear(frn, contractAwardDate, keyInformation.serviceType, 'startContract');
        		}
        		
        		//Validate Contract Expire Date
        		if((contractEndDate == null) || (contractEndDate == "") || (typeof contractEndDate == undefined)){
        			errorService.fundingRequest.addError(frn, null, null, 'endContract',
      					     errorService.fundingRequest.types.CONTRACT_END_MISSING, null);
        		}
        		else{
        			this.checkFundingYear(frn, contractEndDate, keyInformation.serviceType, 'endContract');
        			if((contractAwardDate != null) && (contractAwardDate != "") && (typeof contractAwardDate != undefined)){
        				//Contract End Date should be BEFORE Contract Award Date
            			if((new Date(contractEndDate)) < (new Date(contractAwardDate)) ){
            				errorService.fundingRequest.addError(frn, null, null, 'endContract',
             					     errorService.fundingRequest.types.CONTRACT_END_BEFORE_AWARD, contractEndDate);
            			}
        			}
        		}
        		
        		//Validate Service Start Date
        		if((serviceStartDate == null) || (serviceStartDate == "") || (typeof serviceStartDate == undefined)){
        			errorService.fundingRequest.addError(frn, null, null, 'startService',
   					     errorService.fundingRequest.types.SERVICE_START_MISSING, null);
        		}
        		else{
    				this.checkFundingYear(frn, serviceStartDate, keyInformation.serviceType, 'startService');
    				
    				if((contractAwardDate != null) && (contractAwardDate != "") && (typeof contractAwardDate != undefined)){
    					//Contract Start Date should be BEFORE Contract Award Date
    	    			if((new Date(serviceStartDate)) < (new Date(contractAwardDate)) ){
    	    				errorService.fundingRequest.addError(frn, null, null, 'startService',
    	      					     errorService.fundingRequest.types.SERVICE_START_BEFORE_AWARD, serviceStartDate);
    	    			}
    				}
    				
    				if((contractEndDate != null) && (contractEndDate != "") && (typeof contractEndDate != undefined)){
    					//Service Start Date should be BEFORE Contract End Date
    	    			if((new Date(contractEndDate)) < (new Date(serviceStartDate)) ){
    	    				errorService.fundingRequest.addError(frn, null, null, 'startService',
    	    					     errorService.fundingRequest.types.CONTRACT_END_BEFORE_START, serviceStartDate);
    	    			}
    				}
        		}
        	}
        };
        
        //The date should be in Current Funding Year
        //Current Funding Year 07/01/2015 (04/01/2015 Cat-2 IC only) - 06/30/2016
        this.checkFundingYear = function(frn, inpuDate, serviceType, fieldName){
        	var FY_START_JULY = new Date('07/01/2015');
        	var FY_START_APR = new Date('04/01/2015');
        	var FY_END = new Date('06/30/2016');
        	var errorMessage = null;
        	
        	if(fieldName == 'startService'){
        		errorMessage = errorService.fundingRequest.types.SERVICE_START_OUT;
        	}
        	else if(fieldName == 'endService'){
        		errorMessage = errorService.fundingRequest.types.SERVICE_END_OUT;
        	}
        	else if(fieldName == 'startContract'){
        		errorMessage = errorService.fundingRequest.types.AWARD_DATE_OUT;
        	}
        	else if(fieldName == 'endContract'){
        		errorMessage = errorService.fundingRequest.types.CONTRACT_END_OUT;
        	}
        	
        	//Start Validate Date
        	//Cat-2 IA: Can not before 04/01 EXCEPT Contract Award Date
        	if( (serviceType == 'INTERNAL CONNECTIONS') &&
				(fieldName != 'startContract') &&
				(new Date(inpuDate) < FY_START_APR)){
					errorService.fundingRequest.addError(frn, null, null, fieldName, errorMessage, inpuDate);
			}
        	//NOT Cat-2 IA: can not before 07/01 EXCEPT Contract Award Date
			else if( (serviceType != 'INTERNAL CONNECTIONS') &&
					 (fieldName != 'startContract') &&
					 (new Date(inpuDate) < FY_START_JULY) ){
					     errorService.fundingRequest.addError(frn, null, null, fieldName, errorMessage, inpuDate);
			}
        	//Date can not after 06/30 EXCEPT Contract Expire Date
			else if((fieldName != 'endContract') && 
					(new Date(inpuDate) > FY_END) ){
					 errorService.fundingRequest.addError(frn, null, null, fieldName, errorMessage, inpuDate);
			}
        };
        
        //Validate extension for CONTRACT
        this.validateExtension = function(frn, keyInformation){
        	errorService.fundingRequest.removeError(frn, null, null, 'hasExtensions');
        	errorService.fundingRequest.removeError(frn, null, null, 'noOfExtensions');
        	errorService.fundingRequest.removeError(frn, null, null, 'totalLength');
        	
        	var hasExtensions = keyInformation.hasExtensions;
        	var noOfExtensions = keyInformation.noOfExtensions;
        	var totalLength = keyInformation.totalLength;
        	
        	if(hasExtensions){
        		if( ((noOfExtensions == null) || (noOfExtensions == undefined) || (noOfExtensions == "")) ||
	        			(isNaN(noOfExtensions)) ||
	        			(noOfExtensions < 0 || noOfExtensions > 99)	){
        			errorService.fundingRequest.addError(frn, null, null, 'noOfExtensions',
   					     errorService.fundingRequest.types.EXTENSIONS_LEFT_INVALID, noOfExtensions);
        		}
        		if( ((totalLength == null) || (totalLength == undefined) || (totalLength == "")) ||
            			(isNaN(totalLength)) || 
            			(totalLength < 1 || totalLength > 99)	){
        			errorService.fundingRequest.addError(frn, null, null, 'totalLength',
   					     errorService.fundingRequest.types.REMAINING_LENGTH_INVALID, totalLength);
            	}
        	}
        	else if( (hasExtensions == null) || (hasExtensions == undefined) || (hasExtensions === "") ){
        		if(keyInformation.purchaseType == 'CONTRACT'){
	        		errorService.fundingRequest.addError(frn, null, null, 'hasExtensions',
	  					     errorService.fundingRequest.types.EXTENSION_MISSING, null);
        		}
        	}
        };
        
        //Validate Master Contract
        this.validateMaster = function(frn, keyInformation){
        	errorService.fundingRequest.removeError(frn, null, null, 'masterContract');
        	
        	var masterContract = keyInformation.masterContract;
        	if( (masterContract == null) || (masterContract == undefined) || (masterContract === "")){
        		if(keyInformation.purchaseType == 'CONTRACT'){
        			errorService.fundingRequest.addError(frn, null, null, 'masterContract',
    					     errorService.fundingRequest.types.MASTERCONTRACT_MISSING, null);
        		}
        	}
        };
        
        //validate Continued Funding Request
        this.validateContinuedFRN = function(frn, keyInformation, scope){
        	errorService.fundingRequest.removeError(frn, null, null, 'isContinuedFundingRequest');
        	errorService.fundingRequest.removeError(frn, null, null, 'continuedFundingRequestNumber');
        	
        	var isContinuedFundingRequest = keyInformation.isContinuedFundingRequest;
        	var continuedFundingRequestNumber = keyInformation.continuedFundingRequestNumber;
        	if(isContinuedFundingRequest){
        		if( (continuedFundingRequestNumber == null) || (continuedFundingRequestNumber == undefined) || (continuedFundingRequestNumber == "") ){
        			errorService.fundingRequest.addError(frn, null, null, 'continuedFundingRequestNumber',
    					     errorService.fundingRequest.types.CONTINUED_FRN_MISSING, null);
        		}
        		else if(isNaN(continuedFundingRequestNumber)){
        			errorService.fundingRequest.addError(frn, null, null, 'continuedFundingRequestNumber',
   					     errorService.fundingRequest.types.CONTINUED_FRN_INVALID, continuedFundingRequestNumber);
        		}
        		else{
        			restService.modifyRestService.getFundingRequestLimitedDetail(continuedFundingRequestNumber, scope.version).then(
	    					function (fundingRequest) {
	                        	if(fundingRequest == null){
	                        		errorService.fundingRequest.addError(frn, null, null, 'continuedFundingRequestNumber',
												 errorService.fundingRequest.types.CONTINUED_FRN_NOT_FOUND, continuedFundingRequestNumber);
	                        	}
	                        },
	                        function (httpErrorCode) {
	                        	errorService.fundingRequest.addError(frn, null, null, 'continuedFundingRequestNumber',
										     errorService.fundingRequest.types.CONTINUED_FRN_NOT_FOUND, continuedFundingRequestNumber);
	                        });
        		}
        	}
        	else if( (isContinuedFundingRequest == null) || (isContinuedFundingRequest == undefined) || (isContinuedFundingRequest === "") ){
	        		if(keyInformation.purchaseType == 'CONTRACT'){
	        			errorService.fundingRequest.addError(frn, null, null, 'isContinuedFundingRequest',
							     errorService.fundingRequest.types.IS_CONTINUED_FRN_MISSING, null);
	        		}
        	}
        };
        
        this.validateRestriction = function(frn, keyInformation){
        	errorService.fundingRequest.removeError(frn, null, null, 'hasRestrictions');
        	errorService.fundingRequest.removeError(frn, null, null, 'restrictionType');
        	errorService.fundingRequest.removeError(frn, null, null, 'restrictionCitation');
        	
        	var hasRestrictions = keyInformation.hasRestrictions
        	
        	if(hasRestrictions){
        		var restrictionType = keyInformation.restrictionType;
        		var restrictionCitation = keyInformation.restrictionCitation;
        		
        		if( (restrictionType == null) || (restrictionType == undefined) || (restrictionType === "") ){
        			errorService.fundingRequest.addError(frn, null, null, 'restrictionType',
    					     errorService.fundingRequest.types.RESTRICTION_TYPE_MISSING, null);
        		}
        		else if( (restrictionCitation == null) || (restrictionCitation == undefined) || (restrictionCitation === "") ){
        			errorService.fundingRequest.addError(frn, null, null, 'restrictionCitation',
   					     errorService.fundingRequest.types.RESTRICTION_CITATION_MISSING, null);
        		}
        	}
        	else if( (hasRestrictions == null) || (hasRestrictions == undefined) || (hasRestrictions === "") ){
        		errorService.fundingRequest.addError(frn, null, null, 'hasRestrictions',
 					     errorService.fundingRequest.types.RESTRICTIONS_MISSING, null);
        	}
        };
        
        
});
