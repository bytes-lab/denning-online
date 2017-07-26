materialAdmin
    .controller('matterformEditCtrl', function(formlyVersion, $scope) {
        var vm = this;
        vm.onSubmit = onSubmit;

        // variable assignment
        vm.author = { // optionally fill in your info below :-)
          name: 'Kent C. Dodds',
          url: 'https://twitter.com/kentcdodds' // a link to your twitter/github/blog/whatever
        };
        vm.exampleTitle = 'Introduction';
        vm.env = {
          angularVersion: angular.version.full,
          formlyVersion: formlyVersion
        };

        vm.model = {
          awesome: true
        };
        vm.options = {
          formState: {
            awesomeIsForced: false
          }
        };
        
        vm.tabs = [
            {
                "label": "File Information",
                "groups": [
                    {
                        "key": "vendor-group",
                        "label": "Vendor Information",
                        "attrs": [
                            {
                                "key": "vendor1",
                                "type": "contact",
                                "templateOptions": {
                                    "share": true
                                }
                            },
                            {
                                "key": "vendor-solicitor",
                                "type": "legalFirm",
                                "templateOptions": {
                                    "share": true,
                                    "label": "Vendor's Solicitor"
                                }
                            },
                            {
                                "key": "staff-in-charge",
                                "type": "text",
                                "templateOptions": {
                                    "label": "Staff in charge"
                                }
                            }
                        ]
                    },
                    {
                        "key": "purchaser-group",
                        "label": "Purchaser Information",
                        "attrs": [
                            {
                                "key": "purchaser1",
                                "type": "contact",
                                "templateOptions": {
                                    "share": false
                                }
                            },
                            {
                                "key": "vendor-solicitor",
                                "type": "legalFirm",
                                "templateOptions": {
                                    "share": true,
                                    "label": "Vendor's Solicitor"
                                }
                            },
                            {
                                "key": "staff-in-charge",
                                "type": "text",
                                "templateOptions": {
                                    "label": "Staff in charge"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "label": "Bank Information",
                "groups": [
                    {
                        "key": "loan-group",
                        "label": "Loan Information",
                        "attrs": [
                            {
                                "key": "vendor11",
                                "type": "contact",
                                "templateOptions": {
                                    "share": true,
                                }
                            },                    
                            {
                                "key": "vendor-solicitor",
                                "type": "legalFirm",
                                "templateOptions": {
                                    "share": true,
                                    "label": "Vendor's Solicitor"
                                }
                            },
                            {
                                "key": "staff-in-charge1",
                                "type": "text",
                                "templateOptions": {
                                    "label": "Staff in charge"
                                }
                            }
                        ]
                    }
                ]
            }
        ];
        
        vm.textAreaModel = JSON.stringify(vm.tabs, null, 4);

        $scope.$watch('vm.textAreaModel', function() {
            try {
                vm.tabs = JSON.parse(vm.textAreaModel);
            } catch(exp) {

            }
        });

        vm.fields = [
          {
            key: 'date1',
            type: 'datepicker',
            className: "what",
            templateOptions: {
              label: 'GST Register Date',
              datepickerPopup: 'dd-MMMM-yyyy',
              required: true
            }
          },      
          {
            key: 'nested.story',
            type: 'textarea',
            templateOptions: {
              label: 'Some sweet story',
              placeholder: 'It allows you to build and maintain your forms with the ease of JavaScript :-)',
              description: ''
            },
            expressionProperties: {
              'templateOptions.focus': 'formState.awesomeIsForced',
              'templateOptions.description': function(viewValue, modelValue, scope) {
                if (scope.formState.awesomeIsForced) {
                  return 'And look! This field magically got focus!';
                }
              }
            },
            validators: {
              number: function($viewValue, $modelValue, scope) {
                var value = $viewValue || $modelValue;
                return /^[\d\.]*$/.test(value);
              }
              //noBob: '$viewValue !== "Bob"'
            }        
          },
          {
            key: 'awesome',
            type: 'checkbox',
            templateOptions: { label: '' },
            expressionProperties: {
              'templateOptions.disabled': 'formState.awesomeIsForced',
              'templateOptions.label': function(viewValue, modelValue, scope) {
                if (scope.formState.awesomeIsForced) {
                  return 'Too bad, formly is really awesome...';
                } else {
                  return 'Is formly totally awesome? (uncheck this and see what happens)';
                }
              }
            }
          },
          {
            key: 'whyNot',
            type: 'textarea',
            expressionProperties: {
              'templateOptions.placeholder': function(viewValue, modelValue, scope) {
                if (scope.formState.awesomeIsForced) {
                  return 'Too bad... It really is awesome! Wasn\'t that cool?';
                } else {
                  return 'Type in here... I dare you';
                }
              },
              'templateOptions.disabled': 'formState.awesomeIsForced'
            },
            hideExpression: 'model.awesome',
            templateOptions: {
              label: 'Why Not?',
              placeholder: 'Type in here... I dare you'
            },
            watcher: {
              listener: function(field, newValue, oldValue, formScope, stopWatching) {
                if (newValue) {
                  stopWatching();
                  formScope.model.awesome = true;
                  formScope.model.whyNot = undefined;
                  field.hideExpression = null;
                  formScope.options.formState.awesomeIsForced = true;
                }
              }
            }
          },
          {
            key: 'salary',
            type: 'price_w_currency',
            defaultValue: 1200,
            templateOptions: {
              label: 'Monthly Salary',
            },
            validators: {
              number1: function($viewValue, $modelValue, scope) {
                var value = $viewValue || $modelValue;
                return /d+/.test(value);
              }
            }
          },
          {
            key: 'exampleDirective',
            template: '<div example-directive></div>',
            templateOptions: {
              label: 'Example Directive',
            }
          }
        ];

        // function definition
        function onSubmit() {
          alert(JSON.stringify(vm.model), null, 2);
        }
    });
