denningOnline
  .controller('matterformListCtrl', function($uibModal, NgTableParams, matterFormService, 
                                             Auth, $state) 
  {
    var self = this;

    matterFormService.getList(1, 500).then(function(data) {
      self.data = data;
      initializeTable();
    });

    function initializeTable () {
      self.tableFilter = new NgTableParams({
        page: 1,
        count: 25
      }, {
        dataset: self.data
      })
    }
  })

  .controller('matterformEditCtrl', function($filter, $stateParams, matterFormService, $state, 
                                             $uibModal, growlService, refactorService, Auth)
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
        if (matterform) {
          $state.go('matter-forms.edit', {'code': matterform.code});
          growlService.growl('Saved successfully!', 'success');          
        }
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
