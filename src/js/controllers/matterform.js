denningOnline
  .controller('matterformListCtrl', function($uibModal, NgTableParams, matterFormService, 
                                             Auth, $state) 
  {
    var self = this;
    self.filterType = 'Online';

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 10,
    }, {
      getData: function(params) {
        return matterFormService.getList(params.page(), params.count(), self.keyword, self.filterType)
        .then(function (data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    })

    self.search = function () {
      self.tableFilter.reload();
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

    self.tabList = ['Summary', 'Summary (L)', 'Summary (LT)', 'Summary (A)', 'Matter', 'Parties-S', 'Parties', 
                    'Case', 'Price', 'Loan', 'Loan (T)', 'Property', 'Bank', '$', 'Date', 'Text', 'Solicitors', 
                    'Template', 'Premises & Rent', 'Term', 'Tenancy', 'Vehicles', 
                    'Others', 'Estate Agent', 'Reports', 'Arrears', 'Beneficiary',
                    'Chain', 'RPGT', 'Offers'];

    if($stateParams.code) {
      matterFormService.getItem($stateParams.code).then(function (item) {
        self.entity = item;
        self.entity_ = angular.copy(item);

        angular.forEach(JSON.parse(item.jsonTabs || "{}"), function (value, key) {
          self.matterform[value.TabName] = true;
          self.matterform.selected.push(value.TabName);
        })
      });
    } else {
      self.entity = {
        strDesignFor: 'Online'
      };
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
      self.entity_ = null;

      delete self.entity.code;
      delete self.entity.strDisplayName;
      delete self.entity.dtDateEntered;
      delete self.entity.dtDateUpdated;
    }

    self.save = function () {
      var selected = [];
      var i = 0;

      if (!self.entity.strDisplayName || !self.entity.strDisplayName.trim()) {
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

      self.entity.jsonTabs = JSON.stringify(selected);
      entity = refactorService.getDiff(self.entity_, self.entity);

      matterFormService.save(entity).then(function (matterform) {
        if (self.entity_) {
          $state.reload();
        } else {
          $state.go('matter-forms.edit', {'code': matterform.code});
        }
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
