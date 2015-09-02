'use strict';

/**
 * @ngdoc overview
 * @name whatever
 * @description
 * # whatever
 *
 * Main module of the Whatever Management application.
 */
angular
    .module('whatever', [
        'ui.bootstrap',
        'moPagination',
        'core'
    ])
    .config(
        function($httpProvider, moPaginationConfig) {
            $httpProvider.defaults.headers.common.Pragma = 'no-cache';
            moPaginationConfig.pageSize = 10;
            moPaginationConfig.paginationControlTemplateUrl = baseUrl + "/resources/" + "/form471/html/pagination.html";
        }
    );
