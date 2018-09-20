denningOnline
  .controller('billingitemListCtrl', function(NgTableParams, billingitemService, Auth, 
                                              $state) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 25,
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
                                              refactorService, fileMatterService, Auth, 
                                              matterCodeService, presetbillService,
                                              uibDateParser) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();

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

    if ($stateParams.id) {
      self.title = 'EDIT BILL ITEM';
      billingitemService.getItem($stateParams.id).then(function(item){
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);
      });
    } else {
      self.title = 'NEW BILL ITEM';
      self.entity = { };
    }
  })

  .controller('billItemModalCtrl', function(NgTableParams, billingitemService, Auth, 
                                            $state, $uibModalInstance, state, category) 
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
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    })

    self.search = function () {
      self.tableFilter.reload();
    }

    self.cancel = function () {
      $uibModalInstance.close();
    }

    self.addItems = function () {
      var items = [];
      for (key in self.items) {
        if (self.items[key]) {
          for (ii in self.tableFilter.data) {
            item = self.tableFilter.data[ii];
            if (item.strItemCode == key) {
              items.push({
                "boolIsDelete": "0",
                "boolIsFormula": item.boolFormula,
                "boolIsPrimaryFee": item.boolIsPrimary,
                "decTaxRate": item.decTaxRate,
                "decUnit": item.decDefaultUnit,
                "decUnitCost": parseFloat(item.decPricePerUnit) * parseFloat(item.decDefaultUnit),
                "decUnitPrice": item.decPricePerUnit,
                "intRank": item.intRank,
                "strBillItemType": item.strType == 'F' ? "Fees" : item.strType == 'D' ? "Disb" : "DisbWithTax",
                "strDescription": item.strDescription,
                "strItemCode": item.strItemCode,
                "strTaxCode": item.strTaxCode
              });
            }
          }
        }
      }

      $uibModalInstance.close(items);
    }

    self.createItem = function () {
      if ($uibModalInstance) {
        $uibModalInstance.close();
      }
      $state.go('billing.items-new');
    }
  })
