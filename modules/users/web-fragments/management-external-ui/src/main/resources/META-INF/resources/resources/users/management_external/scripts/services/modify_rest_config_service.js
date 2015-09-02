'use strict';

angular
    .module('form471ModifyRestConfigService', [])
    .service('form471ModifyRestConfigService',
        function restConfig() {
            var config = {
                billedEntityRetrieve: baseUrl + "billedEntity/{0}/",
                consultantRetrieve: baseUrl + "consultant/{0}/",
                basicInformationSave: baseUrl + "form471/{0}/basicInformation",
                discountCalculationSave: baseUrl + "form471/{0}/discountCalculation",
                //fundingRequestRetrieve:baseUrl + "form471/{0}/modify/internal/fundingRequest/{1}/fundingRequest?version={2}"
                fundingRequestSave: baseUrl +"form471/{0}/fundingRequest/{1}",
                block4EntitiesRetrieval: baseUrl + "form471/{0}/modify/internal/fundingRequest/block4Entities",
                lookupFunctionTypesURL:  baseUrl + "form471/modify/internal/fundingRequest/functionTypeLookup/{0}",
                fundingRequestLimitedDetailRetrieve: baseUrl + "form471//modify/internal/fundingRequest/{0}/limitedDetails",
                serviceProviderLookup : baseUrl + "serviceProvider/{0}",
                windowStatus: baseUrl + "form471/modify/internal/window",
                makeLookupURL:baseUrl + "form471/modify/internal/fundingRequest/makeLookup",
                form470LimitedDetailsLookup : baseUrl + "form471/modify/internal/form470/{0}/limitedDetails",
                fundingRequestSaveNewFRN: baseUrl +"form471/{0}/fundingRequest/saveNew"
            };

            this.getUrlConfiguration = function () {
                return config;
            };
        }
    );

