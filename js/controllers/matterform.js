denningOnline
  .controller('fileMatterEditCtrl', function($scope, $stateParams, fileMatterService, contactService, $state, matterFormService, Auth) {
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

    function getLabel(arr, key) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].JsonField == key) {
          return arr[i].Label;
        }
      }
    }

    function buildTabDict(clsMatterCode) {
      var matter_code = [];
      if (clsMatterCode && clsMatterCode.jsonFieldLabels) {
        matter_code = JSON.parse(clsMatterCode.jsonFieldLabels);
      }

      vm.tabDict = {
        "Matter": {
          "label": "Info",
          "groups": [
            {
              "key": "file-info",
              "label": "Primary Client",
              "attrs": [
                {
                  "key": "matter1",
                  "type": "file",
                  "templateOptions": {
                    "share": false,
                    "solicitor": true,
                    "party": true
                  }
                }
              ]
            }
          ]
        },
        "Summary": {
        },
        "Parties-S": {
          "groups": [
            {
              "key": "vendor-group",
              "label": clsMatterCode ? clsMatterCode.strGroupC1 : '',
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
              "label": clsMatterCode ? clsMatterCode.strGroupC2 : '',
              "attrs": [
                {
                  "key": "purchaser1",
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
              "key": "vendor-group3",
              "label": clsMatterCode ? clsMatterCode.strGroupC3 : '',
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
              "label": clsMatterCode ? clsMatterCode.strGroupC4 : '',
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
              "label": clsMatterCode ? clsMatterCode.strGroupC5 : '',
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
              "label": clsMatterCode ? clsMatterCode.strGroupL1 : '',
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
              "label": clsMatterCode ? clsMatterCode.strGroupL2 : '',
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
        "Parties": {
          "groups": [
            {
              "key": "vendor-group11",
              "label": clsMatterCode ? clsMatterCode.strGroupC1 : '',
              "attrs": [
                {
                  "key": "party11",
                  "type": "contact",
                  "templateOptions": {
                    "share": true,
                    "solicitor": false,
                    "party": true,
                    "c_start": 1,
                    "c_end": 5
                  }
                }
              ]
            },
            {
              "key": "purchaser-group11",
              "label": clsMatterCode ? clsMatterCode.strGroupC2 : '',
              "attrs": [
                {
                  "key": "purchaser11",
                  "type": "contact",
                  "templateOptions": {
                    "share": true,
                    "solicitor": false,
                    "party": true,
                    "c_start": 6,
                    "c_end": 10
                  }
                }
              ]
            },
            {
              "key": "vendor-group31",
              "label": clsMatterCode ? clsMatterCode.strGroupC3 : '',
              "attrs": [
                {
                  "key": "party31",
                  "type": "contact",
                  "templateOptions": {
                    "share": false,
                    "solicitor": false,
                    "party": true,
                    "c_start": 11,
                    "c_end": 15
                  }
                }
              ]
            },
            {
              "key": "vendor-group41",
              "label": clsMatterCode ? clsMatterCode.strGroupC4 : '',
              "attrs": [
                {
                  "key": "party41",
                  "type": "contact",
                  "templateOptions": {
                    "share": false,
                    "solicitor": false,
                    "party": true,
                    "c_start": 16,
                    "c_end": 20
                  }
                }
              ]
            },
            {
              "key": "vendor-group51",
              "label": clsMatterCode ? clsMatterCode.strGroupC5 : '',
              "attrs": [
                {
                  "key": "party51",
                  "type": "contact",
                  "templateOptions": {
                    "share": false,
                    "solicitor": false,
                    "party": true,
                    "c_start": 21,
                    "c_end": 25
                  }
                }
              ]
            },
            {
              "key": "vendor-group61",
              "label": clsMatterCode ? clsMatterCode.strGroupC6 : '',
              "attrs": [
                {
                  "key": "party61",
                  "type": "contact",
                  "templateOptions": {
                    "share": false,
                    "solicitor": false,
                    "party": true,
                    "c_start": 26,
                    "c_end": 26
                  }
                }
              ]
            }
          ]
        },
        "Solicitors": {
          "groups": [
            {
              "key": "vendor-group111",
              "label": clsMatterCode ? getLabel(matter_code, 'clsLawyer1') : '',
              "attrs": [
                {
                  "key": "party12",
                  "type": "contact",
                  "templateOptions": {
                    "share": true,
                    "solicitor": true,
                    "party": false,
                    "field": "clsLawyer1",
                    "idx": 1
                  }
                }
              ]
            },
            {
              "key": "purchaser-group111",
              "label": clsMatterCode ? getLabel(matter_code, 'clsLawyer2') : '',
              "attrs": [
                {
                  "key": "purchaser12",
                  "type": "contact",
                  "templateOptions": {
                    "share": false,
                    "solicitor": true,
                    "party": false,
                    "field": "clsLawyer2",
                    "idx": 2
                  }
                }
              ]
            },
            {
              "key": "vendor-group13",
              "label": clsMatterCode ? getLabel(matter_code, 'clsLawyer3') : '',
              "attrs": [
                {
                  "key": "party13",
                  "type": "contact",
                  "templateOptions": {
                    "share": true,
                    "solicitor": true,
                    "party": false,
                    "field": "clsLawyer3",
                    "idx": 3
                  }
                }
              ]
            },
            {
              "key": "vendor-group14",
              "label": clsMatterCode ? getLabel(matter_code, 'clsLawyer4') : '',
              "attrs": [
                {
                  "key": "party14",
                  "type": "contact",
                  "templateOptions": {
                    "share": true,
                    "solicitor": true,
                    "party": false,
                    "field": "clsLawyer4",
                    "idx": 4
                  }
                }
              ]
            }
          ]
        },
        "Case": {
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
        "Price": {
          "groups": [
            {
              "key": "price-info",
              "label": "Price",
              "attrs": [
                {
                  "key": "price1",
                  "type": "price"
                }
              ]
            }
          ]
        },        
        "Loan": {
          "groups": [
            {
              "key": "loan-info",
              "label": "Loan Type",
              "attrs": [
                {
                  "key": "loan1",
                  "type": "loan"
                }
              ]
            }
          ]
        }, 
        "Property": {
          "groups": [
            {
              "key": "property-group1",
              "label": "Property Information",
              "attrs": [
                {
                  "key": "property1",
                  "type": "property",
                  "templateOptions": {
                    "share": true,
                    "solicitor": true,
                    "property": true
                  }
                }
              ]
            }
          ]
        },
        "Bank": {
          "groups": [
            {
              "key": "bank-info",
              "label": "Bank 1 Information",
              "attrs": [
                {
                  "key": "bank1",
                  "type": "bank1",
                  "templateOptions": {
                  }
                }
              ]
            },
            {
              "key": "bank-info",
              "label": "Bank 2 Information",
              "attrs": [
                {
                  "key": "bank2",
                  "type": "bank2",
                  "templateOptions": {
                  }
                }
              ]
            }
          ]            
        },
        "$": {
        },
        "Date": {
        },
        "Text": {
        },
        "Template": {
          "groups": [
            {
              "key": "gen-docs-group",
              "label": "Template",
              "attrs": [
                {
                  "key": "template",
                  "type": "gen-doc",
                  "templateOptions": {
                  }                
                }
              ]
            }
          ]
        },
        "Premises & Rent": {
          "label": "Premises & Rent",
          "groups": [
            {
              "key": "premises-rent-group",
              "label": "Premises Details",
              "attrs": [
                {
                  "key": "premises-rent",
                  "type": "premises-rent"
                }
              ]
            }
          ]
        },
        "Term": {
          "label": "Term",
          "groups": [
            {
              "key": "term-group",
              "label": "Term",
              "attrs": [
                {
                  "key": "term",
                  "type": "term"
                }
              ]
            }
          ]
        },
        "Tenancy": {
          "label": "Tenancy",
          "groups": [
            {
              "key": "tenancy-group",
              "label": "Party Paying Council Rates & Outgoings",
              "attrs": [
                {
                  "key": "tenancy",
                  "type": "tenancy"
                }
              ]
            }
          ]
        },
        "Vehicles": {
          "label": "Vehicles",
          "groups": [
            {
              "key": "vehicle-group",
              "label": "Claimant's Vehicle Detail",
              "attrs": [
                {
                  "key": "vehicle",
                  "type": "vehicle"
                }
              ]
            }
          ]
        },
        "Others": {
          "label": "Others",
          "groups": [
            {
              "key": "other-group",
              "label": "Loan Tier",
              "attrs": [
                {
                  "key": "other",
                  "type": "other"
                }
              ]
            }
          ]
        },
        "Estate Agent": {
          "label": "Estate Agent",
          "groups": [
            {
              "key": "estate-agent-group",
              "label": "Estate Agent",
              "attrs": [
                {
                  "key": "estate-agent",
                  "type": "estate-agent"
                }
              ]
            }
          ]
        },
        "Reports": {
          "label": "Reports",
          "groups": [
            {
              "key": "report-group",
              "label": "Reports",
              "attrs": [
                {
                  "key": "report",
                  "type": "report"
                }
              ]
            }
          ]
        },
        "Arrears": {
          "label": "Arrears",
          "groups": [
            {
              "key": "arrear-group",
              "label": "Rent in Arrears / Distress",
              "attrs": [
                {
                  "key": "arrear",
                  "type": "arrear"
                }
              ]
            }
          ]
        },
        "Beneficiary": {
          "label": "Beneficiary",
          "groups": [
            {
              "key": "beneficiary-group",
              "label": "Parent(s)",
              "attrs": [
                {
                  "key": "beneficiary",
                  "type": "beneficiary"
                }
              ]
            }
          ]
        },
        "Chain": {
          "label": "Chain",
          "groups": [
            {
              "key": "chain-group",
              "label": "Principle SPA Details",
              "attrs": [
                {
                  "key": "chain",
                  "type": "chain"
                }
              ]
            }
          ]
        },
        "RPGT": {
          "label": "RPGT",
          "groups": [
            {
              "key": "rpgt-group",
              "label": "CKHT Information",
              "attrs": [
                {
                  "key": "rpgt",
                  "type": "rpgt"
                }
              ]
            }
          ]
        },
        "Offers": {
          "label": "Offers",
          "groups": [
            {
              "key": "offer-group",
              "label": "Claim Details",
              "attrs": [
                {
                  "key": "offer",
                  "type": "offer"
                }
              ]
            }
          ]
        }
      };
    }

    function buildTabs(clsMatterCode) {
      buildTabDict(clsMatterCode);

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
            }
          }
          vm.idxTab = idxTab;
          // vm.tabs.push(vm.tabDict['Offers']);
          // vm.tabs.push(vm.tabDict['RPGT']);
          // vm.tabs.push(vm.tabDict['Chain']);
          // vm.tabs.push(vm.tabDict['Beneficiary']);
          // vm.tabs.push(vm.tabDict['Arrears']);
          // vm.tabs.push(vm.tabDict['Reports']);
          // vm.tabs.push(vm.tabDict['Estate Agent']);
          // vm.tabs.push(vm.tabDict['Vehicles']);
          // vm.tabs.push(vm.tabDict['Tenancy']);
          // vm.tabs.push(vm.tabDict['Term']);
          // vm.tabs.push(vm.tabDict['Others']);
          // vm.tabs.push(vm.tabDict['Premises & Rent']);
        });
      }
    }

    var editControl = {   // very important
      create_new: $state.$current.data.can_edit,
      can_edit: $state.$current.data.can_edit,
      matterCodeChange: buildTabs
    };

    if ($stateParams.fileNo) {
      fileMatterService.getItem($stateParams.fileNo).then(function (item) {
        if (item) {
          vm.idxTab = 5;  // any none zero value
          vm.model = item;
          vm.model.tmp = editControl;
          vm.model.tmp.oldMatterCode = item.clsMatterCode;
          
          vm.title = 'Matter : ' + vm.model.strFileNo1 + ' ( ' + vm.model.clsPrimaryClient.strName + ' )';           
        } else {
          vm.idxTab = 0;
          vm.model = { 
            tmp: editControl
          };
          vm.title = 'New Matter';
        }
        buildTabs(vm.model.clsMatterCode);
      });
    } else {
      vm.idxTab = 0;
      vm.model = { 
        tmp: editControl
      };

      buildTabs(vm.model.clsMatterCode);
    }

    vm.options = {
      formState: {
        awesomeIsForced: false
      }
    };

    vm.notes = function() {
      $state.go('notes.list', {fileNo: vm.model.strFileNo1, fileName: vm.model.clsPrimaryClient.strName});
    }

    vm.accounts = function() {
      $state.go('accounts.list', {fileNo: vm.model.strFileNo1, fileName: vm.model.clsPrimaryClient.strName});
    }

    vm.openFolder = function() {
      $state.go('folders.list', {id: vm.model.strFileNo1, type: 'matter'});
    }

    vm.payments = function() {
      $state.go('payment-records.list', {fileNo: vm.model.strFileNo1});
    };

    vm.upload = function() {
      vm.uploadType = 'matter';
      vm.uploaded = 0;
      angular.element('.matter-upload').click();
    };

    vm.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
      var lastModifiedDate = typeof file.lastModified === "number" ? new Date(file.lastModified) : file.lastModifiedDate;

      var info = {
        "fileNo1": vm.model.strFileNo1,
        "documents":[
          {
            "FileName": fileObj.filename,
            "MimeType": fileObj.filetype,
            "dateCreate": lastModifiedDate.toISOString().replace('T', ' ').split('.')[0],
            "dateModify": lastModifiedDate.toISOString().replace('T', ' ').split('.')[0],
            "fileLength": fileObj.filesize,
            "base64": fileObj.base64
          }
        ]
      };

      contactService.upload(info, vm.uploadType).then(function(res) {
        vm.uploaded = vm.uploaded + 1;
        if (fileList.length == vm.uploaded) {
          alert('The file(s) uploaded successfully.');
        }
      })
      .catch(function(err) {
      });
    };
    // function definition
    vm.save = function () {
      delete vm.model.tmp;
      fileMatterService.save(vm.model).then(function (data) {
        if (data) {
          vm.model = data;
          // $state.reload();
        }
      })
    }

    vm.reset = function () {
      $state.reload();
    }

    vm.cancel = function () {
      $state.go('file-matters.list');
    }
  })

  .controller('matterformEditCtrl', function($filter, $stateParams, matterFormService, $state, Auth, $uibModal, growlService, refactorService) {
    var self = this;
    self.isDialog = false;
    self.viewMode = false;  // for edit / create
    self.userInfo = Auth.getUserInfo();
    self.can_edit = $state.$current.data.can_edit;
    self.create_new = $state.$current.data.can_edit;
    self.matterform = {
      selected: []
    };

    self.tabList = ['Summary', 'Matter', 'Parties-S', 'Parties', 'Solicitors', 
                    'Case', 'Price', 'Loan', 'Property', 'Bank', '$', 'Date', 'Text',
                    'Template', 'Premises & Rent', 'Term', 'Tenancy', 'Vehicles', 
                    'Others', 'Estate Agent', 'Reports', 'Arrears', 'Beneficiary',
                    'Chain', 'RPGT', 'Offers'];

    if($stateParams.code) {
      matterFormService.getItem($stateParams.code).then(function (item) {
        self.matterForm = item;
        self.matterForm_ = angular.copy(item);

        angular.forEach(JSON.parse(item.jsonTabs || "{}"), function (value, key) {
          self.matterform[value.TabName] = true;
          self.matterform.selected.push(value.TabName);
        })
      });
    } else {
      self.matterForm = {};
    }
    
    self.addTab = function (tab) {
      if (self.matterform[tab]) {
        self.matterform.selected.push(tab);
      } else {
        var index = self.matterform.selected.indexOf(tab);
        self.matterform.selected.splice(index, 1);
      }
    };

    self.changeOrder = function (x, y) {
      if (x < 0) {
        return;
      } else if (y == self.matterform.selected.length) {
        return;
      }
      self.matterform.selected.splice(y, 1, self.matterform.selected.splice(x, 1, self.matterform.selected[y])[0]);
    };

    self.new_ = function new_() {
      $state.go('matter-forms.new');
    }

    self.copy = function () {
      self.create_new = true;
      self.can_edit = true;
      self.matterForm_ = null;

      delete self.matterForm.code;
      delete self.matterForm.strDisplayName;
      delete self.matterForm.dtDateEntered;
      delete self.matterForm.dtDateUpdated;
    }

    self.save = function () {
      var selected = [];
      var i = 0;

      if (!self.matterForm.strDisplayName || !self.matterForm.strDisplayName.trim()) {
        alert('Please provide form name.');
        return false;
      }

      if (!self.matterform.selected.length) {
        alert('Please choose tabs.');
        return false;
      }

      angular.forEach(self.matterform.selected, function(value, key) {
        selected.push({
          TabName: value,
          Title: value,
          Ordering: ++i
        })
      })

      self.matterForm.jsonTabs = JSON.stringify(selected);
      entity = refactorService.getDiff(self.matterForm_, self.matterForm);

      matterFormService.save(entity).then(function (matterform) {
        $state.go('matter-forms.edit', {'code': matterform.code});
        growlService.growl('Saved successfully!', 'success');
      });
    }

    self.openDelete = function (event, entity) {
      event.stopPropagation();

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'deleteEntityModal.html',
        controller: 'deleteEntityModalCtrl',
        size: '',
        backdrop: 'static',
        keyboard: true,
        resolve: {
          entity: function () {
            return entity;
          }, 
          on_list: function () {
            return false;
          },
          entity_type: function () {
            return 'matter form';
          },
          service: function () {
            return matterFormService;
          },
          return_state: function () {
            return 'matter-forms.list';
          }
        }
      });
    };

    self.cancel = function () {
      $state.go('matter-forms.list');
    }
  })

  .controller('matterformListCtrl', function($uibModal, NgTableParams, matterFormService, Auth, $state) {
    var self = this;

    self.clickHandler = function (item) {
      $state.go('matter-forms.edit', {'code': item.code});
    }

    matterFormService.getList(1, 500).then(function(data) {
      self.data = data;
      self.dataReady = true;
      initializeTable();
    });

    function initializeTable () {
      //Filtering
      self.tableFilter = new NgTableParams({
        page: 1,      
        count: 25,
        sorting: {
          name: 'asc' 
        }
      }, {
        dataset: self.data
      })
    }
  })
