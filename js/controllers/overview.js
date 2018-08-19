denningOnline
  .controller('overviewCtrl', function ($rootScope, overviewService) {
    var vm = this;
    vm.idxTab = 0;
    vm.today = moment(new Date()).format('ddd, MMM D, YYYY');

    overviewService.getOverview().then(function (data) {
      vm.tabs = data.tabs;
      for (ii in vm.tabs) {
        for (jj in vm.tabs[ii].sections) {
          for (ij in vm.tabs[ii].sections[jj].widgets) {
            vm.tabs[ii].sections[jj].widgets[ij].type = vm.tabs[ii].sections[jj].widgets[ij].name;
            vm.tabs[ii].sections[jj].widgets[ij].templateOptions.title = vm.tabs[ii].sections[jj].widgets[ij].title;
            vm.tabs[ii].sections[jj].widgets[ij].templateOptions.api = vm.tabs[ii].sections[jj].widgets[ij].api;
            vm.tabs[ii].sections[jj].widgets[ij].templateOptions.colSpan = vm.tabs[ii].sections[jj].widgets[ij].colSpan;
            vm.tabs[ii].sections[jj].widgets[ij].templateOptions.name = vm.tabs[ii].sections[jj].widgets[ij].name;

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
    var data = $rootScope.overviewWidgets;
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

    vm.deleteTab = function (idx) {
      vm.tabs.splice(idx, 1);
      vm.idxTab = idx - 1;
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
