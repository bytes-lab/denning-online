denningOnline
  .controller('receiptListCtrl', function(NgTableParams, receiptService, Auth, $state) {
    var self = this;
    self.userInfo = Auth.getUserInfo();
    self.accountType_ = 'disb';
    self.tableFilter = new NgTableParams({
      page: 1,
      count: 25,
    }, {
      getData: function(params) {
        return receiptService.getList(params.page(), params.count(), self.keyword, self.accountType_)
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

  .controller('receiptEditCtrl', function($stateParams, receiptService, $state, Auth, $scope,
                                          refactorService, fileMatterService, growlService,
                                          matterCodeService, presetbillService, invoiceService,
                                          uibDateParser, $uibModal, NgTableParams) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.isDialog = false;
    self.can_edit = $state.$current.data.can_edit;
    self.isNew = $state.$current.data.can_edit;

    self.itemType = 'All';

    self.queryMatters = function (search) {
      return fileMatterService.getList(1, 5, search).then(function (resp) {
        return resp.data
      })
    }

    $scope.open = function($event, opened) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[opened] = true;
    };

    self.matterChange = function (matter) {
      if (matter && matter.JsonDesc) {
        self.entity.fileNo = matter.key;
        var matterInfo = JSON.parse(matter.JsonDesc.replace(/[\u0000-\u0019]+/g,""));
        var clsPrimaryClient = matterInfo.primaryClient;
        self.entity.receivedFromName = clsPrimaryClient.name;
      }

      //   self.entity.matter = matterInfo.matter;
      //   self.matterDescription = self.entity.matter.description;
      //   if (matterInfo.propertyGroup[0]) {
      //     self.entity.strPropertyAddress = matterInfo.propertyGroup[0].fullTitle;
      //     self.entity.strState = matterInfo.propertyGroup[0]
      //   }
      //   self.entity.issueToName = clsPrimaryClient.name;
      //   self.entity.strClientName = clsPrimaryClient.name;
      // }
    }

    self.invoiceChange = function (item) {
      if (item && self.entity.strBillName != item.code) {
        // presetbillService.getItem(item.code).then(function (item) {
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

    if ($stateParams.id) {
      self.title = 'Edit Receipt';
      receiptService.getItem($stateParams.id).then(function (item){
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);
        self.entity.listBilledItems = [];

        if (self.entity.strBillName) {
          self.presetCode = {
            code: self.entity.strBillName
          }
        }

        if (self.entity.invoiceNo) {
          self.invoiceNo = {
            code: self.entity.invoiceNo
          }
        }

        self.fileNo = { key: self.entity.fileNo };
        self.entity.TransactionDate = uibDateParser.parse(self.entity.TransactionDate, 'yyyy-MM-dd HH:mm:ss');
      });
    } else {
      self.title = 'New Receipt';
      self.entity = {
        strState: 'Common',
        TransactionDate: uibDateParser.parse(new Date()),
        listBilledItems: []
      };
    }

    self.save = function () {
      entity = refactorService.getDiff(self.entity_, self.entity);
      receiptService.save(entity, self.entity_).then(function (item) {
        if (item) {  // ignore when errors
          if (self.entity_) {
            $state.reload();
          } else {
            $state.go('billing.receipts-edit', { 'id': item.code });
          }
          growlService.growl('Saved successfully!', 'success');
        }
      });
    }
  })
