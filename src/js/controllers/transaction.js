denningOnline
  .controller('transactionListCtrl', function(NgTableParams, $stateParams, transactionService, Auth, $state) {
    var self = this;
    self.userInfo = Auth.getUserInfo();
    self.type = $stateParams.type;

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 10,
    }, {
      getData: function(params) {
        return transactionService.getList(self.type, params.page(), params.count(), self.keyword)
        .then(function (data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    })

    self.search = function (event, clear) {
      if(event.which == 13 || clear) { 
        if (clear) {
          self.keyword = '';
        }
        self.tableFilter.reload();
      }
    }

    self.goDetail = function (code) {
      $state.go('billing.'+self.type+'-edit', { id: code });
    }
  })

  .controller('generalJournalEditCtrl', function($stateParams, transactionService, $state, Auth, $scope,
                                          refactorService, matterService, growlService,
                                          matterCodeService, presetbillService,
                                          uibDateParser, $uibModal, NgTableParams) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.isDialog = false;
    self.can_edit = $state.$current.data.can_edit;
    self.isNew = $state.$current.data.can_edit;

    $scope.open = function($event, opened) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[opened] = true;
    };

    if ($stateParams.id) {
      self.title = 'Edit General Journal';
      transactionService.getItem($stateParams.id).then(function (item){
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);

        if (self.entity.strBillName) {
          self.presetCode = {
            code: self.entity.strBillName
          }          
        }
      });
    } else {
      self.title = 'New General Journal';
      self.entity = {
        dtCreateDate: uibDateParser.parse(new Date()),
      };
    }

    self.save = function () {
      entity = refactorService.getDiff(self.entity_, self.entity);
      transactionService.save(entity, self.entity_).then(function (item) {
        if (item) {  // ignore when errors
          if (self.entity_) {
            $state.reload();
          } else {
            $state.go('billing.GJ-edit', { 'id': item.strTransactionDoc });
          }
          growlService.growl('Saved successfully!', 'success');          
        }
      });
    }
  })

  .controller('creditNoteEditCtrl', function($stateParams, transactionService, $state, Auth, $scope,
                                             refactorService, matterService, growlService,
                                             matterCodeService, presetbillService,
                                             uibDateParser, $uibModal, NgTableParams) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.isDialog = false;
    self.can_edit = $state.$current.data.can_edit;
    self.isNew = $state.$current.data.can_edit;

    $scope.open = function($event, opened) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[opened] = true;
    };

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

    if ($stateParams.id) {
      self.title = 'Edit Credit Note';
      transactionService.getItem($stateParams.id).then(function (item){
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);
      });
    } else {
      self.title = 'New Credit Note';
      self.entity = {
        dtTransactionDate: uibDateParser.parse(new Date()),
      };
    }

    self.save = function () {
      entity = refactorService.getDiff(self.entity_, self.entity);
      transactionService.save(entity, self.entity_).then(function (item) {
        if (item) {  // ignore when errors
          if (self.entity_) {
            $state.reload();
          } else {
            $state.go('billing.credit-note-edit', { 'id': item.code });
          }
          growlService.growl('Saved successfully!', 'success');          
        }
      });
    }
  })

  .controller('debitNoteEditCtrl', function($stateParams, transactionService, $state, Auth, $scope,
                                            refactorService, matterService, growlService,
                                            matterCodeService, presetbillService,
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

    if ($stateParams.id) {
      self.title = 'Edit Debit Note';
      transactionService.getItem($stateParams.id).then(function (item){
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);
      });
    } else {
      self.title = 'New Debit Note';
      self.entity = {
        dtTransactionDate: uibDateParser.parse(new Date()),
      };
    }

    self.save = function () {
      entity = refactorService.getDiff(self.entity_, self.entity);
      transactionService.save(entity, self.entity_).then(function (item) {
        if (item) {  // ignore when errors
          if (self.entity_) {
            $state.reload();
          } else {
            $state.go('billing.debit-note-edit', { 'id': item.code });
          }
          growlService.growl('Saved successfully!', 'success');          
        }
      });
    }
  })

  .controller('IATEditCtrl', function($stateParams, transactionService, $state, Auth, $scope,
                                      refactorService, matterService, growlService,
                                      uibDateParser, $uibModal, NgTableParams) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.isDialog = false;
    self.can_edit = $state.$current.data.can_edit;
    self.isNew = $state.$current.data.can_edit;

    $scope.open = function($event, opened) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[opened] = true;
    };

    if ($stateParams.id) {
      self.title = 'Edit IAT';
      transactionService.getItem($stateParams.id).then(function (item) {
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);
      });
    } else {
      self.title = 'New IAT';
      self.entity = {
        dtTransactionDate: uibDateParser.parse(new Date()),
      };
    }

    self.save = function () {
      entity = refactorService.getDiff(self.entity_, self.entity);
      transactionService.save(entity, self.entity_).then(function (item) {
        if (item) {  // ignore when errors
          if (self.entity_) {
            $state.reload();
          } else {
            $state.go('billing.IAT-edit', { 'id': item.strTransactionDoc });
          }
          growlService.growl('Saved successfully!', 'success');
        }
      });
    }
  })
