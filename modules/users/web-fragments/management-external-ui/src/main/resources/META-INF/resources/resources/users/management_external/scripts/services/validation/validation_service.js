'use strict';

/**
 * @ngdoc service
 * @name validationService
 * @description
 * # validationService
 * Validation Service for Form 471 Internal Modify Tool
 */
angular
    .module('validationService', ['basicInformationValidationService', 'discountCalculationValidationService', 'fundingRequestsValidationService',
            'fundingRequestValidationService'])
    .service('validationService',
        function restService(basicInformationValidationService, discountCalculationValidationService, fundingRequestsValidationService,
                             fundingRequestValidationService) {
    		this.basicInformation = basicInformationValidationService;
            this.discountCalculation = discountCalculationValidationService;
            this.fundingRequests = fundingRequestsValidationService;
            this.fundingRequest = fundingRequestValidationService;
        }
    );