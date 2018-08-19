denningOnline
  .controller('overviewCtrl', function (overviewService) {
    var vm = this;
    vm.idxTab = 0;
    vm.today = moment(new Date()).format('ddd, MMM D, YYYY');
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
          title: 'Weather'
        },
        {
          type: 'widget9',
          title: 'Best Sellings'
        }
      ]
    ]

    overviewService.getOverview().then(function (data) {
      vm.tabs = data.tabs;
      for (ii in vm.tabs) {
        for (jj in vm.tabs[ii].sections) {
          for (ij in vm.tabs[ii].sections[jj].widgets) {
            vm.tabs[ii].sections[jj].widgets[ij].type = vm.tabs[ii].sections[jj].widgets[ij].name;
            vm.tabs[ii].sections[jj].widgets[ij].templateOptions.title = vm.tabs[ii].sections[jj].widgets[ij].title;
            delete vm.tabs[ii].sections[jj].widgets[ij].api;
            delete vm.tabs[ii].sections[jj].widgets[ij].category;
            delete vm.tabs[ii].sections[jj].widgets[ij].colSpan;
            delete vm.tabs[ii].sections[jj].widgets[ij].heightSize;
            delete vm.tabs[ii].sections[jj].widgets[ij].industry;
            delete vm.tabs[ii].sections[jj].widgets[ij].name;
            delete vm.tabs[ii].sections[jj].widgets[ij].ordering;
            delete vm.tabs[ii].sections[jj].widgets[ij].title;
          }
        }
      }
    })

    vm.permittedWidgets = [[], []];
    overviewService.getWidgetList().then(function (data) {
      for (ii in data) {
        var item = data[ii];
        delete item.templateOptions;
        item.type = item.name;

        if (item.heightSize == 'small') {
          vm.permittedWidgets[0].push(item);
        } else {
          vm.permittedWidgets[1].push(item);
        }
      }
    })

    vm.deleteTab = function (idx) {
      vm.tabs.splice(idx, 1);
      vm.idxTab = idx -1;
      vm.saveOverview();
    }

    vm.newTab = function () {
      vm.tabs.push({
        'title': 'New Tab',
        'sections': [{}, {}]
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
        if (vm.tabs[tabIdx].sections[secIdx].widgets[idx-1].templateOptions.hide) {
          vm.tabs[tabIdx].sections[secIdx].widgets[idx-1].templateOptions.hide = false;
        } else {
          vm.tabs[tabIdx].sections[secIdx].widgets.splice(idx-1, 1)
        }
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

    vm.checkWidget = function (tabIdx, secIdx, type, checkHide) {
      var flag = -1,
          hide = false,
          widgets = vm.tabs[tabIdx].sections[secIdx].widgets;

      for (var i = 0; i < widgets.length; i++) {
        if (widgets[i].type == type) {
          flag = i;
          hide = widgets[i].templateOptions.hide;
          break;
        }
      }

      result = (!checkHide || !hide) ? flag+1 : 0;
      return result;
    }

    vm.saveOverview = function () {
      // save vm.tabs
      // filter to.hide == true
    }
  })
