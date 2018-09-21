denningOnline
  .controller('presetbillListCtrl', function($filter, $uibModal, NgTableParams, $state, 
                                             presetbillService) 
  {
    var self = this;

    presetbillService.getList(1, 500).then(function(data) {
      self.data = data;
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

  .controller('presetbillEditCtrl', function($filter, $stateParams, presetbillService, 
                                             $state, billingitemService, refactorService,
                                             NgTableParams, $uibModal, $uibModalInstance, 
                                             entityCode, isDialog, isNew, Auth, growlService) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.isDialog = isDialog;
    self.can_edit = isNew;
    self.isNew = isNew;
    self.entityCode = isDialog ? entityCode : $stateParams.id;

    billingitemService.getStateList().then(function (resp) {
      self.states = resp.data;
    })

    self.itemType = 'All';

    self.categories = [
      'Conveyancing',
      'Agreement',
      'Litigation',
      'Will',
      'Estate Admin',
      'Tenancy',
      'Discharge of Charge',
      'Divorce',
      'Corporate Secretarial',
      'General',
      'Common'
    ];

    self.insert = function (idx) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'billItemModal.html',
        controller: 'billItemModalCtrl as vm',
        size: 'lg',
        keyboard: true,
        resolve: {
          state: function () {
            return self.entity.strState;
          },
          category: function () {
            return self.entity.strCategory;
          },
          excludes: function () {
            var arr = [];
            for (ii in self.entity.listBilledItems) {
              var item = self.entity.listBilledItems[ii];
              arr.push(item.strItemCode);
            }
            return arr;
          }
        }
      }).result.then(function (res) {
        if (res && res.length > 0) {
          for (ii in res) {
            if (idx != -1) {
              self.entity.listBilledItems.splice(idx+parseInt(ii)+1, 0, res[ii]);
            } else {
              self.entity.listBilledItems.push(res[ii]);
            }
          }
          refreshItems();
        }
      }, function (res) {});
    }

    self.move = function (x, y) {
      if (x < 0) {
        return;
      } else if (y == self.entity.listBilledItems.length) {
        return;
      }

      var b = self.entity.listBilledItems[y];
      self.entity.listBilledItems[y] = self.entity.listBilledItems[x];
      self.entity.listBilledItems[x] = b;
      self.tableFilter.reload();
    };

    self.remove = function (code) {
      for (ii in self.entity.listBilledItems) {
        var item = self.entity.listBilledItems[ii];
        if (item.strItemCode == code) {
          self.entity.listBilledItems.splice(ii, 1);
          break;
        }
      }
      refreshItems();
    }

    function initializeTable () {
      self.tableFilter = new NgTableParams({
        page: 1,
        count: 25,
        sorting: {
          name: 'asc' 
        }
      }, {
        counts: [],
        getData: function (params) {
          return self.entity.listBilledItems.filter(function (item) {
            return self.itemType == 'All' || item.strBillItemType == self.itemType;
          })
        } 
      });
      
      refreshItems();
    }

    function refreshItems () {
      self.typeSum = {
        All: 0.0,
        Fees: 0.0,
        Disb: 0.0,
        DisbWithTax: 0.0
      };

      for (ii in self.entity.listBilledItems) {
        var item = self.entity.listBilledItems[ii];
        self.typeSum[item.strBillItemType] += parseFloat(item.decUnitCost);
        self.typeSum['All'] += parseFloat(item.decUnitCost);
      }

      self.tableFilter.reload();
    }

    self.filterItem = function (type) {
      self.itemType = type;
      self.tableFilter.reload();
    }

    if (self.entityCode) {
      self.title = 'Preset Bill Edit';
      presetbillService.getItem(self.entityCode).then(function (item){
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);
        initializeTable();
      });
    } else {
      self.title = 'New Preset Bill';
      self.entity = {
        code: 'P' + Math.floor(Math.random() * 1000 + 1),
        strState: 'Common',
        strCategory: 'Conveyancing',
        listBilledItems: []
      };

      initializeTable();
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
      presetbillService.save(entity).then(function (item) {
        if (item) {  // ignore when errors
          if (self.isDialog) {
            $uibModalInstance.close(item);
          } else {
            if (self.entity_) {
              $state.reload();
            } else {
              $state.go('billing.presetbills-edit', { 'id': item.code });
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
        $state.go('billing.presetbills-list');
      }
    }
  })
