denningOnline
  .controller('overviewCtrl', function ($rootScope, overviewService, formlyConfig) {
    var vm = this;
    vm.idxTab = 0;
    vm.today = moment(new Date()).format('ddd, MMM D, YYYY');

    vm.getClass = {
      3: 'col-lg-3 col-md-4 col-sm-6',
      4: 'col-md-4 col-sm-6',
      6: 'col-sm-6'
    }

    vm.loadOverview = function () {
      overviewService.getOverview().then(function (data) {
        vm.tabs = data.tabs;
        for (ii in vm.tabs) {
          for (jj in vm.tabs[ii].sections) {
            for (ij in vm.tabs[ii].sections[jj].widgets) {
              vm.tabs[ii].sections[jj].widgets[ij].templateOptions.colSpan = vm.getClass[vm.tabs[ii].sections[jj].widgets[ij].templateOptions.colSpan];
            }
          }
        }
      })

      vm.permittedWidgets = [[], []];
      var data = $rootScope.overviewWidgets;
      for (ii in data) {
        var item = data[ii];
        item.templateOptions.colSpan = vm.getClass[item.templateOptions.colSpan];
        if (item.templateOptions.heightSize == 'small') {
          vm.permittedWidgets[0].push(item);
        } else {
          vm.permittedWidgets[1].push(item);
        }
      }
    }

    // build overview widgets
    if (!$rootScope.overviewWidgets) {
      overviewService.getWidgetList().then(function (data) {
        $rootScope.overviewWidgets = data;

        for (ii in data) {
          formlyConfig.setType({
            name: data[ii].type,
            templateUrl: `widget_t${data[ii].templateOptions.subCategory}.html`,
            controller: function ($scope, overviewService) {
              overviewService.getWidget($scope.to.api).then(function (data) {
                $scope.data = data;
              });
            } 
          });
        }

        vm.loadOverview();
      })      
    } else {
      vm.loadOverview();
    }

    vm.deleteTab = function (idx) {
      vm.tabs.splice(idx, 1);
      vm.idxTab = idx - 1;
      vm.saveOverview();
    }

    vm.newTab = function () {
      vm.tabs.push({
        'displayName': 'New Tab',
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
        vm.saveOverview();
      }
    }

    vm.manageWidget = function (tabIdx, secIdx, type) {
      var idx = vm.checkWidget(tabIdx, secIdx, type);
      if (idx < 0) {  // new tab
        return false;
      }

      if (idx > 0) {
        if (vm.tabs[tabIdx].sections[secIdx].widgets[idx-1].templateOptions.hide) {
          vm.tabs[tabIdx].sections[secIdx].widgets[idx-1].templateOptions.hide = false;
        } else {
          vm.tabs[tabIdx].sections[secIdx].widgets.splice(idx-1, 1)
        }
      } else {
        // get templateOptions for a new widget
        var to;
        for (ii = 0; ii < 2; ii++) {
          for (jj in vm.permittedWidgets[ii]) {
            if (vm.permittedWidgets[ii][jj].type == type) {
              var item = vm.permittedWidgets[ii][jj];
              to = item.templateOptions;
              break;
            }
          }
        }

        vm.tabs[tabIdx].sections[secIdx].widgets.push({
          "type": type,
          "templateOptions": to
        })
      }
    }

    vm.checkWidget = function (tabIdx, secIdx, type, checkHide) {
      var flag = -1,
          hide = false,
          widgets = vm.tabs[tabIdx].sections[secIdx].widgets;

      if (typeof widgets == "undefined") {
        return -1;
      }

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
