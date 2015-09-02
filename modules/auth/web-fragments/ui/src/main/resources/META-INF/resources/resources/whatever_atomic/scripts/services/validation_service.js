'use strict';

/**
 * @ngdoc service
 * @name validationService
 * @description
 * # validationService
 * Validation Service for Whatevers
 */
angular
    .module('whatever')
    .service('validationService',
            ['errorService', 'coreUtils',
        function validationService(errorService, coreUtils) {

            this.validate = function(whatevers) {
                var errors = [];
                for (var i = 0; i < whatevers.length; i++) {
                    errors = errors.concat(this.validateWhatever(whatevers[i]));
                }
                errors = errors.concat(this.validateNoDuplicates(whatevers));
                errorService.setErrors(errors);
            };

            this.validateWhatever = function(whatever) {
                var errors = [];
                if (!whatever.removed) {
                    errors = errors.concat(this.validateField1(whatever));
                    errors = errors.concat(this.validateField2(whatever));
                }
                return errors;
            };

            this.validateField1 = function(whatever) {
                var errors = [];
                if (whatever.removed) {
                    return errors;
                }

                if (coreUtils.isBlank(whatever.field1)) {
                    errors.push(errorService.createError(whatever, ['field1'],
                        errorService.types.MISSING_FIELD1, '*BLANK*'));
                }
                else if (whatever.field1 == whatever.field2) {
                    errors.push(errorService.createError(whatever, ['field1'],
                        errorService.types.INVALID_FIELD1_FIELD2, whatever.field1));
                }
                return errors;
            };

            this.validateField2 = function(whatever) {
                var errors = [];
                if (coreUtils.isBlank(whatever.field2)) {
                    errors.push(errorService.createError(whatever, ['field2'],
                        errorService.types.MISSING_FIELD2, '*BLANK*'));
                }
                else if (whatever.field1 == whatever.field2) {
                    errors.push(errorService.createError(whatever, ['field2'],
                        errorService.types.INVALID_FIELD1_FIELD2,whatever.field2));
                }
                return errors;
            };

            this.validateNoDuplicates = function(whatevers) {
                var errors = [];

                // Use maps of arrays to find all of the duplicate values
                var field1Map = {};
                var field2Map = {};
                for (var i = 0; i < whatevers.length; i++) {
                    var whatever = whatevers[i];
                    if (!whatever.removed) {
                        if (!coreUtils.isBlank(whatever.field1)) {
                            if (typeof field1Map[whatever.field1] == 'undefined') {
                                field1Map[whatever.field1] = [];
                            }
                            field1Map[whatever.field1].push(whatever);
                        }

                        if (!coreUtils.isBlank(whatever.field2)) {
                            if (typeof field2Map[whatever.field2] == 'undefined') {
                                field2Map[whatever.field2] = [];
                            }
                            field2Map[whatever.field2].push(whatever);
                        }
                    }
                }

                // Find all Field1 map entries with arrays with more than 1 item in them: those are duplicates
                for (var key in field1Map) {
                    if (field1Map.hasOwnProperty(key)) {
                        var array = field1Map[key];
                        if (array.length > 1) {
                            for (var i = 0; i < array.length; i++) {
                                errors.push(errorService.createError(array[i], ['field1'],
                                    errorService.types.DUPLICATE_FIELD1, array[i].field1));
                            }
                        }
                    }
                }

                // Find all Field2 map entries with arrays with more than 1 item in them: those are duplicates
                for (var key in field2Map) {
                    if (field2Map.hasOwnProperty(key)) {
                        var array = field2Map[key];
                        if (array.length > 1) {
                            for (var i = 0; i < array.length; i++) {
                                errors.push(errorService.createError(array[i], ['field2'],
                                    errorService.types.DUPLICATE_FIELD2, array[i].field2));
                            }
                        }
                    }
                }

                return errors;
            };
        }
    ]);