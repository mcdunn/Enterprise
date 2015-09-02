'use strict';


angular
    .module('services', ['manageRecipientsService', 'item21FieldEditingService'])
    .service('services',
        function services(manageRecipientsService, item21FieldEditingService) {
    		this.manageRecipientsService = manageRecipientsService;
            this.item21FieldEditingService = item21FieldEditingService;

        }
    );