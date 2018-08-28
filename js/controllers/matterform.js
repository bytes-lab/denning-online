denningOnline
  .controller('fileMatterEditCtrl', function($scope, $stateParams, fileMatterService, contactService, 
                                             $state, matterFormService, Auth, refactorService, 
                                             growlService) 
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
        if (arr[i].JsonField == key) {
          return arr[i].Label;
        }
      }
    }

    function buildTabDict (clsMatterCode) {
      var matter_code = [];
      if (clsMatterCode && clsMatterCode.jsonFieldLabels) {
        matter_code = JSON.parse(clsMatterCode.jsonFieldLabels);
      }

      vm.tabDict = {
        "Matter": {
          "label": "Info",
          "groups": [
            {
              "type": "file",
              "templateOptions": {
                "label": "Primary Client",
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
                "label": clsMatterCode ? getLabel(matter_code, 'clsLawyer1') : '',
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
                "label": clsMatterCode ? getLabel(matter_code, 'clsLawyer2') : '',
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
                "label": clsMatterCode ? getLabel(matter_code, 'clsLawyer3') : '',
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
                "label": clsMatterCode ? getLabel(matter_code, 'clsLawyer4') : '',
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
                "label": clsMatterCode ? getLabel(matter_code, 'clsBank1') : '',
              }
            },
            {
              "type": "bank2",
              "templateOptions": {
                "label": clsMatterCode ? getLabel(matter_code, 'clsBank2') : '',
              }
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
      fileMatterService.getItem($stateParams.fileNo).then(function (item) {
        if (item) {
          vm.idxTab = 5;  // any none zero value
          vm.model = item;
          vm.model_ = angular.copy(vm.model);
          vm.model.tmp = editControl;
          vm.model.tmp.oldMatterCode = item.clsMatterCode;          
          vm.title = `Matter : ${vm.model.strFileNo1} ( ${vm.model.clsPrimaryClient.strName} )`;
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

    vm.upload = function () {
      vm.uploadType = 'matter';
      vm.uploaded = 0;
      angular.element('.matter-upload').click();
    };

    vm.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
      var lastModifiedDate = file.lastModifiedDate;
      if (typeof file.lastModified === "number") {
        lastModified = new Date(file.lastModified);
      }

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
    
    vm.save = function () {
      delete vm.model.tmp;
      model = refactorService.getDiff(vm.model_, vm.model);

      if (vm.model_) {
        model.strFileNo1 = vm.model_.strFileNo1;
      }

      fileMatterService.save(model).then(function (data) {
        vm.model.tmp = editControl;
     
        if (data) { // create success or update
          if (vm.model_) {
            // vm.model = data;
            vm.model.tmp.oldMatterCode = data.clsMatterCode;
            // $state.reload();
          } else {
            $state.go('file-matters.edit', { 'fileNo': data.strFileNo1 });
          }
          growlService.growl('Saved successfully!', 'success');          
        }
      })
    }

    vm.reset = function () {
      $state.reload();
    }
  })

  .controller('matterformEditCtrl', function($filter, $stateParams, matterFormService, $state, Auth, 
                                             $uibModal, growlService, refactorService) 
  {
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

      var arr = self.matterform.selected.splice(x, 1, self.matterform.selected[y]);
      self.matterform.selected.splice(y, 1, arr[0]);
    };

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
  })

  .controller('matterformListCtrl', function($uibModal, NgTableParams, matterFormService, Auth, $state) 
  {
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
