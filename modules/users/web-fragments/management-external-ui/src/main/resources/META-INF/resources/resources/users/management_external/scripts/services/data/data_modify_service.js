'use strict';

/**
 * @ngdoc service
 * @name dataService
 * @description
 * # dataService
 * Data Service for Form 471 Internal Modify Tool
 */
angular
    .module('dataModifyService', ['basicInformationDataModifyService', 'discountCalculationDataModifyService', 'fundingRequestsDataModifyService',
            'fundingRequestDataModifyService'])
    .service('dataModifyService',
        function dataService(basicInformationDataModifyService, discountCalculationDataModifyService, fundingRequestsDataModifyService,
                             fundingRequestDataModifyService) {
    		this.basicInformation = basicInformationDataModifyService;
            this.discountCalculation = discountCalculationDataModifyService;
            this.fundingRequests = fundingRequestsDataModifyService;
            this.fundingRequest = fundingRequestDataModifyService;
        }
    );