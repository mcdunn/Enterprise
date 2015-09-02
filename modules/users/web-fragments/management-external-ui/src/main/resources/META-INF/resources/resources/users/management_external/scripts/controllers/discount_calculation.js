'use strict';

/**
 * @ngdoc function
 * @name discountCalculationModifyCtrl
 * @description
 * # discountCalculationModifyCtrl
 * Controller for modifying Discount Calculation for Form 471
 */
angular
    .module('form471View')
    .controller('discountCalculationModifyCtrl',
    ['$scope', '$timeout', '$filter', 'moPaginationService', 'lookupService', 'restService', 'dataModifyService', 'errorService', 'validationService',
        function ($scope, $timeout, $filter, moPaginationService, lookupService, restService, dataModifyService, errorService, validationService) {

            $scope.groupBeingEdited = null;
            $scope.memberBeingEdited = null;
            $scope.groupBeingEditedIndex = null;
            $scope.memberBeingEditedIndex = null;
            $scope.fieldBeingEdited = null;
            $scope.isGroupOnlyBeingEdited = false;
            
            $scope.openedPopoverID = null;
            
            $scope.handleGroupNumberChange = function (groupIndex) {
                var group = $scope.getGroupByIndex(groupIndex);
                restService.modifyRestService.getBilledEntity(group.number).then(
                    function (billedEntity) {
                    	group.name=billedEntity.name;
                    	group.status = billedEntity.status;
                    	
                    	errorService.discountCalculation.removeError(groupIndex);
                    	validationService.discountCalculation.validateBENChange($scope.discountCalculation, group,
                            groupIndex, $scope.astars);
                    },
                    function (httpErrorCode) {
                    	errorService.discountCalculation.removeError(groupIndex);
                    	errorService.discountCalculation.addError(groupIndex, null, 'number',
            					errorService.discountCalculation.types.ENTITY_NUMBER_INVALID, null);
                    	group.name = null;
                    }
                );
            };

            //			//////////////////////////////////////////////////////
            // Add and Remove Billed Entities

            $scope.isAddBilledEntityAllowed = function(){
                var numGroups = $scope.getNumGroups();
            	if ($scope.application.isSchool || $scope.application.isLibrary) {
            		return (numGroups === 0);
            	}
                return true;
            };

            $scope.initNewBilledEntity = function() {
                $scope.newBilledEntity = {"number":null, "name":null, "type":null, "error":null,
                    "isSchool":false, "isLibrary":false, "members":[]};
                if($scope.application.isSchool == true) {
                	$scope.newBilledEntity.type = "SCHOOL";
                }
                if($scope.application.isLibrary == true) {
                	$scope.newBilledEntity.type = "LIBRARY";
                }
            };

            $scope.initNewBilledEntity();

            $scope.isAddBilledEntityOkayButtonEnabled = function(){
                if ($scope.newBilledEntity.error) {
                    return false;
                }
                if($scope.application.isSchool == true && $scope.application.isLibrary == true){
                	if($scope.newBilledEntity.number){
                		return true;
                	}
                }
                if ($scope.newBilledEntity.number && $scope.newBilledEntity.type &&  $scope.newBilledEntity.name) {
                    return true;
                }
                return false;
            };            
            
            $scope.handleBilledEntityNumberChange = function () {
                restService.modifyRestService.getBilledEntity($scope.newBilledEntity.number).then(
                    function (billedEntity) {
                        $scope.newBilledEntity.name = billedEntity.name;                        
                        $scope.newBilledEntity.error = null;
                        $scope.newBilledEntity.status = billedEntity.status;
                        validationService.discountCalculation.validateNewBilledEntity($scope.discountCalculation,
                            $scope.newBilledEntity, $scope.astars);
                    },
                    function (httpErrorCode) {
                        $scope.newBilledEntity.name = null;                        
                        $scope.newBilledEntity.error = errorService.discountCalculation.types["ENTITY_NUMBER_INVALID"];
                    }
                );
            };
            
            $scope.checkSchoolDistBEN = function (groupIndex, memberIndex, fieldName) {
            	var schoolDistBEN = $scope.getMemberByIndex(groupIndex, memberIndex)[fieldName];
            	
            	errorService.discountCalculation.removeError(groupIndex, memberIndex, 'schoolDistrictNumber');
            	if (schoolDistBEN == null || schoolDistBEN == "") {
        			errorService.discountCalculation.addError(groupIndex, memberIndex, 'schoolDistrictNumber',
        					errorService.discountCalculation.types.SCHOOL_DISTRICT_NUMBER_MISSING, schoolDistBEN);
    			}
                else if (isNaN(schoolDistBEN)) {
    				errorService.discountCalculation.addError(groupIndex, memberIndex, 'schoolDistrictNumber',
        					errorService.discountCalculation.types.SCHOOL_DISTRICT_NUMBER_INVALID, schoolDistBEN);
    			}
                else {
    				restService.modifyRestService.getBilledEntity(schoolDistBEN).then(
                            function (billedEntity) {
                            	if (billedEntity == null) {
                            		errorService.discountCalculation.addError(groupIndex, memberIndex, 'schoolDistrictNumber',
                        					errorService.discountCalculation.types.SCHOOL_DISTRICT_NUMBER_INVALID, schoolDistBEN);
                            	}
                                else if ((billedEntity.status != 'Active') && !$scope.astars) {
                            		errorService.discountCalculation.addError(groupIndex, memberIndex, 'schoolDistrictNumber',
                        					errorService.discountCalculation.types.SCHOOL_DISTRICT_NUMBER_INACTIVE, schoolDistBEN);
                            	}
                            },
                            function (error) {
                            	errorService.discountCalculation.addError(groupIndex, memberIndex, 'schoolDistrictNumber',
                    					errorService.discountCalculation.types.SCHOOL_DISTRICT_NUMBER_INVALID, schoolDistBEN);
                            }
                        );
    			}
            };

            $scope.addBilledEntity = function() {
                var group = {
                    "number":$scope.newBilledEntity.number,
                    "name":$scope.newBilledEntity.name,
                    "type":$scope.newBilledEntity.type,
                    "members":$scope.newBilledEntity.members,
                    "isSchool":$scope.newBilledEntity.isSchool,
                    "isLibrary":$scope.newBilledEntity.isLibrary,
                    "expanded":true,
                    "entitiesExpanded":true,
                    "worksheetExpanded":true,
                    "groupRetrieved":true,
                    "retrieved":true,
                    "memberMap":{},
                    "addedMemberMap":{},
                    "removedMemberMap":{},                    
                    "showWorksheet":false,
                    "overallDiscounts":{},
                    "mainBranchSelected":false
                };
                
                if(group.type === 'SCHOOL'){
                	group.isSchool = true;
                }
                if(group.type === 'LIBRARY'){
                	group.isLibrary = true;
                }

                var groupIndex = $scope.discountCalculation.groups.length;
                group.index = groupIndex;
                $scope.discountCalculation.groups[groupIndex] = group;
                $scope.discountCalculation.addedGroupMap[groupIndex] = group;
                $scope.initNewBilledEntity();
                if($scope.application.isSchool == false && $scope.application.isLibrary == false ){
                $scope.closePopover('add_billed_entity');
                }
                // TODO: this should be calling the validation code to check for duplicate billed entities,
                // TODO: too many billed entities, etc. Even though the UI should prevent it, validation should not be skipped
                errorService.discountCalculation.removeErrorsByType(
                    errorService.discountCalculation.types.NO_BILLED_ENTITIES);
            };

            $scope.isDeleteBilledEntityAllowed = function (groupIndex) {
                return true;
            };

            $scope.deleteBilledEntity = function (groupIndex) {
                var group = $scope.getGroupByIndex(groupIndex);
                $scope.discountCalculation.removedGroupMap[groupIndex] = group;                
                var numGroups = 0;
                for (var i = 0; i < $scope.discountCalculation.groups.length; i++) {
                    if (!$scope.discountCalculation.removedGroupMap[i]) {
                        numGroups++;
                    }
                }
                // TODO: this should be calling the validation code to check for duplicate billed entities,
                // TODO: deleting a billed entity may have fixed a duplicate problem
                if (numGroups == 0) {
                    errorService.discountCalculation.addError(null, null, null,
                        errorService.discountCalculation.types.NO_BILLED_ENTITIES);
                }
                if (numGroups < 2) {
                    errorService.discountCalculation.removeError(null, null, null,
                        errorService.discountCalculation.types.MULTIPLE_BILLED_ENTITIES);
                }
                //Clean all the errors related to this group
                errorService.discountCalculation.removeError(groupIndex);
            };

            $scope.undeleteBilledEntity = function (groupIndex) {
            	delete $scope.discountCalculation.removedGroupMap[groupIndex];
                var numGroups = 0;
                var groupEntities = [];
                for (var i = 0; i < $scope.discountCalculation.groups.length; i++) {
                    if (!$scope.discountCalculation.removedGroupMap[i]) {
                        numGroups++;
                        groupEntities.push($scope.getGroupByIndex(i).number);
                    }
                }
                // TODO: this should be calling the validation code to check for duplicate billed entities,
                // TODO: too many billed entities, etc. Even though the UI should prevent it, validation should not be skipped
                if (numGroups > 0) {
                    errorService.discountCalculation.removeError(null, null, null,
                        errorService.discountCalculation.types.NO_BILLED_ENTITIES);
                }
                if ((numGroups > 1) && ($scope.application.basicInformation.applicationType != 'CONSORTIUM') &&
                    ($scope.application.basicInformation.applicationType != 'STATEWIDE')) {
                    errorService.discountCalculation.addError(null, null, null,
                        errorService.discountCalculation.types.MULTIPLE_BILLED_ENTITIES, groupEntities.split(", "));
                }
            };

            // Add, Remove and Modify Member Entities

            $scope.addMember = function (groupIndex) {
                var group = $scope.getGroupByIndex(groupIndex);
                var member = {};
                if(group.isSchool){
                    member.schoolType = {};
                    member.estimatedStudentCountInd = false;
                }
                if(group.type === 'LIBRARY'){
                    member.libraryType = {};
                    member.mainBranchInd = false;
                }
                var memberIndex = group.members.length;
                member.index = memberIndex;
                group.members[memberIndex] = member;
                group.addedMemberMap[memberIndex] = member;
                errorService.discountCalculation.addError(groupIndex, memberIndex, 'number',
                    errorService.discountCalculation.types.ENTITY_NUMBER_MISSING, null);
                moPaginationService.showRow("modify_discount_calculation_group_" + groupIndex + "_members",
                    memberIndex);
                moPaginationService.showRow("modify_discount_calculation_group_" + groupIndex + "_worksheet",
                    memberIndex);
            };

            $scope.deleteMember = function (groupIndex, memberIndex) {
                var group = $scope.getGroupByIndex(groupIndex);
                var member = $scope.getMemberByIndex(groupIndex, memberIndex);
                if(member.mainBranchInd){
                	group.mainBranchSelected = false;
                }
                group.removedMemberMap[memberIndex] = member;
                $scope.updateStudentCounts(group);
                //Clean all the errors related to this member
                errorService.discountCalculation.removeError(groupIndex, memberIndex);
                $scope.validateDuplicateMemberNumbers($scope.discountCalculation);
            };

            $scope.undeleteMember = function (groupIndex, memberIndex) {
                var group = $scope.getGroupByIndex(groupIndex);
                delete group.removedMemberMap[memberIndex];
                var member = $scope.getMemberByIndex(groupIndex, memberIndex);
                if(member.mainBranchInd){
                	group.mainBranchSelected = true;
                }
                $scope.updateStudentCounts(group);
                $scope.validateDuplicateMemberNumbers($scope.discountCalculation);
                $scope.handleMemberDataChange(groupIndex, memberIndex);
            };

            // TODO: this is a little inconsistent to call this directly when there is a handleChange() method
            $scope.handleMemberNumberChange = function (groupIndex, memberIndex) {
                var group = $scope.getGroupByIndex(groupIndex);
                var member = $scope.getMemberByIndex(groupIndex, memberIndex);
                restService.modifyRestService.getBilledEntity(member.number).then(
                    function (billedEntity) {
                        delete group.memberMap[member.lastNumber];
                        group.memberMap[member.number] = member;
                        errorService.discountCalculation.removeError(groupIndex, memberIndex, 'number');
                        billedEntity = processBilledEntityData(billedEntity);
                        member.name = billedEntity.name;
                        member.urbanRuralInd = billedEntity.urbanRuralStatus;
                        member.ncesCode = billedEntity.ncesCode;
                        member.fcscCode = billedEntity.fscsCode;
                        member.imslhigh = billedEntity.imslhigh;
                        member.status = billedEntity.status;
                        member.lastNumber = member.number;

                        $scope.validateChangedMemberNumber(groupIndex, memberIndex);
                    },
                    function (httpErrorCode) {
                        delete group.memberMap[member.lastNumber];
                        group.memberMap[member.number] = member;
                        errorService.discountCalculation.removeError(groupIndex, memberIndex, 'number');
                        errorService.discountCalculation.addError(groupIndex, memberIndex, 'number',
                            errorService.discountCalculation.types.ENTITY_NUMBER_INVALID, member.number);
                        member.name = null;
                        member.urbanRuralInd = null;
                        member.ncesCode = null;
                        member.fcscCode = null;
                        member.imslhigh = null;
                        member.status = null;
                        member.lastNumber = member.number;
                        $scope.validateDuplicateMemberNumbers($scope.discountCalculation);
                    }
                );
            };
            
            $scope.handleMemberDataChange = function (groupIndex, memberIndex) {
            	var discountCalculation = $scope.discountCalculation;
            	validationService.discountCalculation.validateChangedMemberData(discountCalculation, groupIndex, memberIndex);
            };
            
            $scope.revalidateGroupMembers = function (groupIndex) {
            	var group = $scope.getGroupByIndex(groupIndex);
                for (var memberIndex = 0; memberIndex < group.members.length; memberIndex++) {
                	if (!group.removedMemberMap[memberIndex]) {
                		$scope.handleMemberDataChange(groupIndex, memberIndex);
                	}
                }
            };

            // Add and Remove Worksheet

            $scope.isAddWorksheetAllowed = function(groupIndex){
                var group = $scope.getGroupByIndex(groupIndex);
                return (!group.showWorksheet || group.worksheetRemoved);
            };

            $scope.isDeleteWorksheetAllowed = function(groupIndex){
                var group = $scope.getGroupByIndex(groupIndex);
                return (group.showWorksheet && !group.worksheetRemoved);
            };

            $scope.isWorksheetAdded = function(groupIndex) {
                var group = $scope.getGroupByIndex(groupIndex);
                return (group.showWorksheet && $scope.isModified(groupIndex, null, "showWorksheet"));
            };

            $scope.isWorksheetRemoved = function(groupIndex) {
                var group = $scope.getGroupByIndex(groupIndex);
                return (!group.showWorksheet && group.worksheetRemoved);
            };

            $scope.deleteWorksheet = function (groupIndex) {
                var group = $scope.getGroupByIndex(groupIndex);
                group.showWorksheet = false;
                group.worksheetRemoved = true;
                group.worksheetExpanded = false;

                group.overallDiscounts.numStudents = null;
                group.overallDiscounts.numStudentsNSLP = null;
                group.overallDiscounts.percentStudentsNSLP = null;
                
                // Need to update validation for group members if worksheet is added/removed
                $scope.revalidateGroupMembers(groupIndex);
            };

            $scope.undeleteWorksheet = function (groupIndex) {
                var group = $scope.getGroupByIndex(groupIndex);
                group.showWorksheet = true;
                group.worksheetRemoved = false;
                group.worksheetExpanded = true;
                $scope.updateStudentCounts(group);
                
                // Need to update validation for group members if worksheet is added/removed
                $scope.revalidateGroupMembers(groupIndex);
            };

            $scope.addWorksheet = function (groupIndex) {
                var group = $scope.getGroupByIndex(groupIndex);
                group.showWorksheet = true;
                group.worksheetRemoved = false;
                group.worksheetExpanded = true;
                $scope.updateStudentCounts(group);
                
                // Need to update validation for group members if worksheet is added/removed
                $scope.revalidateGroupMembers(groupIndex);
            };

            $scope.expandWorksheet = function(discountGroup) {
                if (discountGroup.showWorksheet && !discountGroup.worksheetRemoved) {
                    $scope.toggleBoolean(discountGroup, 'worksheetExpanded');
                }
            };

            $scope.recalculateNSLPPercent = function (groupIndex) {
                var group = $scope.getGroupByIndex(groupIndex);
                var numStudents = group.overallDiscounts.numStudents;
                var numStudentsNSLP = group.overallDiscounts.numStudentsNSLP;
                if (numStudents !== null && !isNaN(numStudents) && numStudents > 0
                    && numStudentsNSLP !== null && !isNaN(numStudentsNSLP)) {
                    var percent = numStudentsNSLP * 100 / numStudents;
                    group.overallDiscounts.percentStudentsNSLP = $filter('number')(percent, 0);
                }
            };

            $scope.updateStudentCounts = function (group) {
                if (group.showWorksheet) {
                    var numStudents = 0;
                    var numStudentsNSLP = 0;
                    for (var i = 0; i < group.members.length; i++) {
                        if (!group.removedMemberMap[i]) {
                            var member = group.members[i];
                            if (!member.nifInd) {
                            	if (member.altDiscountType === "CEP") {
                            		member.nslpStudentCount = $scope.nlspCalcByPercentage(member)
                            	}
                            	if ((typeof member.eligibleStudentCount != 'undefined') &&
                                    (member.eligibleStudentCount !== null) &&
                                    (member.eligibleStudentCount !== "") &&
                                    (!isNaN(member.eligibleStudentCount)) ) {
                            		numStudents += parseInt(member.eligibleStudentCount);
                            	}
                            	if ((typeof member.nslpStudentCount != 'undefined') &&
                                    (member.nslpStudentCount !== null) &&
                                    (member.nslpStudentCount !== "") &&
                                    (!isNaN(member.nslpStudentCount)) ) {
                            		numStudentsNSLP += parseInt(member.nslpStudentCount);
                            	}
                            }
                        }
                    }
                    group.overallDiscounts.numStudents = numStudents;
                    group.overallDiscounts.numStudentsNSLP = numStudentsNSLP;
                    if (numStudents) {
                        group.overallDiscounts.percentStudentsNSLP = Math.round(100 * (numStudentsNSLP / numStudents));
                    }
                    else {
                        group.overallDiscounts.percentStudentsNSLP = null;
                    }
                }
            };
            
            $scope.nlspCalcByPercentage = function(member){
                if(member.eligibleStudentCount===0){
                	return 0;
                }
                if(member.eligibleStudentCount==""){
                	return null;
                }
                var studentCount = Number(member.eligibleStudentCount);
                var autoNumber = Math.round(studentCount * member.cepPercent * 1.6 / 100);
                if(autoNumber <= studentCount){
                	return autoNumber;
                }
                else{
                	return member.eligibleStudentCount;
                }
              };
              
              $scope.updateOverallUrbanRuralStatus = function(groupIndex){
              	var group = $scope.getGroupByIndex(groupIndex);
              	var rural = false;              
              	var numberOfEntities = group.members.length;              
              	var numberOfNonNifEntities = 0;
              	var numberOfRuralNoNifEntities = 0;
              	var numberOfUrbanNoNifEntities = 0;
              	for(var i=0;i<numberOfEntities;i++){
              		if(!group.members[i].nifInd){
              			numberOfNonNifEntities++;
              			if(group.members[i].urbanRuralInd === "R"){
              				numberOfRuralNoNifEntities++;
              			}
              			else if(group.members[i].urbanRuralInd === "U"){
              				numberOfUrbanNoNifEntities++;
              			}
              		}
              	}
              	if(numberOfNonNifEntities > 0){
              		group.overallDiscounts.ruralPercent = (100 * numberOfRuralNoNifEntities)/numberOfNonNifEntities;
              		group.overallDiscounts.urbanPercent = (100 * numberOfUrbanNoNifEntities)/numberOfNonNifEntities;
                    //Update overall Urban/Rural status property in the the Group object
                    if(group.overallDiscounts.ruralPercent > 50){
                    	group.overallUrbanRuralStatus = "R";
                    }
                    else if(group.overallDiscounts.urbanPercent >= 50){
                    	group.overallUrbanRuralStatus = "U";
                    }
              	}
              	else{
              		group.overallUrbanRuralStatus = "";
              	}
              };
              
            $scope.save = function () {
                var discountCalculation =
                    dataModifyService.discountCalculation.cleanupDiscountCalculationForSave($scope.discountCalculation);
                restService.modifyRestService.saveDiscountCalculation($scope.applicationNumber, discountCalculation,
                    $scope.CURRENT).then(
                    function (result) {
                        $scope.$dismiss();
                        delete $scope.originalApplication.discountCalculation;
                        delete $scope.currentApplication.discountCalculation;
                        $scope.getDiscountCalculationSummary($scope.originalApplication);
                        $scope.getDiscountCalculationSummary($scope.currentApplication);
                        $scope.getFundingRequestsSummary();
                        $scope.stopModifying();
                    }
                    , function (errors) {                    	
                        errorService.discountCalculation.init();
                        if((Object.keys($scope.discountCalculation.removedGroupMap)).length == 0){
                        	errorService.discountCalculation.processRESTServiceErrors(errors.errors);
                        }
                        else {
                        	/*
                        	 * If removedGroupMap.length > 0
                        	 * Means the errors.errorRoot is not correct index for this error group.
                        	 * Find the actual Group Index in original groups arrays by looking at the BEN.
                        	 */
                        	for(var index = 0 ; index < errors.errors.length ; index++){
                        		var errorGroupIndex = errors.errors[index].errorRoot;
                        		if((errorGroupIndex != null) || (errorGroupIndex != undefined)){
                        			var cleanGroups = dataModifyService.discountCalculation
                        								.cleanupDiscountCalculationForSave($scope.discountCalculation).groups;
                        			var errorGroupBEN = cleanGroups[errors.errors[index].errorRoot].number;
                        			
                        			var originalGroups = $scope.discountCalculation.groups;
                        			for(var i = 0 ; i < originalGroups.length ; i++){
                        				if(originalGroups[i].number === errorGroupBEN){
                        					errorGroupIndex = i;
                        				}
                        			}
                        			errors.errors[index].errorRoot = errorGroupIndex;
                        		}
                        	}
                        	errorService.discountCalculation.processRESTServiceErrors(errors.errors);
                        }
                    	
                    }
                );
            };

            $scope.cancel = function() {
                $scope.$dismiss();
                $scope.stopModifying();
            };

            $scope.toggleDiscountCalculationGroupDisplay = function (groupIndex) {
                var group = $scope.getGroupByIndex(groupIndex);
                if (group) {
                    group.expanded = !group.expanded;
                    if (!group.groupRetrieved) {
                        group.entitiesExpanded = true;
                        if (!$scope.isWorksheetRemoved(groupIndex)) {
                            group.worksheetExpanded = true;
                        }
                    }
                }
            };
            
            $scope.startEdit = function (groupIndex, memberIndex, fieldName) {
            	if(typeof memberIndex === 'undefined'){
            		$scope.isGroupOnlyBeingEdited = true;
                	var group = $scope.getGroupByIndex(groupIndex);
                    
                    if ($scope.isEditingAllowed(groupIndex, memberIndex, fieldName)) {
                        $scope.groupBeingEdited = group;
                        $scope.fieldBeingEdited = fieldName;
                        $scope.groupBeingEditedIndex = groupIndex;
                        
                        var id = "dc_" + groupIndex + "_" + fieldName + "_input";
                        $timeout(function() {
                            $("#" + id).trigger("focus");
                        }, 100);
                    }
                    else {
                        $scope.groupBeingEdited = null;
                        $scope.fieldBeingEdited = null;
                        $scope.groupBeingEditedIndex = null;
                    }
            	}
            	else{
            		$scope.isGroupOnlyBeingEdited = false;
                	var group = $scope.getGroupByIndex(groupIndex);
                    var member = $scope.getMemberByIndex(groupIndex, memberIndex);
                    if ($scope.isEditingAllowed(groupIndex, memberIndex, fieldName)) {
                        $scope.groupBeingEdited = group;
                        $scope.memberBeingEdited = member;
                        $scope.fieldBeingEdited = fieldName;
                        $scope.groupBeingEditedIndex = groupIndex;
                        $scope.memberBeingEditedIndex = memberIndex;
                        $scope.handleSpecialEdits(group, member, fieldName);
                        var id = "dc_" + groupIndex + "_" + memberIndex + "_" + fieldName + "_input";
                        $timeout(function() {
                            $("#" + id).trigger("focus");
                        }, 100);
                    }
                    else {
                        $scope.groupBeingEdited = null;
                        $scope.memberBeingEdited = null;
                        $scope.fieldBeingEdited = null;
                        $scope.groupBeingEditedIndex = null;
                        $scope.memberBeingEditedIndex = null;
                    }
            	}

            };

            $scope.endEdit = function (groupIndex, memberIndex, fieldName) {
            	if(typeof memberIndex === 'undefined'){
                	var group = $scope.getGroupByIndex(groupIndex);
                    if (($scope.groupBeingEdited === group) &&
                        ($scope.fieldBeingEdited === fieldName && $scope.isGroupOnlyBeingEdited)) {
                        $scope.groupBeingEdited = null;
                        $scope.fieldBeingEdited = null;
                        $scope.groupBeingEditedIndex = null;
                        $scope.isGroupOnlyBeingEdited = false;
                    }
            	}
            	else{
	            	var group = $scope.getGroupByIndex(groupIndex);
	                var member = $scope.getMemberByIndex(groupIndex, memberIndex);
	                if (($scope.groupBeingEdited === group) && ($scope.memberBeingEdited === member) &&
	                    ($scope.fieldBeingEdited === fieldName)) {
	                    $scope.groupBeingEdited = null;
	                    $scope.memberBeingEdited = null;
	                    $scope.fieldBeingEdited = null;
                        $scope.groupBeingEditedIndex = null;
                        $scope.memberBeingEditedIndex = null;
	                    $scope.isGroupOnlyBeingEdited = false;
	                }
            	}
            };

            $scope.isEditable = function (groupIndex, memberIndex, fieldName) {
                if(typeof memberIndex === 'undefined'){
                	if($scope.isGroupOnlyBeingEdited){
	                	var group = $scope.getGroupByIndex(groupIndex);
	                    return (($scope.groupBeingEdited === group) &&
	                            (fieldName === $scope.fieldBeingEdited));
                	}
                }
                else{
                	var group = $scope.getGroupByIndex(groupIndex);
                	var member = $scope.getMemberByIndex(groupIndex, memberIndex);
                	return (($scope.groupBeingEdited === group) && (member === $scope.memberBeingEdited) &&
                			(fieldName === $scope.fieldBeingEdited));
                }
            };

            $scope.isEditingAllowed = function (groupIndex, memberIndex, fieldName) {
                if(typeof memberIndex === 'undefined') {
                    var group = $scope.getGroupByIndex(groupIndex);
                    //Disable name for parent BEN editing
                    if(group && fieldName === 'name'){
                         return false;
                     }
                    // Disable editing of deleted parent BENs
                    if($scope.discountCalculation.removedGroupMap[groupIndex]){
                        return false;
                    }
                    return true;
                }
                else {
                    var group = $scope.getGroupByIndex(groupIndex);
                    var member = $scope.getMemberByIndex(groupIndex, memberIndex);
                    
	                // Disable editing of deleted entities
	                if (group.removedMemberMap[memberIndex]) {
	                    return false;
	                }
	
	                // Disable editing of Entity Name
	                if (member && (fieldName === 'name')) {
	                    return false;
	                }
	
	                // Disable editing percentage of direct certification students if not cep
	                if (member && (fieldName === 'cepPercent') && (member.altDiscountType != "CEP")) {
	                    return false;
	                }
	                
	                // Disable Total NSLP student if cep
	                if (member && (fieldName === 'nslpStudentCount') && (member.altDiscountType == "CEP")) {
	                    return false;
	                }
	                
	                //Disable # of student / # of Sq Footage for category 1
	                if ($scope.discountCalculation.fundingRequestCategory === "1") {
	                	if ((fieldName === 'studentCount') || (fieldName === 'totalSquareFootage')) {
							return false;
						}
	                }
	                
	                //NIF = Y
	                //Disable # of student/# of Sq Footage, urban/rural, eligibleStudentCount, nslpStudentCount
	            	if(member && member.nifInd){
	            		if((fieldName === 'urbanRuralInd') 
	            			|| (fieldName === 'studentCount') 
	            			|| (fieldName === 'totalSquareFootage')
	            			|| (fieldName === 'eligibleStudentCount')
	            			|| (fieldName === 'nslpStudentCount')
	            			|| (fieldName === 'estimatedStudentCountInd')){
	            			return false;
	            		}
	            	}
	                
	                //Estimate Student Count only editable for NEW Construction.
	                if(member && (fieldName === 'estimatedStudentCountInd')){
                        if (!group.isSchool) {
                            return false;
                        }
	                	if (!member.schoolType.NEW_CONSTRUCTION) {
	                		return false;
	                	}
	                }
	                
	                //Disable Main Branch
	                if(member && (fieldName === 'mainBranchInd')){
	                	if(group.mainBranchSelected && !member.mainBranchInd)
	                		return false;
	                }
	                
	                //Disable School District BEN for NOT main branch
	                if(member && (fieldName === 'schoolDistrictNumber')){
	                	if(!member.mainBranchInd)
	                		return false;
	                }
	                
	                //Disable IMLS code editing
	                if (member && (fieldName === 'imlshigh')) {
	                	return false;
	                }
	                
	                return true;
                }
                
            };

            $scope.handleSpecialEdits = function (group, member, fieldName) {
                // Use this method to handle any special processing for non-standard input fields
            	if(fieldName === 'libraryType' || fieldName === 'schoolType'){
            		 $scope.openedPopoverID = 'dc_'+ $scope.groupBeingEditedIndex + '_' + $scope.memberBeingEditedIndex + '_'+ fieldName;
            	}
            };

            $scope.isRemoved = function (groupIndex, memberIndex) {
                var group = $scope.getGroupByIndex(groupIndex);
                if ((memberIndex != null) && (typeof memberIndex !== 'undefined')) {
                    return group.removedMemberMap[memberIndex];
                }
                else {
                    return $scope.discountCalculation.removedGroupMap[groupIndex];
                }
            };

            $scope.isAdded = function (groupIndex, memberIndex) {
                var group = $scope.getGroupByIndex(groupIndex);
                if ((memberIndex != null) && (typeof memberIndex !== 'undefined')) {
                    return group.addedMemberMap[memberIndex];
                }
                else {
                    return $scope.discountCalculation.addedGroupMap[groupIndex];
                }
            };

            // Error handling
            $scope.isError = function (groupIndex, memberIndex, fieldName) {
                return errorService.discountCalculation.isError(groupIndex, memberIndex, fieldName);
            };

            $scope.getErrorMessage = function (groupIndex, memberIndex, fieldName) {
                return errorService.discountCalculation.getErrorMessage(groupIndex, memberIndex, fieldName);
            };

            $scope.getErrorCount = function(groupIndex, memberIndex, fieldName) {
                return errorService.discountCalculation.getErrorCount(groupIndex, memberIndex, fieldName);
            };

            $scope.getErrors = function (groupIndex, memberIndex, fieldName) {
                return errorService.discountCalculation.getErrors(groupIndex, memberIndex, fieldName);
            };

            $scope.goToError = function (error) {
                var id = $scope.getErrorLocationId(error);
                if (id) {
                    if ((error.indices[0] != null) && (typeof error.indices[0] != 'undefined')) {
                        moPaginationService.showRow("modify_discount_calculation_groups", error.indices[0]);
                        var group = $scope.getGroupByIndex(error.indices[0]);
                        group.expanded = true;
                        group.entitiesExpanded = true;
                        if (group.showWorksheet) {
                            group.worksheetExpanded = true;
                        }
                    }
                    if ((error.indices[1] != null) && (typeof error.indices[1] != 'undefined')) {
                        $timeout(function () {
                            moPaginationService.showRow("modify_discount_calculation_group_" + error.indices[0] + "_members",
                                error.indices[1]);
                            moPaginationService.showRow("modify_discount_calculation_group_" + error.indices[0] + "_worksheet",
                                error.indices[1]);
                        }, 100);
                    }
                    $timeout(function () {
                        $scope.scrollToImmediately(id);
                        // Give the element focus / make it editable
                        $("#" + id).trigger("click");
                        $("#" + id+"_btn").trigger("click");
                        $("#" + id + "_input").trigger("focus");
                    }, 500);
                }
            };

            $scope.getErrorLocationId = function(error) {
                var id = "dc";
                for (var i = 0; i < error.indices.length; i++) {
                    var index = error.indices[i];
                    if ((index != null) && (typeof index != 'undefined')) {
                        id += "_" + index;
                    }
                }
                if (id === "dc") {
                    return null;
                }
                return id;
            };

            // Validation wrapping
            $scope.validateDuplicateMemberNumbers = function () {
                validationService.discountCalculation.validateDuplicateMemberNumbers($scope.discountCalculation);
            };
            
            $scope.validateChangedMemberNumber = function (groupIndex, memberIndex) {
            	validationService.discountCalculation.validateChangedMemberNumber($scope.discountCalculation,
            			groupIndex, memberIndex, $scope.astars);
            };
            
            $scope.validateChangedMemberData = function (groupIndex, memberIndex) {
            	validationService.discountCalculation.validateChangedMemberData($scope.discountCalculation,
            			groupIndex, memberIndex);
            };

            $scope.isModified = function (groupIndex, memberIndex, fieldName,groupSubField) {
                try {
                    var currentValue = {};
                	var originalValue = {};
                	if(memberIndex || memberIndex === 0){
                		currentValue = $scope.discountCalculation.groups[groupIndex].members[memberIndex][fieldName];
                		originalValue = $scope.application.discountCalculation.groups[groupIndex].members[memberIndex][fieldName];
                	}
                	else{
                		if(typeof groupSubField === 'undefined' || groupSubField === null || !groupSubField){
                			currentValue = $scope.discountCalculation.groups[groupIndex][fieldName];
                			originalValue = $scope.application.discountCalculation.groups[groupIndex][fieldName];
                		}
                		else{
                			currentValue = $scope.discountCalculation.groups[groupIndex][fieldName][groupSubField];
                			originalValue = $scope.application.discountCalculation.groups[groupIndex][fieldName][groupSubField];
                		}
                	}

                    // Compare objects
                    if((originalValue == null) && (currentValue != null)){
                        return true;
                    }
                    if((originalValue != null) && (currentValue == null)){
                        return true;
                    }
                    var currentKeys = Object.keys(new Object(currentValue));
                    var originalKeys = Object.keys(new Object(originalValue));
                    if (currentKeys.length > 0) {
                        if (originalKeys.length > 0) {
                            for (var i = 0; i < currentKeys.length; i++) {
                                if (originalValue[currentKeys[i]] != currentValue[currentKeys[i]]) {
                                    return true;
                                }
                            }
                            for (var i = 0; i < originalKeys.length; i++) {
                                if (originalValue[originalKeys[i]] != currentValue[originalKeys[i]]) {
                                    return true;
                                }
                            }
                            return false;
                        }
                        return true;
                    }
                    if (originalKeys > 0) {
                        return true;
                    }

                    // Compare arrays
                    if (Array.isArray(currentValue)) {
                        if (Array.isArray(originalValue)) {
                            if (currentValue.length != originalValue.length) {
                                return true;
                            }
                            for (var i = 0; i < currentValue.length; i++) {
                                if (originalValue.indexOf(currentValue[i]) < 0) {
                                    return true;
                                }
                            }
                            return false;
                        }
                        return true;
                    }
                    if (Array.isArray(originalValue)) {
                        return true;
                    }

                    // Compare scalars
                    return currentValue != originalValue;
                }
                catch (e) {
                    // Exception from getCurrentValue() or getOriginalValue() indicates an added or removed list item
                    return false;
                }
            };

            $scope.getChangedValue = function (groupIndex, memberIndex, fieldName,groupSubField) {
                try {
                	if(memberIndex || memberIndex === 0){
                		return $scope.application.discountCalculation.groups[groupIndex].members[memberIndex][fieldName];
                	}
                	else{
                		if(typeof groupSubField === 'undefined' || groupSubField === null || !groupSubField){
                			return $scope.application.discountCalculation.groups[groupIndex][fieldName];
                		}
                		else{
                			return $scope.application.discountCalculation.groups[groupIndex][fieldName][groupSubField];
                		}
                	}
                }
                catch (e) {
                    return null;
                }
            };

            // TODO: move this somewhere common
            var processBilledEntityData = function (data) {
                if (data.contactInfo) {
                    if (data.contactInfo.phone && !/\d{10}/.test(data.contactInfo.phone)) {
                        data.contactInfo.phone = null;
                    }
                    if (data.contactInfo.fax && !/\d{10}/.test(data.contactInfo.fax)) {
                        data.contactInfo.fax = null;
                    }
                }
                data.ncesCode = "";
                if (data.ncesStateNumber) {
                    data.ncesCode += data.ncesStateNumber.trim();
                }
                if (data.ncesDistrictNumber) {
                    data.ncesCode += data.ncesDistrictNumber.trim();
                }
                if (data.ncesBuildingNumber) {
                    data.ncesCode += data.ncesBuildingNumber.trim();
                }
                if (data.ncesCode) {
                    data.fscsCode = data.ncesCode;
                }

                if (data.fccRegistrationNumber) {
                    if (data.fccRegistrationNumber == "0000000000") {
                        data.fccRegistrationNumber = null;
                    }
                    else if (!/\d{10}/.test(data.fccRegistrationNumber)) {
                        //if it's not ten digits don't use it.
                        data.fccRegistrationNumber = null;
                    }
                }
                return data;
            };

            $scope.getGroupByIndex = function (groupIndex) {
                if ((groupIndex != null) && (typeof groupIndex !== 'undefined')) {
                    return $scope.discountCalculation.groups[groupIndex];
                }
                return null;
            };

            $scope.getMemberByIndex = function (groupIndex, memberIndex) {
                var group = $scope.getGroupByIndex(groupIndex);
                if (group && (memberIndex != null) && (typeof memberIndex !== 'undefined')) {
                    return group.members[memberIndex];
                }
                return null;
            };

            $scope.getNumGroups = function() {
                if (!$scope.discountCalculation || !$scope.discountCalculation.groups) {
                    return 0;
                }
                var count = 0;
                for (var i = 0; i < $scope.discountCalculation.groups.length; i++) {
                    if (!$scope.discountCalculation.removedGroupMap[i]) {
                        count++;
                    }
                }
                return count;
            };
            
            $scope.handleChange = function(groupIndex, memberIndex, fieldName){
            	if(typeof memberIndex === 'undefined'){
            		if($scope.isGroupOnlyBeingEdited){
	            		var group = $scope.getGroupByIndex(groupIndex);
	            		if(fieldName === 'number'){
	            			$scope.handleGroupNumberChange(groupIndex);
	            		}
            		}
            	}
            	else{
	            	var group = $scope.getGroupByIndex(groupIndex);
	            	var member = $scope.getMemberByIndex(groupIndex, memberIndex);
	            	var members = group.members;
	            	if(fieldName === 'nifInd'){
	            		var nifInd = member[fieldName];
	                	if(nifInd){
	                		member.urbanRuralInd = undefined;
	                		if(group.isSchool){
	                    		member.studentCount = null;
	                    		member.estimatedStudentCountInd = false;
	                    		member.altDiscountType = null;
	                    		member.cepPercent = null;
	                		}
	                		if(group.isLibrary){
	                			member.totalSquareFootage = null;
	                		}
	                		member.eligibleStudentCount = null;
	                		member.nslpStudentCount = null;
	                		$scope.updateStudentCounts(group);
	                	}
	            	}
	            	else if(fieldName === 'schoolType'){
	            		var schoolType = member[fieldName];
	            		//Set Estimated Student count as NO when New Construction is unselected.
	            		if(!schoolType.NEW_CONSTRUCTION){
		            			member.estimatedStudentCountInd = false;
	            		}
	            	}
	            	else if(fieldName == 'mainBranchInd'){
	            		if(member.mainBranchInd){
	            			group.mainBranchSelected = true;
	            			$scope.checkSchoolDistBEN(groupIndex, memberIndex, 'schoolDistrictNumber');
	            		}
	            		else {
	            			member.schoolDistrictNumber = null;
	            			errorService.discountCalculation.removeError(groupIndex, memberIndex, 'schoolDistrictNumber');
	            			group.mainBranchSelected = false;
	            			for(var index = 0; index < members.length; index++){
	            				if(members[index].mainBranchInd){
	            					group.mainBranchSelected = true;
	            				}
	            			}
	            		}
	            	}
	            	else if(fieldName == 'schoolDistrictNumber'){
	            		$scope.checkSchoolDistBEN(groupIndex, memberIndex, fieldName);
	            	}
	            	else if(fieldName === 'altDiscountType'){
	            		$scope.updateWorksheetFields(group,member);
	            		$scope.updateStudentCounts(group);
	            	}
	            	else if(fieldName === 'number'){
	            		$scope.handleMemberNumberChange(groupIndex,memberIndex);
	            	}
	            	$scope.handleMemberDataChange(groupIndex, memberIndex);
            	}
            };
            
            $scope.updateWorksheetFields = function(group,member){
            	if((typeof member.altDiscountType != 'undefined') && (member.altDiscountType !== null)){
            		if(member.altDiscountType !== 'CEP' && (member.cepPercent !== null ) ){
            			member.cepPercent = null;
            			member.nslpStudentCount = null;
            		}
            	}
            };

            // Run these at start up
            $scope.options = lookupService.getOptions();

            // Copy the Discount Calculation to the local scope
            dataModifyService.discountCalculation.load($scope.application, $scope);
            errorService.discountCalculation.init();
        }
    ])
    .directive("popoverAddBilledEntityPopup", ["resourceUrlsService",
        function (resourceUrlsService) {
            return {
                restrict: "EA",
                replace: true,
                scope: { title: "@", content: "@", placement: "@", animation: "&", isOpen: "&"},
                templateUrl: resourceUrlsService.getResourceUrls().modify.addBilledEntityPopover
            };
        }
    ])
    .directive("popoverAddBilledEntity", ["$tooltip",
        function ($tooltip) {
            return $tooltip("popoverAddBilledEntity", "popover", "click");
        }
    ])
    .directive("popoverSchoolTypeModifyPopup", ["resourceUrlsService",
        function (resourceUrlsService) {
            return {
                restrict: "EA",
                replace: true,
                scope: { title: "@", content: "@", placement: "@", animation: "&", isOpen: "&"},
                templateUrl: resourceUrlsService.getResourceUrls().modify.schoolTypePopover
            };
        }
    ])
    .directive("popoverSchoolTypeModify", ["$tooltip",
        function ($tooltip) {
            return $tooltip("popoverSchoolTypeModify", "popover", "click");
        }
    ])
    .directive("popoverLibraryTypeModifyPopup", ["resourceUrlsService",
        function (resourceUrlsService) {
            return {
                restrict: "EA",
                replace: true,
                scope: { title: "@", content: "@", placement: "@", animation: "&", isOpen: "&"},
                templateUrl: resourceUrlsService.getResourceUrls().modify.libraryTypePopover
            };
        }
    ])
    .directive("popoverLibraryTypeModify", ["$tooltip",
        function ($tooltip) {
            return $tooltip("popoverLibraryTypeModify", "popover", "click");
        }
    ]);
