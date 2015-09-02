'use strict';

/**
 * @ngdoc service
 * @name coreDataService
 * @description
 * # coreDataService
 * Base Data Service
 */
angular
    .module('core')
    .service('coreDataService',
        function dataService() {
            this.objects = null;

            this.init = function() {
                this.objects = null;
            };

            this.setObjects = function(objects) {
                this.objects = objects;
                this.resetIndices();
            };

            this.appendObject = function(object) {
                if (!this.objects) {
                    this.objects = [];
                }
                this.objects.push(object);
                object.index = this.objects.indexOf(object);
            };

            this.insertObject = function(object, index) {
                if (!this.objects) {
                    this.objects = [];
                }
                this.objects.splice(index, 0, object);
                this.resetIndices();
            };

            this.replaceObject = function(object) {
                if (this.objects) {
                    this.objects[object.index] = object;
                }
            };

            this.removeObject = function(object) {
                if (this.objects) {
                    this.objects.splice(object.index, 1);
                    this.resetIndices();
                }
            };

            this.resetIndices = function() {
                if (this.objects) {
                    for (var i = 0; i < this.objects.length; i++) {
                        this.objects[i].index = i;
                    }
                }
            }
        }
    );