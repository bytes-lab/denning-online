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

    vm.permittedWidgets = [
      [
        {
          type: 'widget1',
          title: 'New Matters'
        },
        {
          type: 'widget2',
          title: 'Court Today'
        },
        {
          type: 'widget3',
          title: 'Due Tasks'
        }
      ],
      [
        {
          type: 'widget4',
          title: 'Matter Collection'
        },
        {
          type: 'widget5',
          title: 'File Collection'
        },
        {
          type: 'widget6',
          title: 'File Views'
        },
        {
          type: 'widget7',
          title: 'Email Statistics'
        },
        {
          type: 'widget8',
          title: 'Wheather'
        },
        {
          type: 'widget9',
          title: 'Best Sellings'
        }
      ]
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

    vm.manageWidget = function (tabIdx, secIdx, type) {
      var idx = vm.checkWidget(tabIdx, secIdx, type);
      if (idx > 0) {
        vm.tabs[tabIdx].sections[secIdx].widgets.splice(idx-1, 1)
      } else {
        vm.tabs[tabIdx].sections[secIdx].widgets.push({
          "type": type,
          "templateOptions": {
            "position": [2, 3], 
            "num_matters": 3,
          }
        })
      }
    }

    vm.checkWidget = function (tabIdx, secIdx, type) {
      var flag = -1,
          widgets = vm.tabs[tabIdx].sections[secIdx].widgets;

      for (var i = 0; i < widgets.length; i++) {
        if (widgets[i].type == type) {
          flag = i;
          break;
        }
      }
      return flag+1;
    }

    vm.saveOverview = function () {
      // save vm.tabs
      // filter to.hide == true
    }
  })
