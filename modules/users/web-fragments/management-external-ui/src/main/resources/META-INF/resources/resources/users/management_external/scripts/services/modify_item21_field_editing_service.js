'use strict';

angular
    .module('item21FieldEditingService', ['restService'])
    .service('item21FieldEditingService',
        function item21FieldEditingService(restService) {
    	
    		var item21FieldEditingService = this;  
    		
    		this.makeLookup = function(scope){
                restService.modifyRestService.makeLookup().then(
                        function (makes) {
                        	scope.allMakes =  makes;
                        },
                        function (httpErrorCode) {
                        	scope.allMakes = null;
                        }
                    );
    		}; 
    		
            this.lookupFunctionTypes = function(scope){
            	if(scope.allFunctionTypes === null || typeof scope.allFunctionTypes === 'undefined' || !scope.allFunctionTypes){
                    restService.modifyRestService.lookupFunctionTypes(2015).then(
                            function (functionTypes) {                            	
                            	scope.allFunctionTypes =  functionTypes;
                            },
                            function (httpErrorCode) {
                            	scope.allFunctionTypes = null;
                            }
                        );
            	}
            };
            
            this.getFunctionTypes = function (scope) {
            	
                var serviceType = _.findWhere(scope.allFunctionTypes.services, {serviceType:scope.fundingRequest.keyInformation.serviceType });

                if (serviceType) {
                    scope.selectValues.services = serviceType.functions;
                } else {
                    scope.selectValues.services = [];
                }

                if (scope.allFunctionTypes.mibsTypes) {
                    scope.selectValues.typeOfManagedService = scope.allFunctionTypes.mibsTypes;
                } else {
                    scope.selectValues.typeOfManagedService = [];
                }
            };
            
            this.updateDropDownsForLineItemBeingEdited = function(scope) {

                
                // Check if the service is voice only
              if (scope.item21BeingEdited.functionType != null && scope.fundingRequest.keyInformation.serviceType !== 'INTERNAL CONNECTIONS MIBS') {

                    // get the viable product types based on function type
                    scope.selectValues.typeOfConnection = _.findWhere(scope.selectValues.services, {functionType: scope.item21BeingEdited.functionType}).productTypes;

                    // voice service-specific updates
                    if (scope.item21BeingEdited.functionType === 'Voice Service') {
                        scope.selectValues.purpose = item21FieldEditingService.selectValues.voicePurpose;
                    } else {
                        scope.selectValues.purpose = item21FieldEditingService.selectValues.purpose;
                    }

                }

                // adjust the product drop-down
                if (scope.item21BeingEdited.functionType && scope.fundingRequest.keyInformation.serviceType !== 'INTERNAL CONNECTIONS MIBS') {
                    scope.selectValues.typeOfProduct = _.findWhere(scope.selectValues.services, {functionType: scope.item21BeingEdited.functionType}).productTypes;
                }

                // Check if the bandwidth speeds are predetermined
                    var newSpeeds = item21FieldEditingService.lookupPreDefinedSpeeds(scope.item21BeingEdited.productType);

                    scope.fixedUpload = newSpeeds.fixedUpload;
                    scope.fixedDownload = newSpeeds.fixedDownload;

                    if(newSpeeds.fixedUpload || newSpeeds.fixedDownload){
                        scope.item21BeingEdited.uploadSpeed = newSpeeds.uploadSpeed;
                        scope.item21BeingEdited.downloadSpeed = newSpeeds.downloadSpeed;
                        scope.item21BeingEdited.uploadUnits = newSpeeds.uploadUnits;
                        scope.item21BeingEdited.downloadUnits = newSpeeds.downloadUnits;
                        return;
                    }

            };
            
            this.onIsBurstBandwidth = function(scope){
            	  if(!scope.item21BeingEdited.isBurstBandwidth){
            		  scope.item21BeingEdited.burstSpeed = null;
            		  scope.item21BeingEdited.burstUnits = null;
            	  }
            }
            
           this.applyMakeName = function(scope){
                var make = _.findWhere(scope.allMakes.makes, {id: scope.item21BeingEdited.makeId});

                if (make) {
                    scope.item21BeingEdited.make = make.desc;
                }
            }

            this.lookupPreDefinedSpeeds = function(productType){
                var fixedUpload = false;
                var fixedDownload = false;
                var uploadSpeed = null;
                var downloadSpeed = null;
                var uploadUnits = null;
                var downloadUnits = null;
                  
                  if (productType == 'ISDN - PRI') {
                      fixedUpload = true;
                      fixedDownload = true;
                      uploadSpeed = 1.544;
                      downloadSpeed = 1.544;
                      uploadUnits = 'Mbps';
                      downloadUnits = 'Mbps';
                  } else if (productType == 'DS-1 (T-1)' || productType == 'T-1') {
                      fixedUpload = true;
                      fixedDownload = true;
                      uploadSpeed = 1.5;
                      downloadSpeed = 1.5;
                      uploadUnits = 'Mbps';
                      downloadUnits = 'Mbps';
                  } else if (productType == 'DS-3 (T-3)' || productType == 'T-3') {
                      fixedUpload = true;
                      fixedDownload = true;
                      uploadSpeed = 45;
                      downloadSpeed = 45;
                      uploadUnits = 'Mbps';
                      downloadUnits = 'Mbps';
                  } else if (productType == 'ISDN - BRI') {
                      fixedUpload = true;
                      fixedDownload = true;
                      uploadSpeed = 128;
                      downloadSpeed = 128;
                      uploadUnits = 'Kbps';
                      downloadUnits = 'Kbps';
                  } else if (productType == 'OC-1') {
                      fixedDownload = true;
                      uploadSpeed = 52;
                      downloadSpeed = 52;
                      uploadUnits = 'Mbps';
                      downloadUnits = 'Mbps';
                  } else if (productType == 'OC-3') {
                      fixedDownload = true;
                      uploadSpeed = 155.5;
                      downloadSpeed = 155.5;
                      uploadUnits = 'Mbps';
                      downloadUnits = 'Mbps';
                  } else if (productType == 'OC-12') {
                      fixedDownload = true;
                      uploadSpeed = 622;
                      downloadSpeed = 622;
                      uploadUnits = 'Mbps';
                      downloadUnits = 'Mbps';
                  } else if (productType == 'OC-24') {
                      fixedDownload = true;
                      uploadSpeed = 1.244;
                      downloadSpeed = 1.244;
                      uploadUnits = 'Gbps';
                      downloadUnits = 'Gbps';
                  }
                  return {
                      fixedUpload:fixedUpload,
                      fixedDownload:fixedDownload,
                      uploadSpeed:uploadSpeed,
                      downloadSpeed:downloadSpeed,
                      uploadUnits:uploadUnits,
                      downloadUnits:downloadUnits,
                  }
              };
            
            this.selectValues = {
                    typeOfService: [
                        'Digital Transmission Service', 'Voice Service', 'Wireless Data Service',
                        'Miscellaneous'
                    ],

                    typeOfConnection: [],
                    voiceTypeOfConnection: [],
                    typeOfInternalConnection: [],
                    typeOfProduct: [],
                    purpose: [
                        'Transport', 'Internet', 'Transport and Internet'
                    ],
                    voicePurpose: [
                        'Voice'
                    ],
                    speedUnits: [
                        'Mbps', 'Gbps'
                    ],
                    boolean: [
                        {text: 'Yes', value: true},
                        {text: 'No', value: false}
                    ],
                    quantityUnit: [
                        'Each', 'Dozen', 'Foot', 'Hundred Feet', 'Hours'
                    ],
                    equipmentMake: [],
                    services: []
                };
        }
    );