'use strict';

angular
    .module('discountCalculationValidationService', ['errorService'])
    .service('discountCalculationValidationService',
    function validationService(errorService) {
    	/*
    	 * BEGIN Member validation functions
    	 */
    	this.isEntityActive = function (billedEntity) {
    		return billedEntity.status === "Active";
    	};
    	
    	this.isURStatusValid = function (billedEntity) {
    		return billedEntity.urbanRuralInd === 'U' || billedEntity.urbanRuralInd === 'R';
    	};
    	
    	this.validateDuplicateMemberNumbers = function (discountCalculation) {
            errorService.discountCalculation.removeErrorsByType(
                    errorService.discountCalculation.types.ENTITY_NUMBER_DUPLICATE);

            // Recalculate all duplicate entity errors
            var memberNumberMap = {};
            for (var i = 0; i < discountCalculation.groups.length; i++) {
            	if (!discountCalculation.removedGroupMap[i]) {
	                for (var j = 0; j < discountCalculation.groups[i].members.length; j++) {
	                    var member = discountCalculation.groups[i].members[j];
	                    if (!discountCalculation.groups[i].removedMemberMap[j]) {
	                        var memberFromMap = memberNumberMap[member.number];
	                        var memberIndex = {'groupIndex': i, 'memberIndex': j};
	                        if (memberFromMap) {
	                        	memberFromMap.push(memberIndex);
	                        }
	                        else {
	                            memberNumberMap[member.number] = [{'groupIndex': i, 'memberIndex': j}];
	                        }
	                    }
	                }
            	}
            }
            
            // File all duplicate entity errors
            for (var memberNumber in memberNumberMap) {
            	var list = memberNumberMap[memberNumber];
            	// If the list for any BEN consists of more than 1 entity, we have a duplicate
            	if (list.length > 1) {
                	for (var i in list) {
                		var member = list[i];
                		errorService.discountCalculation.addError(member.groupIndex, member.memberIndex, 'number',
                				errorService.discountCalculation.types.ENTITY_NUMBER_DUPLICATE, memberNumber);
                	}
                }
            }
    	};

    	this.validateChangedMemberNumber = function(discountCalculation, groupIndex, memberIndex, astars) {
    		this.validateDuplicateMemberNumbers(discountCalculation);
    		
    		var member = discountCalculation.groups[groupIndex].members[memberIndex];
    		
    		errorService.discountCalculation.removeError(groupIndex, memberIndex, 'number');
    		if (member.number == null || member.number == "") {
    			errorService.discountCalculation.addError(groupIndex, memberIndex, 'number',
    					errorService.discountCalculation.types.ENTITY_NUMBER_MISSING, member.number);
    		}
    		// Check active status
    		else if (!astars && !this.isEntityActive(member)) {
    			errorService.discountCalculation.addError(groupIndex, memberIndex, 'number',
    					errorService.discountCalculation.types.ENTITY_INACTIVE, member.number);
    		}
    		
    		this.validateChangedMemberData(discountCalculation, groupIndex, memberIndex);
    	};
    	
    	this.validateChangedMemberData = function(discountCalculation, groupIndex, memberIndex) {
    		var group = discountCalculation.groups[groupIndex];
			var members = group.members;
    		var member = members[memberIndex];
    		var studentCountNan = false;
    		var fundingCat = discountCalculation.fundingRequestCategory;
    		
    		if(members){
    			errorService.discountCalculation.removeError(groupIndex, null, null,
    					errorService.discountCalculation.types.NO_ENTITIES);
    		}
    		
    		// Check UR status
    		errorService.discountCalculation.removeError(groupIndex, memberIndex, 'urbanRuralInd');
    		if (member.nifInd === false) {
    			if(member.urbanRuralInd == null || member.urbanRuralInd == undefined){
    				errorService.discountCalculation.addError(groupIndex, memberIndex, 'urbanRuralInd',
            				errorService.discountCalculation.types.URBAN_RURAL_STATUS_MISSING, member.urbanRuralInd);
    			}
    			else if(!this.isURStatusValid(member)){
    				// Always display the error as '?' since all non-UR statuses appear as '?'
        			errorService.discountCalculation.addError(groupIndex, memberIndex, 'urbanRuralInd',
            				errorService.discountCalculation.types.URBAN_RURAL_STATUS_INVALID, member.urbanRuralInd);
    			}
    		}
    		
    		// Check NIF Indicator
    		errorService.discountCalculation.removeError(groupIndex, memberIndex, 'nifInd',
    				errorService.discountCalculation.types.NIF_IND_MISSING);
    		if (member.nifInd == null) {
    			errorService.discountCalculation.addError(groupIndex, memberIndex, 'nifInd',
    					errorService.discountCalculation.types.NIF_IND_MISSING, member.nifInd);
    		}else if(!member.nifInd){
    			errorService.discountCalculation.removeError(groupIndex, null, 'nifInd',
        				errorService.discountCalculation.types.ALL_ENTITIES_NIF, member.nifInd);
    		}
    		
    		if (group.isSchool) {
    			// Check student count
    			errorService.discountCalculation.removeError(groupIndex, memberIndex, 'studentCount');
    			if (fundingCat == '2' && member.nifInd !== true) {
    				if (member.studentCount == null || member.studentCount == "") {
	    				errorService.discountCalculation.addError(groupIndex, memberIndex, 'studentCount',
	    						errorService.discountCalculation.types.STUDENT_COUNT_MISSING, member.studentCount);
	    			}
    				else if (isNaN(member.studentCount)) {
    					errorService.discountCalculation.addError(groupIndex, memberIndex, 'studentCount',
    							errorService.discountCalculation.types.STUDENT_COUNT_INCORRECT, member.studentCount);
    					studentCountNan = true;
    				}
    				else if (member.studentCount <= 0) {
    					errorService.discountCalculation.addError(groupIndex, memberIndex, 'studentCount',
    							errorService.discountCalculation.types.STUDENT_COUNT_INCORRECT, member.studentCount);
    				}
    			}
    			
    			errorService.discountCalculation.removeError(groupIndex, memberIndex, 'ncesCode');
    			if((member.ncesCode) && (!member.ncesCode.match(/^[0-9a-zA-Z-]+$/))){
    				errorService.discountCalculation.addError(groupIndex, memberIndex, 'ncesCode',
							errorService.discountCalculation.types.NCESCODE_INVALID, member.ncesCode);
    			}
    		}
    		
    		if (group.isLibrary) {
    			errorService.discountCalculation.removeError(groupIndex, memberIndex, 'fcscCode');
    			if ((member.fcscCode) && (!member.fcscCode.match(/^[0-9a-zA-Z-]+$/))) {
    				errorService.discountCalculation.addError(groupIndex, memberIndex, 'fcscCode',
							errorService.discountCalculation.types.FCSCCODE_INVALID, member.ncesCode);
    			}
    			
    			errorService.discountCalculation.removeError(groupIndex, null, 'mainBranchInd');
    			var mainBranchCount = 0;
    			for (var index = 0; index < members.length; index++) {
    				if (members[index].mainBranchInd == true && !group.removedMemberMap[index]) {
    					mainBranchCount++;
    				}
    			}
    			if (mainBranchCount == 0) {
					errorService.discountCalculation.addError(groupIndex, null, 'mainBranchInd',
        					errorService.discountCalculation.types.MAIN_BRANCH_MISSING);
				}
                else if(mainBranchCount > 1) {
					errorService.discountCalculation.addError(groupIndex, null, 'mainBranchInd',
        					errorService.discountCalculation.types.MULTIPLE_MAIN_BRANCHES);
				}
    			
    			errorService.discountCalculation.removeError(groupIndex, memberIndex, 'totalSquareFootage');
				if (fundingCat == '2' && !member.nifInd) {
    				// Check square footage
    				if (member.totalSquareFootage == null || member.totalSquareFootage == "") {
    					errorService.discountCalculation.addError(groupIndex, memberIndex, 'totalSquareFootage',
    							errorService.discountCalculation.types.SQUARE_FOOTAGE_MISSING, member.totalSquareFootage);
    				}
    				else if (isNaN(member.totalSquareFootage)) {
    					errorService.discountCalculation.addError(groupIndex, memberIndex, 'totalSquareFootage',
    							errorService.discountCalculation.types.SQUARE_FOOTAGE_INCORRECT, member.totalSquareFootage);
    				}
    				else if (member.totalSquareFootage <= 0) {
    					errorService.discountCalculation.addError(groupIndex, memberIndex, 'totalSquareFootage',
    							errorService.discountCalculation.types.SQUARE_FOOTAGE_INCORRECT, member.totalSquareFootage);
    				}
    			}
    		}
    		
    		// Check the worksheet fields
    		// Clear all worksheet errors first
    		errorService.discountCalculation.removeError(groupIndex, memberIndex, 'eligibleStudentCount');
    		errorService.discountCalculation.removeError(groupIndex, memberIndex, 'cepPercent');
    		errorService.discountCalculation.removeError(groupIndex, memberIndex, 'nslpStudentCount');
    		if (group.showWorksheet && !member.nifInd) {
    			// If the worksheet exists, more rules apply:
    			
    			// Validate the eligible student count
    			if (member.eligibleStudentCount == null || member.eligibleStudentCount == "") {
    				errorService.discountCalculation.addError(groupIndex, memberIndex, 'eligibleStudentCount',
    						errorService.discountCalculation.types.ELIGIBLE_STUDENT_COUNT_MISSING, member.eligibleStudentCount);
    			}
    			else {
    				if(fundingCat == '2'){
    					if (isNaN(member.eligibleStudentCount)) {
    	    				errorService.discountCalculation.addError(groupIndex, memberIndex, 'eligibleStudentCount',
    	    						errorService.discountCalculation.types.ELIGIBLE_STUDENT_COUNT_INCORRECT, member.eligibleStudentCount);
    	    			}
    					else if (member.eligibleStudentCount <= 0 || member.eligibleStudentCount > Number(member.studentCount)) {
    						errorService.discountCalculation.addError(groupIndex, memberIndex, 'eligibleStudentCount',
            						errorService.discountCalculation.types.ELIGIBLE_STUDENT_COUNT_INCORRECT, member.eligibleStudentCount);
    	    			}
    				}
    				else{
    					if (isNaN(member.eligibleStudentCount)) {
    	    				errorService.discountCalculation.addError(groupIndex, memberIndex, 'eligibleStudentCount',
    	    						errorService.discountCalculation.types.ELIGIBLE_STUDENT_COUNT_INVALID, member.eligibleStudentCount);
    	    			}
    					else if (member.eligibleStudentCount <= 0) {
    						errorService.discountCalculation.addError(groupIndex, memberIndex, 'eligibleStudentCount',
            						errorService.discountCalculation.types.ELIGIBLE_STUDENT_COUNT_INVALID, member.eligibleStudentCount);
    	    			}
    				}
    			}
    			
    			// Validate the CEP Percent or NSLP student count
    			if (member.altDiscountType === "CEP") {
    				if (member.cepPercent == null || member.cepPercent == "") {
        				errorService.discountCalculation.addError(groupIndex, memberIndex, 'cepPercent',
        						errorService.discountCalculation.types.CEP_PERCENT_MISSING, member.cepPercent);
    				}
    				else if (isNaN(member.cepPercent)) {
        				errorService.discountCalculation.addError(groupIndex, memberIndex, 'cepPercent',
        						errorService.discountCalculation.types.CEP_PERCENT_INCORRECT, member.cepPercent);
    				}
    				else if (member.cepPercent < 40 || member.cepPercent > 100) {
        				errorService.discountCalculation.addError(groupIndex, memberIndex, 'cepPercent',
        						errorService.discountCalculation.types.CEP_PERCENT_INCORRECT, member.cepPercent);
    				}
    			}
    			else {
    				if (member.nslpStudentCount == null || member.nslpStudentCount == "") {
        				errorService.discountCalculation.addError(groupIndex, memberIndex, 'nslpStudentCount',
        						errorService.discountCalculation.types.NSLP_STUDENT_COUNT_MISSING, member.nslpStudentCount);
    				}
    				else if (isNaN(member.nslpStudentCount)) {
        				errorService.discountCalculation.addError(groupIndex, memberIndex, 'nslpStudentCount',
        						errorService.discountCalculation.types.NSLP_STUDENT_COUNT_INCORRECT, member.nslpStudentCount);
    				}
    				else if (member.nslpStudentCount < 0 || member.nslpStudentCount > Number(member.eligibleStudentCount)) {
        				errorService.discountCalculation.addError(groupIndex, memberIndex, 'nslpStudentCount',
        						errorService.discountCalculation.types.NSLP_STUDENT_COUNT_INCORRECT, member.nslpStudentCount);
    				}
    			}
    		}
    		
	    	errorService.discountCalculation.removeError(groupIndex, null, 'numStudents');
	    	errorService.discountCalculation.removeError(groupIndex, null, 'numStudentsNSLP');
    		if(!group.showWorksheet){
    			//Validate Discount Rate Calculation
	    		var numStudents = group.overallDiscounts.numStudents;
	    		var numStudentsNSLP = group.overallDiscounts.numStudentsNSLP;
	    		
	    		//Validate Total Number of Student Enrolled in District
	    		if (numStudents == null || numStudents === "") {
	    			errorService.discountCalculation.addError(groupIndex, null, 'numStudents',
	    					errorService.discountCalculation.types.TOTAL_STUDENT_ENROLLED_MISSING, numStudents);
	    		}
	    		else if (isNaN(numStudents)) {
	    			errorService.discountCalculation.addError(groupIndex, null, 'numStudents',
	    					errorService.discountCalculation.types.TOTAL_STUDENT_ENROLLED_INVALID, numStudents);
	    		}
	    		else if (numStudents <= 0) {
	    				errorService.discountCalculation.addError(groupIndex, null, 'numStudents',
	    						errorService.discountCalculation.types.TOTAL_STUDENT_ENROLLED_INVALID, numStudents);
	    		}
	    		else{
	    			if(group.isSchool && fundingCat == '2'){
	        			var totalStuNum = 0;
	        			for(var index = 0; index < members.length; index++){
	        				if(!group.removedMemberMap[index]){
	        					totalStuNum += members[index].studentCount;
	        				}
	        			}
	        			
	        			if (Number(numStudents) > totalStuNum) {
	        				errorService.discountCalculation.addError(groupIndex, null, 'numStudents',
	        						errorService.discountCalculation.types.TOTAL_STUDENT_ENROLLED_INCORRECT, numStudents);
	        			}
	        		}
	    		}
	    		
	    		//Validate Total Number of Student in District Eligible for NSLP
	    		if (numStudentsNSLP == null || numStudentsNSLP === "") {
					errorService.discountCalculation.addError(groupIndex, null, 'numStudentsNSLP',
							errorService.discountCalculation.types.TOTAL_STUDENT_NSLP_MISSING, numStudentsNSLP);
				}
				else if (isNaN(numStudentsNSLP)) {
					errorService.discountCalculation.addError(groupIndex, null, 'numStudentsNSLP',
							errorService.discountCalculation.types.TOTAL_STUDENT_NSLP_INVALID, numStudentsNSLP);
				}
				else if (numStudentsNSLP < 0 || Number(numStudentsNSLP) > Number(numStudents)) {
					errorService.discountCalculation.addError(groupIndex, null, 'numStudentsNSLP',
							errorService.discountCalculation.types.TOTAL_STUDENT_NSLP_INCORRECT, numStudentsNSLP);
				}
    		}
    	};
    	
    	/*
    	 * END Member validation functions
    	 */
    	
    	/*
    	 * BEGIN Group validation functions
    	 */
        this.validateNewBilledEntity = function(discountCalculation, billedEntity, astars) {
        	// Active entity check
            if (!astars && !this.isEntityActive(billedEntity)) {
                billedEntity.error = errorService.discountCalculation.types["INACTIVE_BILLED_ENTITY"];
            }
            // Check for duplicate groups
            for (var i = 0; i < discountCalculation.groups.length; i++) {
                if ((discountCalculation.groups[i].number == billedEntity.number) &&
                    !discountCalculation.removedGroupMap[i]) {
                    billedEntity.error = errorService.discountCalculation.types["ENTITY_NUMBER_DUPLICATE"];
                    break;
                }
            }
        };
        
        this.validateBENChange = function(discountCalculation, billedEntity, groupIndex, astars){
        	errorService.discountCalculation.removeError(groupIndex);
        	errorService.discountCalculation.removeErrorsByType(errorService.discountCalculation.types.ENTITY_NUMBER_DUPLICATE);
        	
        	if (billedEntity.number == null || billedEntity.number == "") {
    			errorService.discountCalculation.addError(groupIndex, null, 'number',
    					errorService.discountCalculation.types.ENTITY_NUMBER_MISSING, billedEntity.number);
    					billedEntity.name = null;
    		}
        	else if (!astars && !this.isEntityActive(billedEntity)) {
                errorService.discountCalculation.addError(groupIndex, null, 'number',
    					errorService.discountCalculation.types.INACTIVE_BILLED_ENTITY, billedEntity.number);
                		billedEntity.name = null;
            }
        	
        	for (var i = 0; i < discountCalculation.groups.length; i++) {
                if ((i != groupIndex)
                	 &&	(discountCalculation.groups[i].number == billedEntity.number)
                	 && (!discountCalculation.removedGroupMap[i])) {
	                	errorService.discountCalculation.addError(groupIndex, null, 'number',
	        					errorService.discountCalculation.types.ENTITY_NUMBER_DUPLICATE, billedEntity.number);
	                	billedEntity.name = null;
	                    break;
                }
            }
        };
		/*
		 * END Group validation functions
		 */
    }
);