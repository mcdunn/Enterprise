'use strict';

angular
    .module('discountCalculationDataModifyService', [])
    .service('discountCalculationDataModifyService',
    function dataModifyService($q, $timeout) {

        var dataModifyService = this;

        this.load = function(application, scope) {
            waitForData(application, scope).then(
                function (discountCalculation) {
                    scope.discountCalculation = processRetrievedDiscountCalculation(discountCalculation);
                },
                function () {
                    dataModifyService.load(application, scope);
                }
            );
        };

        var waitForData = function(application, scope) {
            var deferred = $q.defer();
            $timeout(
                function() {
                    var discountCalculation = null;
                    if (application.discountCalculation.retrieved) {
                        deferred.resolve(application.discountCalculation);
                    }
                    else {
                        deferred.reject();
                    }
                }, 500, false
            );
            return deferred.promise;
        };

        var processRetrievedDiscountCalculation = function(discountCalculation) {
            discountCalculation = angular.copy(discountCalculation);
            discountCalculation.addedGroupMap = {};
            discountCalculation.removedGroupMap = {};
            var processedGroups = [];
            for (var j = 0; j < discountCalculation.groups.length; j++) {
            	var mainBranchFound=false;
                var group = discountCalculation.groups[j];
                if (discountCalculation.groupMap[group.number]) {
                    group.showWorksheet = isWorksheetUsed(group);
                    group.worksheetExpanded = group.showWorksheet;
                    group.addedMemberMap = {};
                    group.removedMemberMap = {};
                    var processedMembers = [];
                    for (var k = 0; k < discountCalculation.groups[j].members.length; k++) {
                        var member = discountCalculation.groups[j].members[k];
                        if (group.memberMap[member.number]) {
                            member.lastNumber = member.number;
                            processedMembers.push(member);
                        }
                        if(member.mainBranchInd){
                        	mainBranchFound = true;
                        }
                        member.index = k;
                    }
                    group.mainBranchSelected = mainBranchFound;
                    group.members = processedMembers;
                    processedGroups.push(group);
                }
                group.index = j;
            }
            discountCalculation.groups = processedGroups;
            discountCalculation.retrieved = true;
            return discountCalculation;
        };

        this.cleanupDiscountCalculationForSave = function (discountCalculation) {

            // Clone the Discount Calculation object so it can be cleaned up safely
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

            return cleanedDiscountCalculation;
        };
        
        var deleteUnneededDiscountCalculationFields = function(discountCalculation) {
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
            delete group.index;
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
            delete group.overallUrbanRuralStatus;
            delete group.mainBranchSelected;
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
            delete member.index;
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
        };

        var convertSchoolTypeToList = function (member) {
            var selectedValues = [];
            if (member.schoolType) {
                var keys = Object.keys(member.schoolType);
                for (var i = 0; i < keys.length; i++) {
                    if (member.schoolType[keys[i]]) {
                        selectedValues[selectedValues.length] = keys[i];
                    }
                }
            }
            member.schoolType = selectedValues;
        };

        var convertLibraryTypeToList = function (member) {
            var selectedValues = [];
            if (member.libraryType) {
                var keys = Object.keys(member.libraryType);
                for (var i = 0; i < keys.length; i++) {
                    if (member.libraryType[keys[i]]) {
                        selectedValues[selectedValues.length] = keys[i];
                    }
                }
            }
            member.libraryType = selectedValues;
        };
        
        
        var isWorksheetUsed = function(group) {
            if (!group.isSchool) {
                return false;
            }
            else {
                var numberOfMembers = group.members.length;
                for (var i = 0; i < numberOfMembers; i++){
                    if (group.members[i].eligibleStudentCount !== null) {
                        return true;
                    }
                    else if (group.members[i].cepPercent !== null) {
                        return true;
                    }
                    else if (group.members[i].nslpStudentCount !== null) {
                        return true;
                    }
                }
            }
            return false;
        };
    }
);