denningOnline
  .controller('bankBranchListCtrl', function(NgTableParams, bankBranchService, $state) {
    var self = this;
    self.search = search;
    self.keyword = '';
    self.clickHandler = clickHandler;
    
    function clickHandler(item) {
      $state.go('bank-branches.edit', {'id': item.code});
    }

    self.tableFilter = new NgTableParams({
      page: 1,                // show first page
      count: 10,
      sorting: {
        name: 'asc'           // initial sorting
      }
    }, {
      getData: function(params) {
        return bankBranchService.getList(params.page(), params.count(), self.keyword)
        .then(function (data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    });

    function search() {
      self.tableFilter.reload();
    }
  })

  .controller('bankBranchEditCtrl', function($stateParams, bankBranchService, $state, Auth, cityService,
                                             bankService, bankCACService, $uibModalInstance, 
                                             entityCode, isDialog, isNew, refactorService, growlService) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();
    self._type = 'bank-branch';

    self.isDialog = isDialog;
    self.can_edit = isNew;
    self.isNew = isNew;
    self.entityCode = isDialog ? entityCode : $stateParams.id;

    self.queryBanks = function(searchText) {
      return bankService.getTableList(1, 10, searchText).then(function(resp) {
        return resp.data;
      });
    };

    self.queryBankCACs = function(searchText) {
      return bankCACService.getTableList(1, 10, searchText).then(function(resp) {
        return resp.data;
      });
    };

    if (self.entityCode) {
      self.title = 'Edit Bank Branch';
      bankBranchService.getItem(self.entityCode).then(function (item) {
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);
        self.popoutUrl = $state.href('bank-branches.edit', { id: self.entity.code });

        if (self.entity.strPostCode) {
          self.strPostCode_ = {
            postcode: self.entity.strPostCode,
            city: self.entity.strCity,
            state: self.entity.strState,
            country: self.entity.strCountry
          };
        }
      });
    } else {
      self.title = 'New Bank Branch';
      self.entity = { };
      self.popoutUrl = $state.href('bank-branches.new');
    }

    self.queryPostcodes = function (searchText) {
      return cityService.getList(1, 10, searchText).then(function (resp) {
        return resp.data;
      });
    }

    self.postcodeChange = function (item) {
      if (item) {
        self.entity.strPostCode = item.postcode;
        self.entity.strCity = item.city;
        self.entity.strState = item.state;
        self.entity.strCountry = item.country;
      }
    }

    self.copy = function () {
      self.isNew = true;
      self.can_edit = true;
      self.entity_ = null;

      var deleteList = ['code', 'dtDateEntered', 'dtDateUpdated'];
      
      for (ii in deleteList) {
        key = deleteList[ii];
        delete self.entity[key];
      }
    }

    self.save = function () {
      entity = refactorService.getDiff(self.entity_, self.entity);
      bankBranchService.save(entity).then(function (item) {
        if (item) {
          if (self.isDialog) {
            $uibModalInstance.close(item);
          } else {
            if (self.entity_) {
              $state.reload();
            } else {
              $state.go('bank-branches.edit', { 'id': item.code });
            }
            growlService.growl('Saved successfully!', 'success');          
          }
        }
      });
    }

    self.cancel = function () {
      if (self.isDialog) {
        $uibModalInstance.close();
      } else {
        $state.go('bank-branches.list');
      }
    }
  })
