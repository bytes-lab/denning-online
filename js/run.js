materialAdmin
    .run(function ($rootScope, Auth, $state){
    	$rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;


            if (toState.data && toState.data.access) {
                /*Cancel going to the authenticated state and go back to landing*/
                if (toState.data.access == '@' && !Auth.isAuthenticated()) {
                    event.preventDefault();
                    return $state.go('login');
                }

                if (toState.data.access == '?' && Auth.isAuthenticated()) {
                    event.preventDefault();
                    return $state.go('home');
                }
            }
        });
    })

    .run(function(formlyConfig) {
        var attributes = [
            'date-disabled',
            'custom-class',
            'show-weeks',
            'starting-day',
            'init-date',
            'min-mode',
            'max-mode',
            'format-day',
            'format-month',
            'format-year',
            'format-day-header',
            'format-day-title',
            'format-month-title',
            'year-range',
            'shortcut-propagation',
            'datepicker-popup',
            'show-button-bar',
            'current-text',
            'clear-text',
            'close-text',
            'close-on-date-selection',
            'datepicker-append-to-body'
        ];

        var bindings = [
            'datepicker-mode',
            'min-date',
            'max-date'
        ];
            
        var ngModelAttrs = {};

        angular.forEach(attributes, function(attr) {
            ngModelAttrs[camelize(attr)] = {attribute: attr};
        });

        angular.forEach(bindings, function(binding) {
            ngModelAttrs[camelize(binding)] = {bound: binding};
        });
            
        function camelize(string) {
            string = string.replace(/[\-_\s]+(.)?/g, function(match, chr) {
                return chr ? chr.toUpperCase() : '';
            });
            // Ensure 1st char is always lowercase
            return string.replace(/^([A-Z])/, function(match, chr) {
                return chr ? chr.toLowerCase() : '';
            });
        }        
            
        // set templates here
        formlyConfig.setType({
            name: 'price_w_currency',
            templateUrl: 'price_w_currency.html'
        });
        
        formlyConfig.setType({
            name: 'group_label',
            templateUrl: 'group_label.html'
        });
        
        formlyConfig.setType({
            name: 'text',
            templateUrl: 'text.html'
        });
        
        // contact attribute
        formlyConfig.setType({
            name: 'contact',
            templateUrl: 'contact.html',
            controller: ['$scope', 'legalFirmService', function ($scope, legalFirmService) {
                $scope.getNumber = function(num) {
                    return new Array(num);   
                }

                $scope.model[$scope.options.key] = [
                {
                  "party": "",
                  "share": ""
                }];

                $scope.solicitor = {};                

                $scope.changeSolicitor = function(item) {
                    $scope.solicitor = item;                    
                }

                $scope.addParty = function() {
                    $scope.model[$scope.options.key].push({
                        "party": "",
                        "share": ""
                    })
                }

                $scope.removeParty = function(idx) {
                    if ($scope.model[$scope.options.key].length > 1)
                        $scope.model[$scope.options.key].splice(idx, 1);
                }

                $scope.contacts = [
                    {
                      id: '654814-54-1514',
                      name: 'Ho Thong Mee'
                    },
                    {
                      id: '463456-63-5235',
                      name: 'Yan Dong Ho'
                    },
                    {
                      id: '760105-26-2540',
                      name: 'Choe Sin Nyom'
                    },
                    {
                      id: '245325-67-9151',
                      name: 'Kim Ju Il'
                    }
                ];

                legalFirmService.getList().then(function(data) {
                    $scope.legalFirms = data;
                    self.dataReady = true;
                });                     
            }]      
        });
        
        // legal firm attribute
        formlyConfig.setType({
            name: 'legalFirm',
            templateUrl: 'legalFirm.html',
            controller: ['$scope', function ($scope) {
                legalFirmService.getList().then(function(data) {
                    $scope.legalFirms = data;
                    self.dataReady = true;
                });                     
            }]      
        });
        
        formlyConfig.setType({
          name: 'datepicker',
          templateUrl:  'datepicker.html',
          wrapper: ['bootstrapLabel', 'bootstrapHasError'],
          defaultOptions: {
            ngModelAttrs: ngModelAttrs,
            templateOptions: {
              datepickerOptions: {
                format: 'MM.dd.yyyy',
                initDate: new Date()
              }
            }
          },
          controller: ['$scope', function ($scope) {
            $scope.datepicker = {};
      
            $scope.datepicker.opened = false;    

            $scope.datepicker.open = function ($event) {
              $scope.datepicker.opened = !$scope.datepicker.opened;
            };
          }]
        });    
    });