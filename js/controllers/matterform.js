materialAdmin
  .controller('fileMatterEditCtrl', function($scope, $stateParams, fileMatterService, contactService, $state) {
    var vm = this;
    vm.onSubmit = onSubmit;    
    vm.model = {};

    if ($stateParams.fileNo) {
      fileMatterService.getItem($stateParams.fileNo)
      .then(function(item){
        vm.item = item;
        vm.model = item;
        
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
                "label": vm.model.clsMatterCode.strGroupC1,
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
                "label": vm.model.clsMatterCode.strGroupC2,
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
                "label": vm.model.clsMatterCode.strGroupC3,
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
                "label": vm.model.clsMatterCode.strGroupC4,
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
                "label": vm.model.clsMatterCode.strGroupC5,
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
                "label": vm.model.clsMatterCode.strGroupL1,
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
                "label": vm.model.clsMatterCode.strGroupL2,
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
                "label": vm.model.clsMatterCode.strGroupL1,
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
                "label": vm.model.clsMatterCode.strGroupL2,
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
                "label": vm.model.clsMatterCode.strGroupL3,
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
            "label": "Templates",
            "groups": [
              {
                "key": "gen-docs-group",
                "label": "Template",
                "attrs": [
                  {
                    "key": "template",
                    "type": "gen-doc",
                    "templateOptions": {
                      "fileNo": vm.model.strFileNo1
                    }                
                  }
                ]
              }
            ]
          }
        ];
        
        // vm.textAreaModel = JSON.stringify(vm.tabs, null, 4);
      });
    }

    vm.options = {
      formState: {
        awesomeIsForced: false
      }
    };
    
    // $scope.$watch('vm.textAreaModel', function() {
    //   try {
    //     vm.tabs = JSON.parse(vm.textAreaModel);
    //   } catch(exp) {
    //   }
    // });

    vm.notes = function() {
      $state.go('notes.list', {fileNo: vm.item.systemNo, fileName: vm.item.primaryClient.name});
    }
    
    vm.accounts = function() {
      $state.go('accounts.list', {fileNo: vm.item.systemNo, fileName: vm.item.primaryClient.name});
    }
    
    vm.openFolder = function() {
      $state.go('folders.list', {id: vm.item.systemNo, type: 'matter'});
    }

    vm.payments = function() {
      $state.go('payment-records.list', {fileNo: vm.item.systemNo});
    };

    vm.upload = function() {
      vm.uploadType = 'matter';
      vm.uploaded = 0;
      angular.element('.matter-upload').click();
    };

    vm.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
      var info = {
        "fileNo1": vm.item.systemNo,
        "documents":[
          {
            "FileName": fileObj.filename,
            "MimeType": fileObj.filetype,
            "dateCreate": file.lastModifiedDate.toISOString().replace('T', ' ').split('.')[0],
            "dateModify": file.lastModifiedDate.toISOString().replace('T', ' ').split('.')[0],
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
      .catch(function(err){
      });
    };
    // function definition
    function onSubmit() {
      alert(JSON.stringify(vm.model), null, 2);
    }
  })

  .controller('matterformEditCtrl', function($filter, $stateParams, matterFormService, $state, Auth, $uibModal) {
    var self = this;
    self.copy = copy;
    self.save = save;
    self.cancel = cancel;
    self.isDialog = false;
    self.viewMode = false;  // for edit / create
    self.userInfo = Auth.getUserInfo();
    self.can_edit = $state.$current.data.can_edit;
    self.create_new = $state.$current.data.can_edit;
    self.matterform = {
      selected: []
    }

    self.tabList = ['Summary', 'Matter', 'Parties-S', 'Parties', 'Solicitors', 
                    'Case', 'Price', 'Loan', 'Property', 'Bank', '$', 'Date', 'Text',
                    'Templates'];

    if($stateParams.code) {
      matterFormService.getItem($stateParams.code).then(function(item){
        self.matterForm = item;

        angular.forEach(JSON.parse(item.jsonTabs), function(value, key) {
          self.matterform[value.TabName] = true;
          self.matterform.selected.push(value.TabName);
        })
        console.log(self.matterForm);
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
      if (x < 0)
        return;
      if (y == self.matterform.selected.length)
        return;
      self.matterform.selected.splice(y, 1, self.matterform.selected.splice(x, 1, self.matterform.selected[y])[0]);
    };

    function copy() {
      self.create_new = true;
      self.can_edit = true;
      
      delete self.matterForm.code;
      delete self.matterForm.strDisplayName;
    }

    function save() {
      var selected = [];
      var i = 0;
      angular.forEach(self.matterform.selected, function(value, key) {
        selected.push({
          TabName: value,
          Title: value,
          Ordering: ++i
        })
      })

      self.matterForm.jsonTabs = JSON.stringify(selected);
      console.log(self.matterForm);
      // matterFormService.save(self.matterForm).then(function(matterform) {
      //   self.matterForm = matterform;
      //   $state.go('matter-forms.edit', {'code': matterform.code});
      // });
    }

    function cancel() {
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
