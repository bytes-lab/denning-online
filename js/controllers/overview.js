denningOnline
  .controller('overviewCtrl', function ($rootScope, overviewService, formlyConfig, growlService) {
    var vm = this;
    vm.idxTab = 0;
    vm.today = moment(new Date()).format('ddd, MMM D, YYYY');

    vm.getClass = {
      3: 'col-lg-3 col-md-4 col-sm-6',
      4: 'col-md-4 col-sm-6',
      6: 'col-sm-6'
    }

    vm.getClass_ = {
      'col-lg-3 col-md-4 col-sm-6': 3,
      'col-md-4 col-sm-6': 4,
      'col-sm-6': 6
    }

    vm.loadOverview = function () {
      overviewService.getOverview().then(function (data) {
        vm.overview = data;
        vm.tabs = data.tabs;
        for (ii in vm.tabs) {
          for (jj in vm.tabs[ii].sections) {
            for (ij in vm.tabs[ii].sections[jj].widgets) {
              vm.tabs[ii].sections[jj].widgets[ij].templateOptions.colSpan = vm.getClass[vm.tabs[ii].sections[jj].widgets[ij].templateOptions.colSpan];
              vm.tabs[ii].sections[jj].widgets[ij].templateOptions.updateOverview = vm.saveOverview;
              vm.tabs[ii].sections[jj].widgets[ij].templateOptions.tab = ii;
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
              overviewService.getWidget($scope.to.api).then(function (resp) {
                $scope.data = resp;

                if (resp.templateOptions.subCategory == 5) {
                  var d3 = [];
                  
                  for (var i = 0; i < 12; i += 1) {
                    d3.push([resp.lineChart.dataLabels[i], parseInt(resp.lineChart.dataValues[i])]);
                  }

                  var options = {
                    grid: {
                      borderWidth: {
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 1
                      },
                      borderColor: "#ccc",
                      labelMargin:10,
                      hoverable: true,
                      clickable: true,
                      mouseActiveRadius:6,
                    },
                    xaxis: {
                      mode: "categories",
                      tickLength: 0
                    },
                    yaxis: {
                      tickLength: 0
                    }
                  };

                  /* Regular Line Chart */
                  if ($(`.line-chart-${$scope.to.tab}-${$scope.to.ordering}`)[0]) {
                    $.plot($(`.line-chart-${$scope.to.tab}-${$scope.to.ordering}`), [
                      {data: d3, lines: { show: true }, label: resp.lineChart.yAxisTitle, color: '#00bcd4' }
                    ], options);
                  }
                } else if (resp.templateOptions.subCategory == 6) {
                  var colors = ['#FFEB3B', '#8BC34A', '#03A9F4'],
                      pieData = [];

                  for (var i = 0; i < 3; i++) {
                    pieData.push({
                      data: resp.pieChart.dataValues[i], 
                      color: colors[i], 
                      label: resp.pieChart.dataLabels[i]
                    })
                  }

                  if ($(`.pie-chart-${$scope.to.tab}-${$scope.to.ordering}`)[0]) {
                    $.plot(`.pie-chart-${$scope.to.tab}-${$scope.to.ordering}`, pieData, {
                      series: {
                        pie: {
                          show: true,
                          stroke: { 
                            width: 2,
                          },
                        },
                      },
                      legend: {
                        container: '.flc-pie',
                        backgroundOpacity: 0.5,
                        noColumns: 0,
                        backgroundColor: "white",
                        lineWidth: 0
                      },
                      grid: {
                        hoverable: true,
                        clickable: true
                      },
                      tooltip: true,
                      tooltipOpts: {
                        content: "%p.0%, %s", // show percentages, rounding to 2 decimal places
                        shifts: {
                          x: 20,
                          y: 0
                        },
                        defaultTheme: false,
                        cssClass: 'flot-tooltip'
                      }

                    });
                  }
                }
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
        'displayName': `OverviewTab${vm.tabs.length+1}`,
        'tabName': `OverviewTab${vm.tabs.length+1}`,
        'sections': [{}, {}],
        'isActive': true,
        'isDefault': false
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
              to.tab = tabIdx;
              break;
            }
          }
        }

        vm.tabs[tabIdx].sections[secIdx].widgets.push({
          "type": type,
          "templateOptions": to
        })
      }

      vm.saveOverview();
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
      var tabs = angular.copy(vm.tabs);
      for (ii in tabs) {
        tab = tabs[ii];
        for (jj in tab.sections) {
          section = tab.sections[jj];
          widgets = [];
          for (kk in section.widgets) {
            widget = section.widgets[kk];
            // filter to.hide == true
            if (!widget.templateOptions.hide) {
              for (ll in widget) {
                if (ll != "templateOptions" && ll != "type") {
                  delete widget[ll];
                }
              }
              widget.templateOptions.colSpan = vm.getClass_[widget.templateOptions.colSpan];
              widgets.push(widget);
            }
          }
          section.widgets = widgets;
        }
      }

      vm.overview.tabs = tabs;
      overviewService.save(vm.overview).then(function () {
        growlService.growl('Saved successfully!', 'success');
      })
    }
  })
