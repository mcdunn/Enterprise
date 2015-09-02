'use strict';

/**
 * @ngdoc service
 * @name coreUtils
 * @description
 * # coreUtils
 * Base Utilities Service
 */
angular
    .module('core')
    .service('coreUtils',
        function utils() {
            this.isBlank = function(value) {
                return ((value == null) || (typeof value === 'undefined') || (value.length == 0));
            };

            this.stringFormat = function () {
                var s = arguments[0];
                for (var i = 0; i < arguments.length - 1; i++) {
                    var reg = new RegExp("\\{" + i + "\\}", "gm");
                    s = s.replace(reg, arguments[i + 1]);
                }
                return s;
            };

            this.scrollToImmediately = function(id) {
                var $panel = $('#' + id);
                var newTop = $panel.offset().top;
                $('html, body').animate({
                    scrollTop: newTop
                }, 0);
            };

            this.getFieldId = function(fields) {
                var id = "";
                for (var i = 0; i < fields.length; i++) {
                    var field = fields[i];
                    id += field + "_";
                }
                return id;
            }
        }
    );