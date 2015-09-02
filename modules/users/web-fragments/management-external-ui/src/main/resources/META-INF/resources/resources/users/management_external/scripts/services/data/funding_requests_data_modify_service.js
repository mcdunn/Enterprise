'use strict';

angular
    .module('fundingRequestsDataModifyService', [])
    .service('fundingRequestsDataModifyService',
    function dataModifyService($q, $timeout) {

        var dataModifyService = this;

        this.load = function(scope) {
            scope.getFundingRequestsSummary(scope);
            this.waitForData(scope);
        };

        this.waitForData = function(scope) {
            waitForData(scope).then(
                function (fundingRequests) {
                    scope.addedFundingRequestMap = {};
                    scope.removedFundingRequestMap = {};
                    scope.fundingRequests = processRetrievedFundingRequests(fundingRequests);
                    scope.fundingRequestsReady = true;
                },
                function () {
                    dataModifyService.waitForData(scope);
                }
            );
        };

        var waitForData = function(scope) {
            var deferred = $q.defer();
            $timeout(
                function() {
                    var fundingRequest = null;
                    if (scope.fundingRequestsRetrieved) {
                        deferred.resolve(scope.fundingRequests);
                    }
                    else {
                        deferred.reject();
                    }
                }, 500, false
            );
            return deferred.promise;
        };

        var processRetrievedFundingRequests = function(fundingRequests) {
/*            fundingRequest.addedItem21Map = {};
            fundingRequest.removedGroupMap = {};
            fundingRequest.keyInformationExpanded = true;
            fundingRequest.item21sExpanded = true;
            var processedItem21s = [];
            for (var i = 0; i < fundingRequest.item21s.length; i++) {
                var item21 = fundingRequest.item21s[i];
                if (fundingRequest.item21Map[item21.frnLineItemNumber]) {
                    item21.addedEntityMap = {};
                    item21.removedEntityMap = {};
                    if (fundingRequest.item21s[i].entities) {
                        var processedRecipients = [];
                        for (var j = 0; j < fundingRequest.item21s[i].entities.length; j++) {
                            var recipient = fundingRequest.item21s[i].entities[j];
                            if (item21.entityMap[recipient.number]) {
                                processedRecipients.push(recipient);
                            }
                        }
                        item21.entities = processedRecipients;
                    }
                    processedItem21s.push(item21);
                }
            }
            fundingRequest.item21s = processedItem21s;
            fundingRequest.retrieved = true;*/
        	//console.log("\n*****************************************\n" + "Retrieved Funding Requests : \n" + fundingRequests);
        	if (fundingRequests.fullyAllocatedMap) {
        		for (fundingRequest in fundingRequests.results) {
        			fundingRequest.isFullyAllocated = fundingRequests.fullyAllocatedMap[fundingRequest.fundingRequestNumber];
        			console.log("set isFullyAllocated for FRN : " + fundingRequest.fundingRequestNumber + " to value : " + fundingRequest.isFullyAllocated);
        		}
        	}
            return fundingRequests;
        };

        this.cleanupFundingRequestsForSave = function (fundingRequest) {

/*            // Clone the Discount Calculation object so it can be cleaned up safely
            var cleanedDiscountCalculation = angular.copy(discountCalculation);

            // Build a list of cleaned groups
            var groups = cleanedDiscountCalculation.groups;
            var cleanedGroups = [];
            for (var i = 0; i < groups.length; i++) {
                // Remove deleted groups, cleanup ones to save
                var group = groups[i];
                if (!cleanedDiscountCalculation.removedGroupMap[i]) {
                    cleanupGroup(group);
                    cleanedGroups[cleanedGroups.length] = group;
                }
            }

            // Replace the groups with the cleaned groups
            cleanedDiscountCalculation.groups = cleanedGroups;

            // Cleanup the survey
            cleanupSurvey(cleanedDiscountCalculation);

            // Delete unneeded fields from the discount calculation data
            deleteUnneededDiscountCalculationFields(cleanedDiscountCalculation);

            return cleanedDiscountCalculation;*/
        };

/*        var deleteUnneededDiscountCalculationFields = function(discountCalculation) {
            delete discountCalculation.groupMap;
            delete discountCalculation.addedGroupMap;
            delete discountCalculation.removedGroupMap;
            delete discountCalculation.overallDiscounts;
            delete discountCalculation.overallDiscountsExpanded;
            delete discountCalculation.surveyRetrieved;
            delete discountCalculation.retrieved;
        };

        var cleanupGroup = function(group) {
            // Build a list of cleaned members
            var members = group.members;
            var cleanedMembers = [];
            for (var j = 0; j < members.length; j++) {

                // Removed deleted members, cleanup ones to keep
                var member = members[j];
                if (!group.removedMemberMap[j]) {
                    cleanupMember(group, member);
                    cleanedMembers[cleanedMembers.length] = member;
                }
            }

            // Replace the members with the cleaned members
            group.members = cleanedMembers;

            // Delete unneeded fields from group
            delete group.isLibrary;
            delete group.isSchool;
            delete group.expanded;
            delete group.entitiesExpanded;
            delete group.worksheetExpanded;
            delete group.memberMap;
            delete group.showWorksheet;
            delete group.groupRetrieved;
            delete group.retrieved;
            delete group.addedMemberMap;
            delete group.removedMemberMap;
            if (group.overallDiscounts) {
                delete group.overallDiscounts.c1DiscountPercent;
                delete group.overallDiscounts.c2DiscountPercent;
                delete group.overallDiscounts.ruralPercent;
                delete group.overallDiscounts.urbanPercent;
                delete group.overallDiscounts.percentStudentsNSLP;
                delete group.overallDiscounts.relevantDiscountPercent;
            }
        };

        var cleanupMember = function(group, member) {
            // Delete unneeded fields from member
            delete member.preDiscountCat2Budget;
            delete member.postDiscountCat2Budget;
            delete member.imlshigh;
            delete member.cat1DiscountPercent;
            delete member.cat2DiscountPercent;
            delete member.lastNumber;

            // Remove School or Library fields
            if (group.isSchool) {
                delete member.fcscCode;
                delete member.libraryType;
            }
            if (group.isLibrary) {
                delete member.ncesCode;
                delete member.schoolType;
            }

            // Remove worksheet fields if the worksheet is not being used
            if (!group.showWorksheet) {
          		 delete member.eligibleStudentCount;
        		 delete member.nslpStudentCount;
        		 delete member.cepPercent;
        		 delete member.nslpStudentPercent;
            }

            // Convert school type and library type back to lists
            convertSchoolTypeToList(member);
            convertLibraryTypeToList(member);
        };

        var cleanupSurvey = function(discountCalculation) {
            if (discountCalculation.survey) {
                delete discountCalculation.survey.schoolDistrictInternetSpeedMap;
                if (discountCalculation.survey.schoolCapacityCoverage == null) {
                    delete discountCalculation.survey.schoolCapacityCoverage;
                }
                if (discountCalculation.survey.libraryCountLessThan50k == null) {
                    delete discountCalculation.survey.libraryCountLessThan50k;
                }
                if (discountCalculation.survey.libraryCount50kOrGreater == null) {
                    delete discountCalculation.survey.libraryCount50kOrGreater;
                }
                var reasons = [];
                var keys = Object.keys(discountCalculation.survey.insufficientCoverageReasons);
                for (var i = 0; i < keys.length; i++) {
                    if (discountCalculation.survey.insufficientCoverageReasons[keys[i]]) {
                        reasons[reasons.length] = keys[i];
                    }
                }
                discountCalculation.survey.insufficientCoverageReasons = reasons;
            }
        };*/
    }
);