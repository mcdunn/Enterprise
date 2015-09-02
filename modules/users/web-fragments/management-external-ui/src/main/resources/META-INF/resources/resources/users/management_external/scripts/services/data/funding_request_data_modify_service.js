'use strict';

angular
    .module('fundingRequestDataModifyService', [])
    .service('fundingRequestDataModifyService',
    function dataModifyService($q, $timeout,lookupService,restService) {

        var dataModifyService = this;

        //this function convert "MM/dd/yyyy" to "yyyy-MM-dd" for calendar datepicker reason
        this.convert=function(date){
            if (date!= undefined)
        	{var newDate=date.split("/");
            //.reverse().join("-");
            return newDate[2]+"-"+newDate[0]+"-"+newDate[1];
            }};
            
            //this function convert "yyyy-MM-dd" back to "MM/dd/yyyy" for calendar datepicker reason
            this.convertBack=function(date){
                if (date!=undefined)
            	{
            	var newDate=date.split("-");
                return newDate[1]+"/"+newDate[2]+"/"+newDate[0];
                }};
        
        this.load = function(application, scope) {
            if (!application.addedFundingRequestMap) {
                application.addedFundingRequestMap = {};
            }
            if(typeof scope.fundingRequestNewlyAdded !== undefined && scope.fundingRequestNewlyAdded){
            	scope.fundingRequest = processRetrievedFundingRequest(scope.application.fundingRequests[scope.addedFundingRequestIndexToModify]);
            	scope.fundingRequestReady = true;
            	return;
            }
            if (!application.removedFundingRequestMap) {
                application.removedFundingRequestMap = {};
            }
            this.waitForData(application, scope);
        };
        
        this.waitForData = function(application, scope) {
            waitForData(application, scope).then(
                function (fundingRequest) {
                	scope.fundingRequest = processRetrievedFundingRequest(fundingRequest);
	                scope.fundingRequestReady = true;
	            	//return processRetrievedFundingRequest(fundingRequest);
	                dataModifyService.waitForWindow(application,scope);
                },
                function () {
                    dataModifyService.waitForData(application, scope);
                }
            );
        };

        var waitForData = function(application, scope) {
            var deferred = $q.defer();
            $timeout(
                function() {
                    var fundingRequest = application.fundingRequestMap[scope.fundingRequestNumber];
                    if (fundingRequest && fundingRequest.keyInformationRetrieved && fundingRequest.item21sRetrieved) {
                    	deferred.resolve(fundingRequest);
                    }
                    else {
                        deferred.reject();
                    }
                }, 500, false
            );
            return deferred.promise;
        };
        
        this.waitForWindow = function(application,scope) {
        	restService.modifyRestService.getWindowStatus().then(
                function (windowStatus) {
                	   
                       _.each(scope.fundingRequest.category2ServiceTypes,function(category){
                           category.serviceStartDate = new Date(windowStatus.fundingYear, category.startMonth, 1);
                           //fundingRequest[category.scopeName] = category;
                       });
                       
                       _.each(scope.fundingRequest.category1ServiceTypes,function(category){
                           category.serviceStartDate = new Date(windowStatus.fundingYear, category.startMonth, 1);
                           //fundingRequest[category.scopeName] = category;
                       });
                       
                       if (application.discountCalculation.fundingRequestCategory === '2')
                       {
                    	   scope.fundingRequest.keyInformation.categoryOfService=_.findWhere(scope.fundingRequest.category2ServiceTypes, {value: scope.fundingRequest.keyInformation.serviceType});
                       }
                       if (application.discountCalculation.fundingRequestCategory === '1')
                	   {
                    	   scope.fundingRequest.keyInformation.categoryOfService=_.findWhere(scope.fundingRequest.category1ServiceTypes, {value: scope.fundingRequest.keyInformation.serviceType});
                	   }
                       scope.fundingRequest.serviceEndDate = new Date(windowStatus.fundingYear + 1, 5, 30); // June 30th of next year
                       scope.fundingRequest.minDate = new Date(1990,0,1);//earliest allowable date:1/1/1990 
                       scope.fundingRequest.maxDate = new Date(2199,11,31);//latest allowable date:12/31/2199 to allow for 100 year contracts
                       scope.fundingRequest.july1stDate=new Date(windowStatus.fundingYear+0, 6, 1);
                       scope.fundingYear=windowStatus.fundingYear;
                       //scope.fundingRequest.keyInformation.startServiceDT=dataModifyService.convert(scope.fundingRequest.keyInformation.startService);
                       //scope.fundingRequest.keyInformation.startService=dataModifyService.convert(scope.fundingRequest.keyInformation.startService);
                },
                function () {
                    //dataModifyService.waitForWindow(application,scope);
                }
            );
        };
        
        var processRetrievedFundingRequest = function(fundingRequest) {
            fundingRequest.addedItem21Map = {};
            fundingRequest.removedItem21Map = {};
            fundingRequest.keyInformationExpanded = true;
            fundingRequest.keyInformation.BANs = null;
            fundingRequest.item21sExpanded = true;
            
            processKeyInfo(fundingRequest);
            
            //Process Item21s & recipients
            var processedItem21s = [];
            var category = (fundingRequest.keyInformation.serviceType == 'INTERNAL CONNECTIONS'
            				|| fundingRequest.keyInformation.serviceType == 'INTERNAL CONNECTIONS MNT'
            				|| fundingRequest.keyInformation.serviceType == 'INTERNAL CONNECTIONS MIBS') ? 2 : 1;
            
            for (var i = 0; i < fundingRequest.item21s.length; i++) {
                var item21 = fundingRequest.item21s[i];
                if(category == 1 && item21.lastMile){
                	var remaining = item21.lines;
                }else{
                	var remaining = item21.extendedCost;
                }
                if (fundingRequest.item21Map[item21.frnLineItemNumber]) {
                    item21.addedEntityMap = {};
                    item21.removedEntityMap = {};
                    if (fundingRequest.item21s[i].entities) {
                        var processedRecipients = [];
                        for (var j = 0; j < fundingRequest.item21s[i].entities.length; j++) {
                            var recipient = fundingRequest.item21s[i].entities[j];
                            if (item21.entityMap[recipient.entityNumber]) {
                            	processedRecipients.push(recipient);
                                if(category == 1 && item21.lastMile){
                                	remaining = remaining - recipient.quantity;
                                }else{
                                	remaining = (remaining*100 - recipient.costAllocationAmt*100)/100;
                                }
                            }
                        }
                        item21.entities = processedRecipients;
                        item21.entityCount = Object.keys(item21.entityMap).length;
                    }
                    if(category == 2){
                    	remaining = remaining.toFixed(2);
                    }
                    if(category == 1){
                    	var burstSpeed = item21.burstSpeed;
                    	item21.isBurstBandwidth = (burstSpeed != null && typeof burstSpeed !== 'undefined');
                    }
                    item21.remaining = remaining;
                    processedItem21s.push(item21);
                }
            }
            fundingRequest.item21s = processedItem21s;
            fundingRequest.category1ServiceTypes=lookupService.getCategory1ServiceTypes();
            fundingRequest.category2ServiceTypes=lookupService.getCategory2ServiceTypes();
            fundingRequest.retrieved = true;
            return angular.copy(fundingRequest);
        };

        this.cleanupFundingRequestForSave = function (fundingRequest) {
        	var copyFundingRequest = angular.copy(fundingRequest);
            var cleanedFR = {};

            cleanKeyInformation(copyFundingRequest);
            
            // Build a list of cleaned item21s
            var item21s = copyFundingRequest.item21s;
            var cleanedItem21s = [];
            for (var i = 0; i < item21s.length; i++) {
                // Remove deleted item21s, cleanup ones to save
                var item21 = item21s[i];
                if (!copyFundingRequest.removedItem21Map[i]) {
                    cleanupItem21(item21);
                    /*if(copyFundingRequest.addedItem21Map[i]){
                    	delete item21.frnLineItemNumber;
                    }*/
                    cleanedItem21s[cleanedItem21s.length] = item21;
                }
            }
            
            cleanedFR.item21s = cleanedItem21s;
            cleanedFR.keyInformation = copyFundingRequest.keyInformation;
            
            return cleanedFR;
        };
        
        
//        this.cleanupFundingRequestDatesForSave=function(fundingRequest)
//        {
        	//fundingRequest.keyInformation.startService=dataModifyService.convertBack(fundingRequest.keyInformation.startServiceDT);	
        	
        	
//        	return fundingRequest;
//        };
        
        
        var cleanKeyInformation = function (fundingRequest){
        	if(fundingRequest.keyInformation.duplicateFundingRequestNumber == null ||
        			fundingRequest.keyInformation.duplicateFundingRequestNumber == ''){
        		delete fundingRequest.keyInformation.duplicateFundingRequestNumber;
        	}
        	
        	if(fundingRequest.keyInformation.isIAExempt470){
        		if(fundingRequest.keyInformation.isBusinessIA){
        			fundingRequest.keyInformation.exempt470Reason = 'INTERNET_ACCESS';
        			fundingRequest.keyInformation.form470Number = null;
        		}
        	}
        	else if( (fundingRequest.keyInformation.form470Number != undefined)
                  	 || (fundingRequest.keyInformation.form470Number != null) ){
        		fundingRequest.keyInformation.exempt470Reason = null;
        	}
        	
        	if(!fundingRequest.keyInformation.hasExtensions){
        		fundingRequest.keyInformation.noOfExtensions = null;
        		fundingRequest.keyInformation.totalLength = null;
    		}
        	
        	if(!fundingRequest.keyInformation.isContinuedFundingRequest){
        		fundingRequest.keyInformation.continuedFundingRequestNumber = null;
    		}
        	
        	if(!fundingRequest.keyInformation.hasRestrictions){
        		fundingRequest.keyInformation.restrictionType = null;
        		fundingRequest.keyInformation.restrictionCitation = null;
    		}
        	
        	if(fundingRequest.keyInformation.purchaseType === 'CONTRACT'){
        		delete fundingRequest.keyInformation.endService;
        	}
        	else{
        		delete fundingRequest.keyInformation.endContract;
        	}
        }

        var cleanupItem21 = function(item21) {
            // Build a list of cleaned entities
            var cleanedEntities = [];
            
            var entityMap = item21.entityMap;
            var entityNums = Object.keys(entityMap);
            for (var i = 0; i < entityNums.length; i++) {
            	var entityNum = entityNums[i];
            	var entity = entityMap[entityNum];
                // Removed deleted entities, cleanup ones to keep
                if (!item21.removedEntityMap[entityNum]) {
                	cleanupEntity(item21, entity);
                	cleanedEntities[cleanedEntities.length] = entity;
                }
            }

            // Replace the members with the cleaned members
            item21.entities = cleanedEntities;
            
            if(item21.costAllocationAmt != null || item21.costAllocationAmt != undefined){
            	item21.costAllocation = item21.costAllocationAmt;
            	delete item21.costAllocationAmt;
            }
            
            if(typeof item21.isBurstBandwidth !== 'undefined'){
            	delete item21.isBurstBandwidth;
            }
            
            
            
            //TODO: comment it out until the front-end validations are done. 
            /*delete item21.addedEntityMap;
            delete item21.removedEntityMap;
            delete item21.remaining;*/

            //TODO Delete unneeded fields from group
            
        };

        var cleanupEntity = function(item21, entity) {
            //TODO Delete unneeded fields from member
            delete entity.parentBEN;
            delete entity.fullOrPartTimeStudentCount;
            if(typeof item21.lastMile !== 'undefined' && item21.lastMile != null && item21.lastMile == false){
            	entity.quantity = null;
            }
        };
        
        var processKeyInfo = function(fundingRequest){
        	 //Process Key Information
            if( (fundingRequest.keyInformation.form470Number != undefined)
                 || (fundingRequest.keyInformation.form470Number != null)){
                fundingRequest.keyInformation.isIAExempt470 = false;
                fundingRequest.keyInformation.isBusinessIA = false;
            }
            else if(fundingRequest.keyInformation.exempt470Reason == 'INTERNET_ACCESS'){
                fundingRequest.keyInformation.isIAExempt470 = true;
                fundingRequest.keyInformation.isBusinessIA = true;
            }
            
            if(fundingRequest.keyInformation.billingAccountNumber != null){
                var bans = '';
                for(var i=0 ; i<fundingRequest.keyInformation.billingAccountNumber.length ; i++){
                    bans = bans + (i==0 ? '' : ', ') + fundingRequest.keyInformation.billingAccountNumber[i];
                }
                fundingRequest.keyInformation.BANs = bans;
            }
        	
        };

    });