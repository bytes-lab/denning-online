denningOnline
  .controller('paymentRequestListCtrl', function(NgTableParams, paymentRequestService, Auth, $state) {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 25,
    }, {
      getData: function(params) {
        return paymentRequestService.getList(params.page(), params.count(), self.keyword)
        .then(function (data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    })

    self.search = function (event, clear) {
      if(event.which == 13 || clear) { 
        if (clear) {
          self.keyword='';
        }
        self.tableFilter.reload();
      }
    }
  })

  .controller('paymentRequestEditCtrl', function($stateParams, paymentRequestService, $state, Auth,
                                          refactorService, matterService, growlService,
                                          matterCodeService, invoiceService,
                                          uibDateParser, $uibModal, NgTableParams) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.isDialog = false;
    self.can_edit = $state.$current.data.can_edit;
    self.isNew = $state.$current.data.can_edit;

    self.itemType = 'All';

    self.queryMatters = function (search) {
      return matterService.getList(1, 5, search).then(function (resp) {
        return resp.data
      })
    }

    self.matterChange = function (matter) {
      if (matter && matter.JsonDesc) {
        self.entity.fileNo = matter.key;
        var matterInfo = JSON.parse(matter.JsonDesc.replace(/[\u0000-\u0019]+/g,""));
        var clsPrimaryClient = matterInfo.primaryClient;

        self.entity.matter = matterInfo.matter;
        self.matterDescription = self.entity.matter.description;
        if (matterInfo.propertyGroup[0]) {
          self.entity.strPropertyAddress = matterInfo.propertyGroup[0].fullTitle;
          self.entity.strState = matterInfo.propertyGroup[0]
        }
        self.entity.issueToName = clsPrimaryClient.name;
        self.entity.strClientName = clsPrimaryClient.name;
      }
    }

    self.invoiceChange = function (item) {
      if (item && self.entity.strBillName != item.code) {
        // invoiceService.getItem(item.code).then(function (item) {
        //   self.entity.listBilledItems = item.listBilledItems;
        //   refreshItems();
        // });
      }
    }

    self.queryInvoices = function (keyword) {
      return invoiceService.getList(1, 10, self.entity.fileNo).then(function (resp) {
        return resp.data;
      });
    }

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
            return null;
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

      self.typeSST = {
        Fees: 0.0,
        Disb: 0.0,
        DisbWithTax: 0.0
      };

      for (ii in self.entity.listBilledItems) {
        var item = self.entity.listBilledItems[ii];
        self.typeSum[item.strBillItemType] += parseFloat(item.decUnitCost);
        self.typeSST[item.strBillItemType] += parseFloat(item.decUnitCost) * 
                                              parseFloat(item.decTaxRate);
        self.typeSum['All'] += parseFloat(item.decUnitCost);
      }

      self.tableFilter.reload();
    }

    self.filterItem = function (type) {
      self.itemType = type;
      self.tableFilter.reload();
    }

    if ($stateParams.id) {
      self.title = 'Edit Payment Request';
      paymentRequestService.getItem($stateParams.id).then(function (item){
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);
        self.entity.listBilledItems = [];
        initializeTable();

        if (self.entity.strBillName) {
          self.presetCode = {
            code: self.entity.strBillName
          }          
        }
      });
    } else {
      self.title = 'New Payment Request';
      self.entity = {
        strState: 'Common',
        dtCreateDate: uibDateParser.parse(new Date()),
        listBilledItems: []
      };
      initializeTable();
    }

    self.save = function () {
      entity = refactorService.getDiff(self.entity_, self.entity);
      paymentRequestService.save(entity, self.entity_).then(function (item) {
        if (item) {  // ignore when errors
          if (self.entity_) {
            $state.reload();
          } else {
            $state.go('billing.vouchers-edit', { 'id': item.code });
          }
          growlService.growl('Saved successfully!', 'success');          
        }
      });
    }
  })
