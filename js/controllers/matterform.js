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
        "label": "Summary",
      },
      {
        "label": "Matter",
        "groups": [
          {
            "key": "file-info",
            "label": "File Information",
            "attrs": [
              {
                "key": "matter1",
                "type": "file",
                "templateOptions": {
                  "share": true,
                  "solicitor": true,
                  "party": true
                }
              }
            ]
          }
        ]
      },
      {
        "label": "Parties-S",
        "groups": [
          {
            "key": "vendor-group",
            "label": "Party w/ Solicitors Group 1 Information",
            "attrs": [
              {
                "key": "party1",
                "type": "contact",
                "templateOptions": {
                  "share": true,
                  "solicitor": true,
                  "party": true
                }
              }
            ]
          },
          {
            "key": "purchaser-group",
            "label": "Party w/ Solicitors Group 2 Information",
            "attrs": [
              {
                "key": "purchaser1",
                "type": "contact",
                "templateOptions": {
                  "share": false,
                  "solicitor": true,
                  "party": true
                }
              }
            ]
          },
          {
            "key": "vendor-group3",
            "label": "Party w/ Solicitors Group 3 Information",
            "attrs": [
              {
                "key": "party3",
                "type": "contact",
                "templateOptions": {
                  "share": true,
                  "solicitor": true,
                  "party": true
                }
              }
            ]
          },
          {
            "key": "vendor-group4",
            "label": "Party w/ Solicitors Group 4 Information",
            "attrs": [
              {
                "key": "party4",
                "type": "contact",
                "templateOptions": {
                  "share": true,
                  "solicitor": true,
                  "party": true
                }
              }
            ]
          },
          {
            "key": "vendor-group5",
            "label": "Party w/ Solicitors Group 5 Information",
            "attrs": [
              {
                "key": "party5",
                "type": "contact",
                "templateOptions": {
                  "share": true,
                  "solicitor": true,
                  "party": true
                }
              }
            ]
          },
          {
            "key": "vendor-group6",
            "label": "Party w/ Solicitors Group 6 Information",
            "attrs": [
              {
                "key": "party6",
                "type": "contact",
                "templateOptions": {
                  "share": true,
                  "solicitor": true,
                  "party": true
                }
              }
            ]
          },
          {
            "key": "vendor-group7",
            "label": "Party w/ Solicitors Group 7 Information",
            "attrs": [
              {
                "key": "party7",
                "type": "contact",
                "templateOptions": {
                  "share": true,
                  "solicitor": true,
                  "party": true
                }
              }
            ]
          }
        ]
      },
      {
        "label": "Parties",
        "groups": [
          {
            "key": "vendor-group11",
            "label": "Party Group 1 Information",
            "attrs": [
              {
                "key": "party11",
                "type": "contact",
                "templateOptions": {
                  "share": true,
                  "solicitor": false,
                  "party": true
                }
              }
            ]
          },
          {
            "key": "purchaser-group11",
            "label": "Party Group 2 Information",
            "attrs": [
              {
                "key": "purchaser11",
                "type": "contact",
                "templateOptions": {
                  "share": false,
                  "solicitor": false,
                  "party": true
                }
              }
            ]
          },
          {
            "key": "vendor-group31",
            "label": "Party Group 3 Information",
            "attrs": [
              {
                "key": "party31",
                "type": "contact",
                "templateOptions": {
                  "share": true,
                  "solicitor": false,
                  "party": true
                }
              }
            ]
          },
          {
            "key": "vendor-group41",
            "label": "Party Group 4 Information",
            "attrs": [
              {
                "key": "party41",
                "type": "contact",
                "templateOptions": {
                  "share": true,
                  "solicitor": false,
                  "party": true
                }
              }
            ]
          },
          {
            "key": "vendor-group51",
            "label": "Party Group 5 Information",
            "attrs": [
              {
                "key": "party51",
                "type": "contact",
                "templateOptions": {
                  "share": true,
                  "solicitor": false,
                  "party": true
                }
              }
            ]
          },
          {
            "key": "vendor-group61",
            "label": "Party Group 6 Information",
            "attrs": [
              {
                "key": "party61",
                "type": "contact",
                "templateOptions": {
                  "share": true,
                  "solicitor": false,
                  "party": true
                }
              }
            ]
          },
          {
            "key": "vendor-group71",
            "label": "Party Group 7 Information",
            "attrs": [
              {
                "key": "party71",
                "type": "contact",
                "templateOptions": {
                  "share": true,
                  "solicitor": false,
                  "party": true
                }
              }
            ]
          }
        ]
      },
      {
        "label": "Solicitors",
        "groups": [
          {
            "key": "vendor-group111",
            "label": "Solicitors Group 1 Information",
            "attrs": [
              {
                "key": "party12",
                "type": "contact",
                "templateOptions": {
                  "share": true,
                  "solicitor": true,
                  "party": false
                }
              }
            ]
          },
          {
            "key": "purchaser-group111",
            "label": "Solicitors Group 2 Information",
            "attrs": [
              {
                "key": "purchaser12",
                "type": "contact",
                "templateOptions": {
                  "share": false,
                  "solicitor": true,
                  "party": false
                }
              }
            ]
          },
          {
            "key": "vendor-group13",
            "label": "Solicitors Group 3 Information",
            "attrs": [
              {
                "key": "party13",
                "type": "contact",
                "templateOptions": {
                  "share": true,
                  "solicitor": true,
                  "party": false
                }
              }
            ]
          },
          {
            "key": "vendor-group14",
            "label": "Solicitors Group 4 Information",
            "attrs": [
              {
                "key": "party14",
                "type": "contact",
                "templateOptions": {
                  "share": true,
                  "solicitor": true,
                  "party": false
                }
              }
            ]
          }
        ]
      },
      {
        "label": "Case",
        "groups": [
          {
            "key": "case-info",
            "label": "Case Information",
            "attrs": [
              {
                "key": "case1",
                "type": "case"
              }
            ]
          }
        ]
      },
      {
        "label": "Price",
        "groups": [
          {
            "key": "price-info",
            "label": "Price Information",
            "attrs": [
              {
                "key": "price1",
                "type": "price"
              }
            ]
          }
        ]
      },        
      {
        "label": "Loan",
        "groups": [
          {
            "key": "loan-info",
            "label": "Loan Information",
            "attrs": [
              {
                "key": "loan1",
                "type": "loan"
              }
            ]
          },
          {
            "key": "borrower-group",
            "label": "Borrower Information",
            "attrs": [
              {
                "key": "borrower",
                "type": "contact",
                "templateOptions": {
                  "share": true,
                  "solicitor": false,
                  "party": true
                }
              }
            ]
          },
          {
            "key": "guaranter-group",
            "label": "Guaranter Information",
            "attrs": [
              {
                "key": "guaranter",
                "type": "contact",
                "templateOptions": {
                  "share": true,
                  "solicitor": false,
                  "party": true
                }
              }
            ]
          }

        ]
      }, 
      {
        "label": "Property",
      },
      {
        "label": "Bank",
      },
      {
        "label": "$",
      },
      {
        "label": "Date",
      },
      {
        "label": "Text",
      },
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
