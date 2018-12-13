denningOnline
  .controller('bankCACListCtrl', function(NgTableParams, bankCACService, $state) {
    var self = this;

    bankCACService.getTableList(1, 500).then(function(data) {
      self.data = data.data;
      initializeTable();
    });
    
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

  .controller('bankCACEditCtrl', function($stateParams, bankCACService, cityService, $state, bankService, Auth,
                                          refactorService, $uibModalInstance, entityCode, isDialog, isNew, growlService) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();
    self._type = 'bank-CAC';

    self.isDialog = isDialog;
    self.can_edit = isNew;
    self.isNew = isNew;
    self.entityCode = isDialog ? entityCode : $stateParams.id;

    if (self.entityCode) {
      self.title = 'Edit Bank CAC';
      bankCACService.getItem(self.entityCode).then(function (item) {
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);
        self.popoutUrl = $state.href('bank-CACs.edit', { id: self.entity.code });

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
      self.title = 'New Bank CAC';
      self.entity = { };
      self.popoutUrl = $state.href('bank-CACs.new');
    }

    self.queryBanks = function(searchText) {
      return bankService.getTableList(1, 10, searchText).then(function(resp) {
        return resp.data;
      });
    };

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
      bankCACService.save(entity).then(function (item) {
        if (item) {
          if (self.isDialog) {
            $uibModalInstance.close(item);
          } else {
            if (self.entity_) {
              $state.reload();
            } else {
              $state.go('bank-CACs.edit', { 'id': item.code });
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
        $state.go('bank-CACs.list');
      }
    }
  })
