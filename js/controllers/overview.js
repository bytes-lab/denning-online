materialAdmin
  .controller('overviewCtrl', function($scope, $stateParams, fileMatterService, contactService, $state, matterFormService, Auth) {
    var vm = this;
    vm.idxTab = 0;
    vm.tabs = [
      {
        "title": "Matter Overview",
        "sections": [
          {
            "title": "File Info",
            "widgets": [
              {
                "type": "widget1",
                "templateOptions": {
                  "position": [2, 3], 
                  "num_matters": 3,
                }
              },
              {
                "type": "widget2",
                "templateOptions": {
                  "position": [1, 1], 
                  "num_matters": 3, 
                }
              }
            ]
          },
          {
            "title": "File Info",
            "widgets": [
              {
                "type": "widget6",
                "templateOptions": {
                  "position": [2, 3], 
                  "num_matters": 3,
                }
              },
              {
                "type": "widget7",
                "templateOptions": {
                  "position": [1, 1], 
                  "num_matters": 3, 
                }
              },
              {
                "type": "widget8",
                "templateOptions": {
                  "position": [1, 1], 
                  "num_matters": 3, 
                }
              },
              {
                "type": "widget9",
                "templateOptions": {
                  "position": [1, 1], 
                  "num_matters": 3, 
                }
              }
            ]
          }
        ]
      },
      {
        "title": "Todolist Overview",
        "sections": [
          {
            "title": "File Info",
            "widgets": [
              {
                "type": "widget1",
                "templateOptions": {
                  "position": [2, 3], 
                  "num_matters": 3,
                }
              },
              {
                "type": "widget2",
                "templateOptions": {
                  "position": [1, 1], 
                  "num_matters": 3, 
                }
              },
              {
                "type": "widget3",
                "templateOptions": {
                  "position": [1, 1], 
                  "num_matters": 3, 
                }
              }
            ]
          },
          {
            "title": "Contact Info",
            "widgets": [
              {
                "type": "widget5",
                "templateOptions": {
                  "position": [2, 3], 
                  "num_matters": 3,
                }
              },
              {
                "type": "widget4",
                "templateOptions": {
                  "position": [3, 3], 
                  "num_matters": 3, 
                }
              }
            ]
          }
        ]
      }
    ]

    vm.deleteTab = function (idx) {
      vm.tabs.splice(idx, 1);
      vm.idxTab = idx -1;
      vm.saveOverview();
    }

    vm.newTab = function () {
      vm.tabs.push({
        'title': 'New Tab',
        'sections': []
      })

      vm.saveOverview();
    }

    vm.editTab = function (idx) {
      angular.element('.tab-title-'+idx).attr('contenteditable', true);
    }

    vm.finishEdit = function (idx) {
      angular.element('.tab-title-'+idx).attr('contenteditable', false); 
    }

    vm.editTitle = function (event, idx) {
      if (event.which == 13) {
        event.stopPropagation();
        vm.finishEdit(idx);
      }
    }

    vm.saveOverview = function () {
      // save vm.tabs
    }
  })
