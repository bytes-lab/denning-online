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
                "label": "Generate Document",
                "groups": [
                    {
                        "key": "gen-docs-group",
                        "label": "Template",
                        "attrs": [
                            {
                                "key": "template",
                                "type": "gen-doc"
                            }
                        ]
                    }
                ]
            },
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

        // function definition
        function onSubmit() {
          alert(JSON.stringify(vm.model), null, 2);
        }
    });
