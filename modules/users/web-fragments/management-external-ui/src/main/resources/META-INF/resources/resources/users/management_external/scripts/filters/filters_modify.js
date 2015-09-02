angular.module('form471View')
    .filter('serviceType',
        function() {
            return function (input) {
            	//Category-1
                if (input === "TELCOMM SERVICES") {
                    return "Telecommunications Service";
                }
                if (input === "INTERNET ACCESS") {
                    return "Internet Access";
                }
                if (input === "VOICE SERVICES") {
                    return "Voice Services";
                }
               //Category-2
                if (input === "INTERNAL CONNECTIONS MNT") {
                    return "Basic Maintenance of Internal Connections";
                }
                if (input === "INTERNAL CONNECTIONS") {
                    return "Internal Connections";
                }
                if (input === "INTERNAL CONNECTIONS MIBS") {
                    return "Managed Internal Broadband Services";
                }
                return input;
            }
        }
    )
    .filter('purchaseType',
        function() {
            return function (input) {
                if (input === "TARIFF") {
                    return "Tariff";
                }
                if (input === "MONTHLY") {
                    return "Month-to-Month";
                }
                if (input === "CONTRACT") {
                    return "Contract";
                }
                return input;
            }
        }
    )
    .filter('restrictionType',
        function() {
            return function (input) {
                if (input === "STATUTE") {
                    return "State Law or Statute";
                }
                if (input === "LOCAL") {
                    return "Local Rule";
                }
                if (input === "COURT") {
                    return "Court Order";
                }
                if (input === "CONTRACT") {
                    return "Contract Executed with Restrictive Terms";
                }
                return input;
            }
        }
    )
    .filter('customCurrencyZero', ["$filter", function ($filter) {
        return function (amount, currencySymbol) {
            var currency = $filter('currency');

            if (amount < 0) {
                return currency(amount, currencySymbol).replace("(", "-").replace(")", "");
            }
            
            if (isNaN(amount)){
                return amount;
            }

            return currency(amount, currencySymbol);
        };
    }])
    .filter('customCurrencyInvalidBlank', ["$filter", function ($filter) {
        return function (amount, currencySymbol) {
            var currency = $filter('currency');

            if (amount < 0) {
                return currency(amount, currencySymbol).replace("(", "-").replace(")", "");
            }

            if ((amount === null) || (amount === undefined) || (amount === "") || (isNaN(amount))) {
                return amount;
            }
            
            return currency(amount, currencySymbol);
        };
    }])
    .filter('truncatedDisplay',
        function() {
            return function (input) {
            	if(input === null || typeof input === 'undefined'){
            		return null;
            	}
            	else if(input.length > 15){
            		return input.substring(0, 15) + "...";
            	}
            	else return input;
            }
        }
    )
;