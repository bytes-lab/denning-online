denningOnline
  .controller('matterListCtrl', function(NgTableParams, matterService, Auth, $state) {
    var self = this;
    self.keyword = '';
    self.userInfo = Auth.getUserInfo();

    self.tableFilter = new NgTableParams({}, {
      getData: function(params) {
        return matterService.getList(params.page(), params.count(), self.keyword)
        .then(function (data) {
          var data_ = [];
          params.total(data.headers('x-total-count'));
          angular.forEach(data.data, function(value, key) {
            var item = JSON.parse(value.JsonDesc.replace(/[\u0000-\u0019]+/g,""));
            item.dateOpen = item.dateOpen.split(' ')[0];
            data_.push(item);
          });
          return data_;
        });
      }
    })    

    self.search = function (event, clear) {
      if(event.which == 13 || clear) { 
        if (clear) {
          self.keyword='';
        }
        self.tableFilter.reload();
      }
    }
  })

  .controller('relatedMatterCtrl', function($filter, $stateParams, NgTableParams, 
                                            matterService, $state) 
  {
    var type = $state.$current.data.type;
    var self = this;
    self.filter = true;

    matterService.getRelatedMatters(type, $stateParams.id).then(function (data) {
      self.data = [];
      angular.forEach(data, function(value, key) {
        var item = JSON.parse(value.JsonDesc.replace(/[\u0000-\u0019]+/g,""));
        item.dateOpen = item.dateOpen.split(' ')[0];
        self.data.push(item);
      })
      initializeTable();
    });

    self.clickHandler = function (item) {
      $state.go('file-matters.edit', {'fileNo': item.systemNo});
    }
    
    function initializeTable () {
      self.tableFilter = new NgTableParams({
        page: 1,
        count: 10,
        sorting: {
          name: 'asc' 
        }
      }, {
        dataset: self.data
      })
    }
  })

  .controller('matterEditCtrl', function($scope, $stateParams, matterService, matterCodeService, $window,
                                             $state, matterFormService, Auth, refactorService, 
                                             growlService, contactService, uibDateParser) 
  {
    var vm = this;
    vm.userInfo = Auth.getUserInfo();

    vm.prevTab = function () {
      if (vm.idxTab > 0) {
        vm.idxTab--;
      }
    };

    vm.nextTab = function () {
      if (vm.idxTab < 20) {
        vm.idxTab++;
      }
    };

    vm.scrollUp = function () {
      $('body,html').animate({
          scrollTop : 0
      }, 500);
      return false;
    };

    function getLabel (arr, key) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].Field == key) {
          return arr[i].Label;
        }
      }
    }

    vm.back = function () {
      $window.history.back();
    }

    vm.forward = function () {
      $window.history.forward();
    }

    function buildTabDict (clsMatterCode) {
      var matter_code = [],
          dateLabels = [],
          currencyLabels = [],
          ntextLabels = [],
          ftextLabels = [];

      if (clsMatterCode && clsMatterCode.jsonFieldLabels) {
        matter_code = JSON.parse(clsMatterCode.jsonFieldLabels);

        for (i = 1; i <= 50; i++) {
          dateLabels.push(getLabel(matter_code, 'Date'+i));
        }

        for (i = 1; i <= 36; i++) {
          currencyLabels.push(getLabel(matter_code, '$'+i));
        }

        for (i = 1; i <= 41; i++) {
          ftextLabels.push(getLabel(matter_code, 'F'+i));
        }

        for (i = 1; i <= 15; i++) {
          ntextLabels.push(getLabel(matter_code, 'Pn'+i));
        }
      }

      vm.tabDict = {
        "Matter": {
          "label": "Info",
          "groups": [
            {
              "type": "info",
              "templateOptions": {
                "label": "Primary Client",
                "partner": clsMatterCode ? getLabel(matter_code, 'PartnerInCharge') : '',
                "la": clsMatterCode ? getLabel(matter_code, 'LAInCharge') : '',
                "clerk": clsMatterCode ? getLabel(matter_code, 'ClerkInCharge') : '',
                "team": clsMatterCode ? getLabel(matter_code, 'StaffInCharge4') : '',
                "share": false,
                "solicitor": true,
                "party": true
              }
            }
          ]
        },
        "Summary": {
          "groups": [
            {
              "type": "summary",
              "templateOptions": { }
            }
          ]          
        },
        "Parties-S": {
          "groups": [
            {
              "type": "contact",
              "templateOptions": {
                "label": clsMatterCode ? clsMatterCode.strGroupC1 : '',
                "share": true,
                "solicitor": true,
                "party": true
              }
            },
            {
              "type": "contact",
              "templateOptions": {
                "label": clsMatterCode ? clsMatterCode.strGroupC2 : '',
                "share": true,
                "solicitor": true,
                "party": true
              }
            },
            {
              "type": "contact",
              "templateOptions": {
                "label": clsMatterCode ? clsMatterCode.strGroupC3 : '',
                "share": true,
                "solicitor": true,
                "party": true
              }
            },
            {
              "type": "contact",
              "templateOptions": {
                "label": clsMatterCode ? clsMatterCode.strGroupC4 : '',
                "share": true,
                "solicitor": true,
                "party": true
              }
            },
            {
              "type": "contact",
              "templateOptions": {
                "label": clsMatterCode ? clsMatterCode.strGroupC5 : '',
                "share": true,
                "solicitor": true,
                "party": true
              }
            },
            {
              "type": "contact",
              "templateOptions": {
                "label": clsMatterCode ? clsMatterCode.strGroupL1 : '',
                "share": true,
                "solicitor": true,
                "party": true
              }
            },
            {
              "type": "contact",
              "templateOptions": {
                "label": clsMatterCode ? clsMatterCode.strGroupL2 : '',
                "share": true,
                "solicitor": true,
                "party": true
              }
            }
          ]
        },
        "Parties": {
          "groups": [
            {
              "type": "contact",
              "templateOptions": {
                "label": clsMatterCode ? clsMatterCode.strGroupC1 : '',
                "share": true,
                "solicitor": false,
                "party": true,
                "c_start": 1,
                "c_end": 5
              }
            },
            {
              "type": "contact",
              "templateOptions": {
                "label": clsMatterCode ? clsMatterCode.strGroupC2 : '',
                "share": true,
                "solicitor": false,
                "party": true,
                "c_start": 6,
                "c_end": 10
              }
            },
            {
              "type": "contact",
              "templateOptions": {
                "label": clsMatterCode ? clsMatterCode.strGroupC3 : '',
                "share": false,
                "solicitor": false,
                "party": true,
                "c_start": 11,
                "c_end": 15
              }
            },
            {
              "type": "contact",
              "templateOptions": {
                "label": clsMatterCode ? clsMatterCode.strGroupC4 : '',
                "share": false,
                "solicitor": false,
                "party": true,
                "c_start": 16,
                "c_end": 20
              }
            },
            {
              "type": "contact",
              "templateOptions": {
                "label": clsMatterCode ? clsMatterCode.strGroupC5 : '',
                "share": false,
                "solicitor": false,
                "party": true,
                "c_start": 21,
                "c_end": 25
              }
            },
            {
              "type": "contact",
              "templateOptions": {
                "label": clsMatterCode ? clsMatterCode.strGroupC6 : '',
                "share": false,
                "solicitor": false,
                "party": true,
                "c_start": 26,
                "c_end": 26
              }
            }
          ]
        },
        "Solicitors": {
          "groups": [
            {
              "type": "contact",
              "templateOptions": {
                "label": clsMatterCode ? clsMatterCode.strGroupL1 : '',
                "share": true,
                "solicitor": true,
                "party": false,
                "field": "clsLawyer1",
                "idx": 1
              }
            },
            {
              "type": "contact",
              "templateOptions": {
                "label": clsMatterCode ? clsMatterCode.strGroupL2 : '',
                "share": false,
                "solicitor": true,
                "party": false,
                "field": "clsLawyer2",
                "idx": 2
              }
            },
            {
              "type": "contact",
              "templateOptions": {
                "label": clsMatterCode ? clsMatterCode.strGroupL3 : '',
                "share": true,
                "solicitor": true,
                "party": false,
                "field": "clsLawyer3",
                "idx": 3
              }
            },
            {
              "type": "contact",
              "templateOptions": {
                "label": clsMatterCode ? clsMatterCode.strGroupL4 : '',
                "share": true,
                "solicitor": true,
                "party": false,
                "field": "clsLawyer4",
                "idx": 4
              }
            }
          ]
        },
        "Case": {
          "groups": [
            {
              "type": "case",
              "templateOptions": {
                "label": "Case Information",                
              }
            }
          ]
        },
        "Price": {
          "groups": [
            {
              "type": "price",
              "templateOptions": {
                "label": "Price",
              }
            }
          ]
        },        
        "Loan": {
          "groups": [
            {
              "type": "loan",
              "templateOptions": {
                "label": "Loan Type",
              }
            }
          ]
        }, 
        "Loan (T)": {
          "groups": [
            {
              "type": "trade_loan",
              "templateOptions": {
                "label": "Loan Type",
              }
            }
          ]
        }, 
        "Property": {
          "groups": [
            {
              "type": "property",
              "templateOptions": {
                "label": "Property Information",
                "share": true,
                "solicitor": true,
                "property": true
              }
            }
          ]
        },
        "Bank": {
          "groups": [
            {
              "type": "bank1",
              "templateOptions": {
                "label": clsMatterCode ? getLabel(matter_code, 'Bank1') : '',
              }
            },
            {
              "type": "bank2",
              "templateOptions": {
                "label": clsMatterCode ? getLabel(matter_code, 'Bank2') : '',
              }
            }
          ]
        },
        "$": {
          "groups": [
            {
              "type": "currency",
              "templateOptions": {
                "labels": currencyLabels,
              }
            }
          ]
        },
        "Date": {
          "groups": [
            {
              "type": "date",
              "templateOptions": {
                "labels": dateLabels,
              }
            }
          ]
        },
        "Text": {
          "groups": [
            {
              "type": "text",
              "templateOptions": {
                "flabels": ftextLabels,
                "nlabels": ntextLabels,
              }
            }
          ]
        },
        "Template": {
          "groups": [
            {
              "type": "gen-doc",
              "templateOptions": {
                "label": "Template",
              }
            }
          ]
        },
        "Premises & Rent": {
          "groups": [
            {
              "type": "premises-rent",
              "templateOptions": {
                "label": "Premises Details",
              }
            }
          ]
        },
        "Term": {
          "groups": [
            {
              "type": "term",
              "templateOptions": {
                "label": "Term",
              }
            }
          ]
        },
        "Tenancy": {
          "groups": [
            {
              "type": "tenancy",
              "templateOptions": {
                "label": "Party Paying Council Rates & Outgoings",
              }
            }
          ]
        },
        "Vehicles": {
          "groups": [
            {
              "type": "vehicle",
              "templateOptions": {
                "label": "Claimant's Vehicle Detail",
              }
            }
          ]
        },
        "Others": {
          "groups": [
            {
              "type": "other",
              "templateOptions": {
                "label": "Loan Tier"
              }
            }
          ]
        },
        "Estate Agent": {
          "groups": [
            {
              "type": "estate-agent",
              "templateOptions": {
                "label": "Estate Agent"
              }
            }
          ]
        },
        "Reports": {
          "groups": [
            {
              "type": "report",
              "templateOptions": {
                "label": "Reports"
              }
            }
          ]
        },
        "Arrears": {
          "groups": [
            {
              "type": "arrear",
              "templateOptions": {
                "label": "Rent in Arrears / Distress",
              }
            }
          ]
        },
        "Beneficiary": {
          "groups": [
            {
              "type": "beneficiary",
              "templateOptions": {
                "label": "Parent(s)"
              }
            }
          ]
        },
        "Chain": {
          "groups": [
            {
              "type": "chain",
              "templateOptions": {
                "label": "Principle SPA Details"
              }
            }
          ]
        },
        "RPGT": {
          "groups": [
            {
              "type": "rpgt",
              "templateOptions": {
                "label": "CKHT Information"
              }
            }
          ]
        },
        "Offers": {
          "groups": [
            {
              "type": "offer",
              "templateOptions": {
                "label": "Claim Details"
              }
            }
          ]
        }
      };
    }

    function buildTabs (clsMatterCode) {
      buildTabDict(clsMatterCode);

      if (clsMatterCode) {
        matterCodeService.getItem(clsMatterCode.code).then(function (matterCode) {
          vm.model.intTurnaround = matterCode.intTurnaroundTime;
          vm.model.clsPresetBill = matterCode.clsPresetBill;
        });
      }

      vm.tabs = [];
      vm.tabs.push(vm.tabDict['Matter']); // first tab

      if (clsMatterCode) {
        matterFormService.getItem(clsMatterCode.clsFormName.code).then(function (item) {
          jsonTabs = JSON.parse(item.jsonTabs);
          idxTab = 0;
          for (idx in jsonTabs) {
            value = jsonTabs[idx];
            if (value.TabName != 'Matter') {
              var item = vm.tabDict[value.TabName];
              item['label'] = value.Title
              vm.tabs.push(item);
            }

            if (value.TabName.toLowerCase() == $stateParams.tab) {
              idxTab = parseInt(idx);
              if ($stateParams.tab.toLowerCase() == 'summary') {
                idxTab = 1;
              }
            }
          }
          vm.idxTab = idxTab;
        });
      }
    }

    var editControl = {   // very important
      create_new: $state.$current.data.can_edit,
      can_edit: $state.$current.data.can_edit,
      matterCodeChange: buildTabs
    };

    if ($stateParams.fileNo) {
      matterService.getItem($stateParams.fileNo).then(function (item) {
        vm.fileNo = $stateParams.fileNo;
        vm.fileName = item.clsPrimaryClient.strName;
        
        if (item) {
          vm.idxTab = 5;  // any none zero value

          vm.model = refactorService.preConvert(item, true);
          vm.model_ = angular.copy(vm.model);
          vm.model.tmp = editControl;
          vm.model.tmp.oldMatterCode = item.clsMatterCode;

          vm.title = 'Matter : ' + vm.model.strFileNo1 + ' ( ' + 
                     vm.model.clsPrimaryClient.strName + ' )';
        }

        buildTabs(vm.model.clsMatterCode);
      });
    } else {
      vm.idxTab = 0;
      vm.model = { 
        tmp: editControl,
        dtDateOpenFile: uibDateParser.parse(new Date()),
        clsFileStatus: {
          code: "1",
          strDescription: "Active"
        },
        strPurchasePriceSymbol: vm.userInfo.currency,
        strLoanPriceSymbol: vm.userInfo.currency
      };
      vm.title = 'New Matter';

      buildTabs(vm.model.clsMatterCode);
    }

    vm.options = {
      formState: {
        awesomeIsForced: false
      }
    };

    vm.save = function () {
      delete vm.model.tmp;
      model = refactorService.getDiff(vm.model_, vm.model);

      if (vm.model_) {
        model.strFileNo1 = vm.model_.strFileNo1;
      }

      matterService.save(model).then(function (item) {
        vm.model.tmp = editControl;
     
        if (item) { // create success or update
          if (vm.model_) {
            vm.model = refactorService.preConvert(item, true);
            vm.model_ = angular.copy(vm.model);
            vm.model.tmp = editControl;
            vm.model.tmp.oldMatterCode = item.clsMatterCode;
            // $state.reload();
          } else {
            $state.go('file-matters.edit', { 'fileNo': item.strFileNo1 });
          }
          growlService.growl('Saved successfully!', 'success');          
        }
      })
    }

    vm.reset = function () {
      $state.reload();
    }
  })
