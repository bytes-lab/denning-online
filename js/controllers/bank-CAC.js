materialAdmin
  .controller('bankCACListCtrl', function(NgTableParams, bankCACService, $state) {
    var self = this;
    self.dataReady = false;
    self.clickHandler = clickHandler;

    function clickHandler(item) {
      $state.go('bank-CACs.edit', {'id': item.code});
    }

    bankCACService.getTableList(1, 500).then(function(data) {
      self.data = data.data;
      self.dataReady = true;
      initializeTable();
    });    
    
    function initializeTable () {
      //Filtering
      self.tableFilter = new NgTableParams({
        page: 1,      // show first page
        count: 25,
        sorting: {
          name: 'asc'   // initial sorting
        }
      }, {
        dataset: self.data
      })    
    }   
  })

  .controller('bankCACDeleteModalCtrl', function ($scope, $uibModalInstance, bank_CAC, bankCACService, $state) {
    $scope.ok = function () {
      bankCACService.delete(bank_CAC).then(function(bank_CAC) {
        $state.reload();
      })
      .catch(function(err){
        //Handler

        //$scope.formname.bank_CACInfo.$error.push({meessage:''});
      });
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  })

  .controller('bankCACEditCtrl', function($stateParams, bankCACService, $state, bankService, Auth) {
    var self = this;
    self.save = save;
    self.isDialog = false;
    self.viewMode = false;  // for edit / create
    self.cancel = cancel;
    self.userInfo = Auth.getUserInfo();
    self.create_new = $state.$current.data.can_edit;
    self.can_edit = $state.$current.data.can_edit;

    if($stateParams.id) {
      bankCACService.getItem($stateParams.id)
      .then(function(item){
        self.bank_CAC = item;
      });
    } else {
      self.bank_CAC = {};
    }

    self.queryBanks = function(searchText) {
      return bankService.getTableList(1, 10, searchText).then(function(resp) {
        return resp.data;
      });
    };

    function cancel() {
      $state.go('bank-CACs.list');
    }

    function save() {
      bankCACService.save(self.bank_CAC).then(function(bank_CAC) {
        self.bank_CAC = bank_CAC;
        $state.go('bank-CACs.list');
      })
      .catch(function(err){
      });
    }
  })

  .controller('bankCACCreateModalCtrl', function ($uibModalInstance, party, viewMode, Auth, bankService, bankCACService) {
    var self = this;
    self.save = save;
    self.cancel = cancel;
    self.isDialog = true;
    self.viewMode = viewMode;
    self.userInfo = Auth.getUserInfo();
    self.create_new = !viewMode;
    self.can_edit = !viewMode;

    self.queryBanks = function(searchText) {
      return bankService.getTableList(1, 10, searchText).then(function(resp) {
        return resp.data;
      });
    };

    if (viewMode) {
      bankCACService.getItem(party.code).then(function(item) {
        self.bank_CAC = item;
      });
    } else {
      self.bank_CAC = {};
    }

    function save() {
      bankCACService.save(self.contact).then(function(contact) {
        $uibModalInstance.close(contact);
      })
      .catch(function(err){
      });
    };

    function cancel() {
      $uibModalInstance.close();
    };
  })
