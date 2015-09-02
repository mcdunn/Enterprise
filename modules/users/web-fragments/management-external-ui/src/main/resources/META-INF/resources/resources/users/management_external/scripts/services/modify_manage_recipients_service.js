'use strict';

angular
    .module('manageRecipientsService', ['restService','moPagination'])
    .service('manageRecipientsService',
        function manageRecipientsService(restService,moPaginationService,$timeout) {
    	
    		var manageRecipientsService = this;  
    		
    		this.retrieveBlock4Entities = function (applicationNumber,scope) {
                restService.modifyRestService.retrieveBlock4Entities(applicationNumber, scope.version).then(
                        function (entities) {        
                            scope.block4Entities = entities;
                            scope.block4EntitiesMap = {};
                        	for(var i=0; i < scope.block4Entities.block4Entities.length; i++){
                        		scope.block4EntitiesMap[scope.block4Entities.block4Entities[i].entityNumber.toString()] = 
                        			scope.block4Entities.block4Entities[i];
                        	}
                        },
                        function (httpErrorCode) {
                            scope.block4Entities = null;
                            scope.block4EntitiesMap = null;
                        }
                    );

	        }; 
	        
            this.populateSelectedUnselectedBlock4EntitiesMapsForItem21 = function(scope){
            	
            	if(scope.block4Entities === 'undefined' || scope.block4Entities === null || !scope.block4Entities){
            		return;
            	}
            	
            	scope.unselectedBlock4EntitiesMap = {};
            	scope.selectedBlock4EntitiesMap = {};
            	scope.numberOfSelectedAtTheBegining = 0;
            	var block4EntitiesLength = scope.block4Entities.block4Entities.length;
            	for(var i=0; i< block4EntitiesLength;i++){
            		var searchBENKey = scope.block4Entities.block4Entities[i].entityNumber.toString();
            		var foundRecipient = scope.item21BeingEdited.entityMap[searchBENKey];
            		var entityToAddToList = scope.block4Entities.block4Entities[i];
            		if(typeof foundRecipient === 'undefined' || foundRecipient === null || !foundRecipient){
						scope.unselectedBlock4EntitiesMap[entityToAddToList.entityNumber.toString()] = entityToAddToList;
					}
            		else{ 
            			if(scope.item21BeingEdited.removedEntityMap[searchBENKey]){
    						scope.unselectedBlock4EntitiesMap[entityToAddToList.entityNumber.toString()] = entityToAddToList;
            			}
						if(typeof scope.item21BeingEdited.removedEntityMap[searchBENKey] === 'undefined' || 
								scope.item21BeingEdited.removedEntityMap[searchBENKey] === null || 
											!scope.item21BeingEdited.removedEntityMap[searchBENKey]){
				
								scope.selectedBlock4EntitiesMap[entityToAddToList.entityNumber.toString()] = entityToAddToList;
								++scope.numberOfSelectedAtTheBegining;
						}
            		}
            	}
            };
            
            this.indexOfRecipientFoundInItem21EntitiesList = function(entityNumber,scope){
            	var indexFound = -1;
            	var entitiesLength = scope.item21BeingEdited.entities.length;
            	for(var i=0;i<entitiesLength;i++){
            		if(scope.item21BeingEdited.entities[i].entityNumber === entityNumber){
            			indexFound = i;
            			break;
            		}
            	}
            	return indexFound;
            };
            
            this.addRecipientToItem21 = function(recipientToAdd,scope){
            	if(typeof scope.item21BeingEdited.addedEntityMap[recipientToAdd.entityNumber.toString()] === 'undefined' || 
            			scope.item21BeingEdited.addedEntityMap[recipientToAdd.entityNumber.toString()] === null ){
            			
            		if(typeof scope.item21BeingEdited.entityMap[recipientToAdd.entityNumber.toString()] === 'undefined' ||
            						scope.item21BeingEdited.entityMap[recipientToAdd.entityNumber.toString()] === null ){
            			if (typeof scope.item21BeingEdited.entities === 'undefined' || scope.item21BeingEdited.entities === null ) {
            				scope.item21BeingEdited.entities = [];
            			}
            			recipientToAdd.index = scope.item21BeingEdited.entities.length;
            			
		            	scope.item21BeingEdited.entityMap[recipientToAdd.entityNumber.toString()] = recipientToAdd;
		            	scope.item21BeingEdited.addedEntityMap[recipientToAdd.entityNumber.toString()] = recipientToAdd;
		            	
		            	var indexFound = manageRecipientsService.indexOfRecipientFoundInItem21EntitiesList(recipientToAdd.entityNumber,scope);
            			if(indexFound >= 0){
            				scope.item21BeingEdited.entities[indexFound].costAllocationAmt = 0;
            				scope.item21BeingEdited.entities[indexFound].quantity = 0;
            			}
            			else{
            				scope.item21BeingEdited.entities.push(recipientToAdd);
            			}
            			
            			moPaginationService.showRow("modify_item21_"+scope.item21BeingEdited.index+"_recipients",recipientToAdd.index);

            		}

            	}
            	if(typeof scope.item21BeingEdited.removedEntityMap[recipientToAdd.entityNumber.toString()] !== 'undefined' &&
            			scope.item21BeingEdited.removedEntityMap[recipientToAdd.entityNumber.toString()] !== null ){
            		
            		delete scope.item21BeingEdited.removedEntityMap[recipientToAdd.entityNumber.toString()];
            	}
            };
            
            this.removeRecipientFromItem21 = function(recipientToRemove,scope){
            	scope.item21BeingEdited.removedEntityMap[recipientToRemove.entityNumber.toString()] = recipientToRemove;
            };
            
            this.addRecipientToList = function(entityNumber,scope){
            	var recipientToAdd = angular.copy(scope.block4EntitiesMap[entityNumber.toString()]);
            	recipientToAdd.costAllocationAmt = 0;
            	recipientToAdd.quantity = scope.item21BeingEdited.lastMile ? 1 : null;
            	scope.selectedBlock4EntitiesMap[recipientToAdd.entityNumber.toString()] = angular.copy(recipientToAdd);
            	delete scope.unselectedBlock4EntitiesMap[recipientToAdd.entityNumber.toString()];
            };
            
            this.removeRecipientFromList = function(entityNumber,scope){
            	var recipientToRemove = scope.selectedBlock4EntitiesMap[entityNumber.toString()];
            	scope.unselectedBlock4EntitiesMap[entityNumber.toString()] = angular.copy(recipientToRemove);
            	delete scope.selectedBlock4EntitiesMap[entityNumber.toString()];
            };
            
            this.addAllUnselectedEntities = function(scope){
            	var entityNumber;
            	for (entityNumber in scope.unselectedBlock4EntitiesMap) {
            		manageRecipientsService.addRecipientToList(entityNumber,scope);
            	}
            };
            
            this.removeAllSelectedEntites = function(scope){
            	var entityNumber;
              	for (entityNumber in scope.selectedBlock4EntitiesMap) {
              		manageRecipientsService.removeRecipientFromList(entityNumber,scope);
            	}
            };
            
            this.setCostsSharedEquallyProperty = function(scope){
            	scope.item21BeingEdited.costsSharedEqually = false;
            	if(scope.item21BeingEdited.costSharingMethod === 'SCHOOL' || 
            					scope.item21BeingEdited.costSharingMethod === 'STUDENT'){
            		
            		scope.item21BeingEdited.costsSharedEqually = true;
            	}
            };
            
            this.noCostSharing = function(scope){
            	scope.item21BeingEdited.costsSharedEqually = false;
            	scope.item21BeingEdited.costSharingMethod  = null;
            	var entitiesLength = scope.item21BeingEdited.entities.length;
            	var entityIndexToClick = -1;
            	for(var i = 0;i<entitiesLength;++i){
            		var entityNumber = scope.item21BeingEdited.entities[i].entityNumber;
            		if(!scope.item21BeingEdited.removedEntityMap[entityNumber.toString()]){
            			entityIndexToClick = i;
            			break;
            		}
            	}
            	if(entityIndexToClick >= 0){
                	moPaginationService.showRow("modify_item21_"+scope.item21BeingEdited.index+"_recipients",entityIndexToClick);
                    $timeout(function() {
                    	var id = "fr_" + scope.item21BeingEdited.index + "_" 
                    			+ entityIndexToClick + "_costAllocationAmt";
                        $("#" + id).trigger("click");
                    }, 100);
            	}

            };
            
            this.setAllEntitiesReceivingProductOrServiceProperty = function(scope){
            	scope.item21BeingEdited.allEntitiesReceivingProductOrService = false;
            	if(scope.numberOfSelectedAtTheBegining === scope.block4Entities.block4Entities.length){
            		scope.item21BeingEdited.allEntitiesReceivingProductOrService = true;
            	}
            };
            
            this.applyChangesToRecipients = function(scope){
            	var entityNumber;            	
            	for (entityNumber in scope.unselectedBlock4EntitiesMap) {
            		manageRecipientsService.removeRecipientFromItem21(scope.unselectedBlock4EntitiesMap[entityNumber],scope);
            	}
              	for (entityNumber in scope.selectedBlock4EntitiesMap) {
              		manageRecipientsService.addRecipientToItem21(scope.selectedBlock4EntitiesMap[entityNumber],scope);
            	}
              	if(scope.application.discountCalculation.fundingRequestCategory === '2' && !scope.item21BeingEdited.costsSharedEqually){
              		manageRecipientsService.noCostSharing(scope);
              		var entityNumber;
              		var allocated = 0;
              		
              		// the only thing you need the for loop for is the value of allocated. nothing else needs iteration here.
              		// extended cost doesn't change. the only value that matters for remaining is the final value.
                	for (entityNumber in scope.item21BeingEdited.entityMap) {
                			var extendedCost = scope.item21BeingEdited.extendedCost; // why set this repeatedly in a for loop??
                			if(!scope.item21BeingEdited.removedEntityMap[entityNumber.toString()]){
                    			allocated = parseFloat(allocated) + parseFloat(scope.item21BeingEdited.entityMap[entityNumber].costAllocationAmt);
                			}
                			var remaining = parseFloat(extendedCost) - parseFloat(allocated); // why set this repeatedly in a for loop??
                        	scope.item21BeingEdited.remaining = remaining.toFixed(2); // why set this repeatedly in a for loop??
                	}
              	}
              	if(scope.application.discountCalculation.fundingRequestCategory === '2' && scope.item21BeingEdited.costsSharedEqually ){
              		manageRecipientsService.divideEqually(scope);
              	}
              	
              	//For Cat-1 recalculation if LastMile = YES
              	if(scope.item21BeingEdited.lastMile){
              		this.handleLinesChange(scope);
              	}
              	
              	//Recalculate entity count
              	scope.item21BeingEdited.entityCount = Object.keys(scope.selectedBlock4EntitiesMap).length;
            };
	        
            
            this.divideEqually = function(scope) {
            	var item21 = scope.item21BeingEdited; 
            	if(scope.application.discountCalculation.fundingRequestCategory === '2'){
            		//Divide equally to each school
            		if(item21.costSharingMethod === 'SCHOOL'){
            			var selectedSchoolCount = Object.keys(scope.selectedBlock4EntitiesMap).length;
            			var equallyAllocateAmt = Number((item21.extendedCost/selectedSchoolCount).toString().match(/^\d+(?:\.\d{0,2})?/));
            			var remainingCents = Number((item21.extendedCost*100).toFixed(2)) - Number(equallyAllocateAmt*100*selectedSchoolCount);
            			
            			for(var i=0 ; i<item21.entities.length; i++) {
            				var entityNumber = item21.entities[i].entityNumber;
            				if(!item21.removedEntityMap[entityNumber]){
            					var allocatedAmt = 0;
            					if(remainingCents > 0){
            						allocatedAmt = (equallyAllocateAmt + 0.01).toFixed(2);
            						remainingCents--;
            					}
            					else{
            						allocatedAmt = equallyAllocateAmt;
            					}
            					item21.entities[i].costAllocationAmt = allocatedAmt;
            					//Update the entity costAllocationAmt in item21.entityMap.
            					if(item21.entityMap[entityNumber]){
            						item21.entityMap[entityNumber].costAllocationAmt = allocatedAmt;
            					}
            				}
                    	}
            		}
            		
            		//Divided by student counts for each entity
            		if(item21.costSharingMethod === 'STUDENT'){
            			var totalStudentCount = 0;
            			
            			//calculate each student shared cost.
            			for(var i=0 ; i < scope.block4Entities.block4Entities.length; i++){
            				var entityNum = scope.block4Entities.block4Entities[i].entityNumber;
            				
            				if(item21.entityMap[entityNum] && !item21.removedEntityMap[entityNum]){
            					totalStudentCount += scope.block4Entities.block4Entities[i].fullOrPartTimeStudentCount;
            				}
            			}
            			var eachStudentSharedAmt = parseInt(item21.extendedCost) / totalStudentCount;
            			
            			//calculate shared amount for each selected entity
            			for(var i=0 ; i < scope.block4Entities.block4Entities.length; i++){
            				var block4Entity = scope.block4Entities.block4Entities[i];
            				var entityNum = block4Entity.entityNumber;
            				var studentCount = block4Entity.fullOrPartTimeStudentCount;
            				var allocatedAmt = 0;
            				
            				for(var j=0 ; j<item21.entities.length ; j++){
            					var entity = item21.entities[j];
            					if(entity.entityNumber === entityNum){
            						if(item21.entityMap[entityNum] && !item21.removedEntityMap[entityNum]){
            							allocatedAmt = (eachStudentSharedAmt * studentCount).toFixed(2);
            							
            							entity.costAllocationAmt = allocatedAmt;
                    					item21.entityMap[entityNum].costAllocationAmt = allocatedAmt;
                    				}
            					}
            				}
            				
            			}
            		}
            		
            		var remaining = 0;
            		item21.remaining = remaining.toFixed(2);
            	}            	
            };
            
            this.handleLinesChange = function(scope){
            	var item21 = scope.item21BeingEdited;
            	var entities = Object.keys(item21.entityMap);
            	var allocatedLines = 0;
            	for(var j=0; j<item21.entities.length; j++){
            		for(var i=0; i<entities.length; i++){
                		if(entities[i] == item21.entities[j].entityNumber){
                			if(!item21.removedEntityMap[entities[i]]){
                				//Default the lines to 1 when last miles is YES
                    			if(item21.lastMile && item21.entities[j].quantity == null){
                    				item21.entities[j].quantity = 1;
                    			}
                    			
                    			var quantity = null;
                    			if( item21.entities[j].quantity == '' || isNaN(item21.entities[j].quantity) ){
                    				quantity = 0;
                    			}
                    			else quantity = item21.entities[j].quantity;
                    			allocatedLines = parseInt(allocatedLines) + parseInt(quantity);
                			}
                		}
                		
                	}
            	}
            	
            	item21.remaining = item21.lines - allocatedLines;
            };
            
        }
    );
