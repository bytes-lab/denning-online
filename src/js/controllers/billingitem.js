denningOnline
  .controller('billingitemListCtrl', function(NgTableParams, billingitemService, Auth, 
                                              $state) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 10,
    }, {
      getData: function(params) {
        return billingitemService.getList('All', params.page(), params.count(), self.keyword)
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

  .controller('billingitemEditCtrl', function($stateParams, billingitemService, $state,
                                              refactorService, matterService, Auth, 
                                              matterCodeService, presetbillService,
                                              uibDateParser, $uibModalInstance, growlService,
                                              entityCode, isDialog, isNew) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.isDialog = isDialog;
    self.can_edit = isNew;
    self.isNew = isNew;
    self.entityCode = isDialog ? entityCode: $stateParams.id;

    self.isDialog = false;
    self.can_edit = $state.$current.data.can_edit;
    self.isNew = $state.$current.data.can_edit;

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

    billingitemService.getStateList().then(function (resp) {
      self.states = resp.data;
    })

    if (self.entityCode) {
      self.title = 'Edit Bill Item';
      billingitemService.getItem(self.entityCode).then(function (item){
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);
      });
    } else {
      self.title = 'New Bill Item';
      self.entity = { };
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
      // delete entity.code;
      // if (self.entity_.strItemCode) {
      //   entity.strItemCode = self.entity_.strItemCode;
      // }
      
      billingitemService.save(entity).then(function (item) {
        if (item) {  // ignore when errors
          if (self.isDialog) {
            $uibModalInstance.close(item);
          } else {
            if (self.entity_) {
              $state.reload();
            } else {
              $state.go('billing.items-edit', { 'id': item.strItemCode });
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
        $state.go('billing.items-list');
      }
    }
  })

  .controller('billItemModalCtrl', function(NgTableParams, billingitemService, Auth, $state, 
                                            $uibModalInstance, state, category, excludes) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.itemType = 'All';
    self.items = {};

    self.filterItem = function (type) {
      self.itemType = type;
      self.tableFilter.reload();
    }

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 10,
    }, {
      getData: function(params) {
        return billingitemService.getList(self.itemType, params.page(), params.count(), self.keyword,
                                          state, category).then(function (data) {
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

    self.cancel = function () {
      $uibModalInstance.close();
    }

    self._addItems = function (items) {
      var res = [];
      for (ii in items) {
        item = items[ii];

        res.push({
          "boolIsDelete": "0",
          "code": item.code,
          "intItemID": item.code,
          "boolIsFormula": item.boolFormula,
          "boolIsPrimaryFee": item.boolIsPrimary,
          "decTaxRate": item.decTaxRate,
          "decUnit": item.decDefaultUnit.replace(',', '').replace('(', '').replace(')', ''),
          "decUnitCost": parseFloat(item.decPricePerUnit) * parseFloat(item.decDefaultUnit),
          "decUnitPrice": item.decPricePerUnit,
          "intRank": item.intRank,
          "strBillItemType": item.strType == 'F' ? "Fees" : item.strType == 'D' ? "Disb" : "DisbWithTax",
          "strDescription": item.strDescription,
          "strItemCode": item.strItemCode,
          "strTaxCode": item.strTaxCode
        });
      }

      $uibModalInstance.close(res);
    }

    self.addItems = function () {
      var items = [];
      for (key in self.items) {
        if (self.items[key]) {
          for (ii in self.tableFilter.data) {
            item = self.tableFilter.data[ii];
            if (item.strItemCode == key) {
              items.push(item);
            }
          }
        }
      }
      self._addItems(items);
    }

    self.createItem = function () {
      if ($uibModalInstance) {
        $uibModalInstance.close();
      }
      $state.go('billing.items-new');
    }
  })
