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
                                             NgTableParams, $uibModal) 
  {
    var self = this;
    self.isDialog = false;

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
          }
        }
      }).result.then(function (res) {
        if (res.length > 0) {
          for (ii in res) {
            self.entity.listBilledItems.splice(idx+parseInt(ii)+1, 0, res[ii]);
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

    self.remove = function (idx) {
      self.entity.listBilledItems.splice(idx, 1);
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

    if ($stateParams.id) {
      self.title = 'PRESET BILL EDIT';
      presetbillService.getItem($stateParams.id).then(function (item){
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);
        initializeTable();
      });
    } else {
      self.title = 'NEW PRESET BILL';
      self.entity = {
        code: 'P' + Math.floor(Math.random() * 1000 + 1),
        strState: 'Common',
        strCategory: 'Conveyancing',
      };

      refreshItems();
    }

    self.save = function () {
      presetbillService.save(self.entity).then(function (presetbill) {
        self.entity = presetbill;
        $state.go('billing.presetbills-list');
      });
    }
  })
