denningOnline
  .controller('presetbillListCtrl', function($filter, $uibModal, NgTableParams, $state, presetbillService)
  {
    var self = this;

    self.tableFilter = new NgTableParams({}, {
      getData: function(params) {
        return presetbillService.getList(params.page(), params.count(), self.keyword)
        .then(function (data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    });

    self.search = function (event, clear) {
      if(event.which == 13 || clear) { 
        if (clear) {
          self.keyword='';
        }
        self.tableFilter.reload();
      }
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
    self.taxType = 'NoTax';

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

    self.insertAddOn = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'addOnBillModal.html',
        controller: 'addOnBillModalCtrl as vm',
        size: 'md',
        keyboard: true,
        resolve: {
          excludes: function () {
            var arr = [];
            return arr;
          }
        }
      }).result.then(function (res) {
        if (res && res.length > 0) {
          Promise.all(res.map(function(bill) {
            return presetbillService.getItemV2(bill.code);
          })).then(function(bills) {
            for (ii in bills) {
              self.entity.listAddOn.push({
                code: bills[ii].code,
                strDescription: bills[ii].strDescription,
                listAddOnItems: bills[ii].listMainItems
              })
            }
          });
        }
      }, function (res) {});
    };

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
            for (ii in self.entity.listMainItems) {
              var item = self.entity.listMainItems[ii];
              arr.push(item.strItemCode);
            }
            return arr;
          }
        }
      }).result.then(function (res) {
        if (res && res.length > 0) {
          for (ii in res) {
            if (idx != -1) {
              self.entity.listMainItems.splice(idx+parseInt(ii)+1, 0, res[ii]);
            } else {
              self.entity.listMainItems.push(res[ii]);
            }
          }
          refreshItems();
        }
      }, function (res) {});
    }

    self.move = function (x, y) {
      if (x < 0) {
        return;
      } else if (y == self.entity.listMainItems.length) {
        return;
      }

      var b = self.entity.listMainItems[y];
      self.entity.listMainItems[y] = self.entity.listMainItems[x];
      self.entity.listMainItems[x] = b;
      self.tableFilter.reload();
    };

    self.remove = function (code) {
      for (ii in self.entity.listMainItems) {
        var item = self.entity.listMainItems[ii];
        if (item.strItemCode == code) {
          self.entity.listMainItems.splice(ii, 1);
          break;
        }
      }
      refreshItems();
    }

    function initializeTable () {
      self.tableFilter = new NgTableParams({
        page: 1,
        count: 10,
        sorting: {
          name: 'asc' 
        }
      }, {
        counts: [],
        getData: function (params) {
          return self.entity.listMainItems.filter(function (item) {
            return self.itemType == 'All' || 
                   item.strBillItemType == self.itemType || 
                   item.strTaxCode == self.taxType;
          })
        } 
      });
      
      refreshItems();
    }

    function refreshItems () {
      self.gross = {
        All: 0.0,
        Fees: 0.0,
        Disb: 0.0,
        DisbWithTax: 0.0
      };

      self.sst = {
        Fees: 0.0,
        Disb: 0.0,
        DisbWithTax: 0.0
      };

      var G0001 = null;
      for (ii in self.entity.listMainItems) {
        var item = self.entity.listMainItems[ii];
        if (item.strItemCode != 'G0001') {
          item.decUnitCost = refactorService.convertFloat(item.decUnitPrice) * refactorService.convertFloat(item.decUnit);
          item.decUnitTax = refactorService.convertFloat(item.decTaxRate) * item.decUnitCost;
          item.decTotal = item.decUnitCost + item.decUnitTax;

          self.gross[item.strBillItemType] += item.decUnitCost;
          self.sst[item.strBillItemType] += item.decUnitTax;
          self.gross['All'] += item.decUnitCost;
        } else {
          G0001 = item;
        }
      }

      if (G0001) {
        G0001.decUnitPrice = self.sst.Fees + self.sst.DisbWithTax;
        G0001.decUnitCost = self.sst.Fees + self.sst.DisbWithTax;
        G0001.decTotal = item.decUnitCost + item.decUnitTax;
      }

      self.tableFilter.reload();
    }

    self.filterItem = function (type, tax) {
      self.itemType = type;
      self.taxType = tax;
      self.tableFilter.reload();
    }

    if (self.entityCode) {
      self.title = 'Preset Bill Edit';
      presetbillService.getItemV2(self.entityCode).then(function (item){
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);
        initializeTable();
      });
    } else {
      self.title = 'New Preset Bill';
      self.entity = {
        strState: 'Common',
        strCategory: 'Conveyancing',
        listAddOn: [],
        listMainItems: []
      };

      initializeTable();
    }

    self.removeAddOn = function(idx) {
      self.entity.listAddOn.splice(idx, 1);
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
      presetbillService.save(entity, self.entity_).then(function (item) {
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

  .controller('addOnBillModalCtrl', function($filter, $stateParams, presetbillService, 
                                             $state, billingitemService, refactorService,
                                             NgTableParams, $uibModal, $uibModalInstance,
                                             growlService, excludes) 
  {
    var self = this;
    self.items = {};

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 10,
    }, {
      getData: function(params) {
        return presetbillService.getTableList(params.page(), params.count(), self.keyword)
        .then(function (data) {
          params.total(data.headers('x-total-count') - excludes.length);
          return data.data.filter(function (item) {
            return excludes.indexOf(item.strItemCode) == -1;
          });
        });
      }
    })

    self.search = function () {
      self.tableFilter.reload();
    }

    self.addBills = function () {
      var items = [];
      for (key in self.items) {
        if (self.items[key]) {
          for (ii in self.tableFilter.data) {
            item = self.tableFilter.data[ii];
            if (item.code == key) {
              items.push(item);
            }
          }
        }
      }

      $uibModalInstance.close(items);
    }

    self.cancel = function () {
      $uibModalInstance.close();
    }
  })