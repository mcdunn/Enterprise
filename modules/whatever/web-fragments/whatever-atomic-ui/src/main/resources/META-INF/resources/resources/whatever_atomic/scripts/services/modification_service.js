'use strict';

/**
 * @ngdoc service
 * @name modificationService
 * @description
 * # modificationService
 * Modification Service for Whatever Management
 */
angular
    .module('whatever')
    .service('modificationService',
            ['$timeout', 'dataService', 'validationService', 'coreUtils', 'moPaginationService',
        function modificationService($timeout, dataService, validationService, coreUtils, moPaginationService) {
            this.init = function() {
            };

            this.isAdded = function(whatever) {
                return whatever.added;
            };

            this.isRemoved = function(whatever) {
                return whatever.removed;
            };

            this.isModified = function(whatever, fields) {
                if (whatever.originalData) {
                    if (fields && (fields.length > 0)) {
                        var value1 = whatever.originalData;
                        for (var i = 0; i < fields.length; i++) {
                            value1 = value1[fields[i]];
                        }
                        var value2 = whatever;
                        for (var j = 0; j < fields.length; j++) {
                            value2 = value2[fields[j]];
                        }
                        return value1 != value2;
                    }
                    else {
                        for (var k = 0; k < dataService.fieldList.length; k++) {
                            if (this.isModified(whatever, [dataService.fieldList[k]])) {
                                return true;
                            }
                        }
                    }
                    return false;
                }
            };

            this.getChangedValue = function(whatever, fields) {
                if (whatever.originalData) {
                    var value = whatever.originalData;
                    for (var i = 0; i < fields.length; i++) {
                        value = value[fields[i]];
                    }
                    return value;
                }
                return null;
            };

            this.add = function() {
                var whatever = {'added':true, 'id':'', 'field1':'', 'field2':''};
                dataService.appendObject(whatever);
                moPaginationService.showRow("whatevers", whatever.index);
                var id = "whatever_" + whatever.index + "_field1";
                $timeout(function () {
                    coreUtils.scrollToImmediately(id);
                    // Give the element focus / make it editable
                    $("#" + id).trigger("click");
                    $("#" + id + "_input").trigger("focus");
                }, 500);
                validationService.validate(dataService.data.objects);
            };

            this.remove = function(whatever) {
                whatever.removed = true;
                validationService.validate(dataService.data.objects);
            };

            this.restore = function(whatever) {
                if (whatever.removed) {
                    whatever.removed = false;
                }
                else {
                    for (var i = 0; i < dataService.fieldList.length; i++) {
                        whatever[dataService.fieldList[i][0]] = whatever.originalData[dataService.fieldList[i][0]];
                    }
                }
                validationService.validate(dataService.data.objects);
            };

            this.isEditable = function(whatever, fields) {
                if (whatever.removed) {
                    return false;
                }
                if ((this.itemBeingEdited === whatever) && (fields.length === this.fieldBeingEdited.length)) {
                    for (var i = 0; i < fields.length; i++) {
                        if (fields[i] != this.fieldBeingEdited[i]) {
                            return false;
                        }
                    }
                    return true;
                }
                return false;
            };

            this.isEditingAllowed = function(whatever, fields) {
                if (whatever.removed) {
                    return false;
                }
                if (fields && (fields.length == 1) && (fields[0] === 'id')) {
                    return false;
                }
                return true;
            };

            this.startEdit = function(whatever, fields) {
                if (this.isEditingAllowed(whatever, fields)) {
                    this.itemBeingEdited = whatever;
                    this.fieldBeingEdited = fields;
                    this.handleSpecialEdits(whatever, fields);
                    var id = "whatever_" + whatever.index + "_" + coreUtils.getFieldId(fields) + "input";
                    $timeout(function() {
                        $("#" + id).trigger("focus");
                    }, 100);
                }
                else {
                    this.itemBeingEdited = null;
                    this.fieldBeingEdited = null;
                }
            };

            this.endEdit = function(whatever) {
                if (!whatever || (this.itemBeingEdited === whatever)) {
                    this.itemBeingEdited = null;
                    this.fieldBeingEdited = null;
                    $timeout(function() {
                        validationService.validate(dataService.data.objects);
                    }, 500);
                }
            };

            this.handleSpecialEdits = function(whatever, fields) {
            };

            this.save = function() {
                validationService.validate(dataService.data.objects);
                dataService.saveObjects(dataService.data.objects);
            };

            this.cancel = function() {
            };

            this.reset = function() {
                dataService.init();
                validationService.validate(dataService.data.objects);
            };
        }
    ]);