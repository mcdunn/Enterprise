'use strict';

angular.module("moPagination", [])
    .constant('moPaginationConfig', {
        page:1,
        pageSize:10
    })
    .service('moPaginationService', [
        function() {
            this.paginationStates = {};
            this.showRow = function(id, row) {
                var paginationState = this.paginationStates[id];
                if (paginationState) {
                    this.setPage(id, Math.floor(row / paginationState.pageSize) + 1);
                }
            };
            this.setPage = function(id, page) {
                var paginationState = this.paginationStates[id];
                if (paginationState) {
                    // Validate page before setting
                    if (isNaN(page)) {
                        return;
                    }
                    page = Math.floor(page);
                    if (page > paginationState.numPages) {
                        page = paginationState.numPages;
                    }
                    if (page < 1 ) {
                        page = 1;
                    }
                    paginationState.page = page;
                }
            }
        }
    ])
    .filter('moPaginationFilter', ['moPaginationService',
        function(moPaginationService) {
            return function(input, paginationId) {
                var paginationState = moPaginationService.paginationStates[paginationId];
                var page = +paginationState.page;
                var pageSize = +paginationState.pageSize;
                var numPages = Math.ceil(input.length / pageSize);
                paginationState.numPages = numPages;
                if (page > numPages) {
                    page = numPages;
                    paginationState.page = page;
                }
                var index = +((page - 1) * pageSize);
                return input.slice(index, (index + pageSize));
            };
        }
    ])
    .directive('moPagination', ['moPaginationService', 'moPaginationConfig',
        function(moPaginationService, moPaginationConfig) {
            return {
                restrict: 'EA',
                scope: {
                    page: '@',
                    pageSize: '@'
                },
                link: function(scope, element, attrs, ctrl) {
                    var paginationId = attrs.moPagination;
                    if ((scope.page == null) || (typeof scope.page === 'undefined')) {
                        scope.page = moPaginationConfig.page;
                    }
                    if ((scope.pageSize == null) || (typeof scope.pageSize === 'undefined')) {
                        scope.pageSize = moPaginationConfig.pageSize;
                    }
                    var paginationState = moPaginationService.paginationStates[paginationId];
                    if (!paginationState) {
                        moPaginationService.paginationStates[paginationId] = {};
                        paginationState = moPaginationService.paginationStates[paginationId];
                    }
                    paginationState.page = scope.page;
                    paginationState.pageSize = scope.pageSize;
                    paginationState.numPages = 1;
                }
            }
        }
    ])
    .directive('moPaginationControls', ['moPaginationService', 'moPaginationConfig',
        function(moPaginationService, moPaginationConfig) {
            return {
                restrict: 'EA',
                scope: {
                    moPaginationTemplateUrl: '=',
                    moPaginationTemplate: '@',
                    templateArgs: '@',
                    selectPage: '&'
                },
                template: function(element, attrs) {
                    if (attrs.moPaginationTemplate) {
                        return attrs.moPaginationTemplate;
                    }
                    else if (attrs.moPaginationTemplateUrl) {
                        return '<div ng-include="moPaginationTemplateUrl"></div>';
                    }
                },
                link: function(scope, element, attrs, ctrl) {
                    scope.paginationId = attrs.moPaginationControls;
                    scope.paginationState = moPaginationService.paginationStates[scope.paginationId];
                    scope.templateArgs = angular.fromJson(scope.templateArgs);
                    scope.templateArgs.whatever = "whatever";
                    angular.forEach(scope.templateArgs,
                        function(value, key) {
                            scope[key] = value;
                        }
                    );
                    if (!scope.paginationState) {
                        moPaginationService.paginationStates[scope.paginationId] = {
                            'page':scope.page,
                            'pageSize':scope.pageSize,
                            'numPages':1
                        };
                        scope.paginationState = moPaginationService.paginationStates[scope.paginationId];
                    }

                    scope.numPages = scope.paginationState.numPages;
                    scope.pages = scope.paginationState.pages;
                    scope.selectPage = function(page) {
                        if ((page > 0) && (page <= scope.paginationState.numPages)) {
                            scope.paginationState.page = page;
                            scope.pageNumberInvalid = false;
                        }
                        else {
                            scope.pageNumberInvalid = true;
                        }
                    };
                    scope.nextPage = function() {
                        if (scope.paginationState.page < scope.paginationState.numPages) {
                            scope.paginationState.page++;
                        }
                    };
                    scope.previousPage = function() {
                        if (scope.paginationState.page > 1) {
                            scope.paginationState.page--;
                        }
                    };
                }
            };
        }
    ])
    .directive('moPageSelect', function() {
        return {
            restrict: 'E',
            template: '<input type="text" class="select-page" ng-class="{error:pageNumberInvalid}" ng-model="inputPage" ng-change="selectPage(inputPage)">',
            link: function(scope, element, attrs) {
                scope.$watch('paginationState.page', function(c) {
                    scope.inputPage = c;
                });
            }
        }
    });
