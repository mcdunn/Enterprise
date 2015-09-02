'use strict';

/**
 * @ngdoc service
 * @name form471View.restService
 * @description
 * # restService
 * Service in the form471View. Could we make this thinner to when we make an acutal reset service we can save more code?
 */
angular.module('form471ModifyRestService', [])
    .service('form471ModifyRestService',
        function modifyRestService($http, $q, restConfigService) {
        String.format = function () {
            var s = arguments[0];
            for (var i = 0; i < arguments.length - 1; i++) {
                var reg = new RegExp("\\{" + i + "\\}", "gm");
                s = s.replace(reg, arguments[i + 1]);
            }

            return s;
        };

        // AngularJS will instantiate a singleton by calling "new" on this function
        var urlConfiguration = restConfigService.modifyRestConfigService.getUrlConfiguration();

        this.getBilledEntity = function(billedEntityNumber) {
            var deferred = $q.defer();
            if ((billedEntityNumber != 0) && (!billedEntityNumber)) {
                deferred.reject();
                return deferred.promise;
            }
            $http.get(String.format(urlConfiguration.billedEntityRetrieve, billedEntityNumber))
                .success(
                    function (fromServerSide) {
                        deferred.resolve(fromServerSide);
                    }
                )
                .error(function (data, code) {
                    deferred.reject(code);
                });
            return deferred.promise;
        };

        this.getConsultant = function(consultantNumber) {
            var deferred = $q.defer();
            if ((consultantNumber != 0) && (!consultantNumber)) {
                deferred.reject();
                return deferred.promise;
            }
            $http.get(String.format(urlConfiguration.consultantRetrieve, consultantNumber))
                .success(
                    function (fromServerSide) {
                        deferred.resolve(fromServerSide);
                    }
                )
                .error(function (data, code) {
                    deferred.reject(code);
                });
            return deferred.promise;
        };       
        
        this.getFundingRequest = function (applicationNumber, fundingRequestId, version) {
            var deferred = $q.defer();
            var serviceUrl = String.format(urlConfiguration.fundingRequestRetrieve,
                applicationNumber, fundingRequestId, version);

            $http({
                method: 'GET',
                url: serviceUrl,
                responseType: 'json'
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject({error: "There was an error retrieving the Funding Request information."});
            });

            return deferred.promise;
        };
        
        this.retrieveBlock4Entities = function(applicationNumber){
            var deferred = $q.defer();
            var serviceUrl = String.format(urlConfiguration.block4EntitiesRetrieval, applicationNumber);

            $http({
                method: 'GET',
                url: serviceUrl,
                responseType: 'json'
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject({error: "There was an error retrieving Block4 Entities."});
            });

            return deferred.promise;	
        };
        
       
        this.getWindowStatus = function(){
            var deferred = $q.defer();
            //according to http://dygraphs.com/date-formats.html the best date format is 2009/07/12 12:34:56
            $http.get(urlConfiguration.windowStatus).success(function(data){
                //data.windowOpenDate = "2014/12/16 16:46:00";//for testing
                //data.windowCloseDate = "2015/01/22 09:05:00";//for testing
                //data.windowHardCloseDate = "2015/02/01 16:46:00";//for testing
                //windowOpenDate=2014/07/01 00:00:00
                //needs to be un UTC format http://stackoverflow.com/questions/5619202/converting-string-to-date-in-js
                //'2011-04-11T10:20:30Z'
                var dateFields = ["windowCloseDate","windowHardCloseDate","windowOpenDate"]
                //convert string from easter to UTC then to date
                _.each(dateFields, function(dateField){
                    //var dateString =  data[dateField].replace(' ','T').replace(/\//g,'-')+'Z';
                    var dateString =  data[dateField];
                    var date = new Date(dateString);
                    //var timezoneoffset = date.getTimezoneOffset();
                    //date.setMinutes(date.getMinutes()+timezoneoffset);//DST begins March 8 2015 and ends November 1 2015.
                    //Dates < March 8 or > November 1 would be +5
                    data[dateField] = date;
                });

                data.isOpen = function(currentDate){
                    if(data.fundingYear==2014){
                        return false;//approximat not open
                    }
                    if(!currentDate){
                        currentDate=new Date();
                    }
                    if(data.windowOpenDate<=currentDate){
                        return true;//this probably won't happen because if it's not open the API is returning the previous year
                    }
                    return false;
                }
                //should check hardClose first!
                data.isSoftClose = function(currentDate){
                    if(data.fundingYear==2014){
                        return false;
                    }
                    if(!currentDate){
                        currentDate=new Date();
                    }
                    if(data.windowCloseDate<=currentDate){
                        return true;
                    }
                    return false;
                }

                data.isHardClose = function(currentDate){
                    if(data.fundingYear==2014){
                        return false;
                    }
                    if(!currentDate){
                        currentDate=new Date();
                    }
                    if(data.windowHardCloseDate<=currentDate){
                        return true;
                    }
                    return false;
                }


                deferred.resolve(data);
            }).error(function(data, status, headers, config){
                deferred.reject(data);
            })
            return deferred.promise;
        }
        
        this.lookupFunctionTypes = function(fundingYear){
            var deferred = $q.defer();
            var serviceUrl = String.format(urlConfiguration.lookupFunctionTypesURL, fundingYear);
            
            $http({
                method: 'GET',
                url: serviceUrl,
                responseType: 'json'
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject({error: "There was an error retrieving function types."});
            });
            return deferred.promise;
        };
        

        this.makeLookup = function(){
            var deferred = $q.defer();
            var serviceUrl = String.format(urlConfiguration.makeLookupURL);
            
            $http({
                method: 'GET',
                url: serviceUrl,
                responseType: 'json'
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject({error: "There was an error retrieving makes."});
            });
            return deferred.promise;
        };

        
            // TODO: finish this...        
            this.saveBasicInformation = function(applicationNumber, basicInformation) {
                var deferred = $q.defer();
                $http.post(String.format(urlConfiguration.basicInformationSave, applicationNumber), basicInformation)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            };

            this.saveDiscountCalculation = function(applicationNumber, discountCalculation) {
                var deferred = $q.defer();
                $http.post(String.format(urlConfiguration.discountCalculationSave, applicationNumber), discountCalculation)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            };
            
            this.saveFundingRequest = function(applicationNumber, fundingRequest) {
                var deferred = $q.defer();
                $http.post(String.format(urlConfiguration.fundingRequestSave, applicationNumber, fundingRequest.keyInformation.fundingRequestNumber), fundingRequest)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            };
            
            this.saveNewFundingRequest = function(applicationNumber, fundingRequest) {
                var deferred = $q.defer();
                $http.post(String.format(urlConfiguration.fundingRequestSaveNewFRN, applicationNumber), fundingRequest)
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            };
            
            
            
            this.getFundingRequestLimitedDetail = function(fundingRequestNumber){
            	var deferred = $q.defer();
                var serviceUrl = String.format(urlConfiguration.fundingRequestLimitedDetailRetrieve, fundingRequestNumber);

                $http({
                    method: 'GET',
                    url: serviceUrl,
                    responseType: 'json'
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject({error: "There was an error retrieving the Funding Request."});
                });

                return deferred.promise;
            };
            this.getServiceProvider = function (serviceProviderId) {
                var deferred = $q.defer();
                var serviceUrl = String.format(urlConfiguration.serviceProviderLookup, serviceProviderId);

                $http({
                    method: 'GET',
                    url: serviceUrl,
                    responseType: 'json'
                }).success(function (data, status, headers, config) {
                    deferred.resolve(data);
                }).error(function (data, status, headers, config) {
                    if (status == 404) {
                        deferred.reject({error: "The Service Provider with SPIN " + serviceProviderId + " could not be found."});
                    } else {
                        deferred.reject({error: "There was an error retrieving the Service Provider information."});
                    }
                });

                return deferred.promise;
            };
            
            this.getForm470Detail = function(form470Number){
            	var deferred = $q.defer();
                var serviceUrl = String.format(urlConfiguration.form470LimitedDetailsLookup, form470Number);

                $http({
                    method: 'GET',
                    url: serviceUrl,
                    responseType: 'json'
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject({error: "There was an error retrieving the Form 470."});
                });

                return deferred.promise;
            };
    });