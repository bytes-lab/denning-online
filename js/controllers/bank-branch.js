denningOnline
  .controller('bankBranchListCtrl', function(NgTableParams, bankBranchService, $state) {
    var self = this;
    self.search = search;
    self.keyword = '';
    self.clickHandler = clickHandler;
    
    function clickHandler(item) {
      $state.go('bank-branches.edit', {'id': item.code});
    }

    self.tableFilter = new NgTableParams({
      page: 1,                // show first page
      count: 25,
      sorting: {
        name: 'asc'           // initial sorting
      }
    }, {
      getData: function(params) {
        return bankBranchService.getList(params.page(), params.count(), self.keyword)
        .then(function (data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    })    

    function search() {
      self.tableFilter.reload();
    }
  })

  .controller('bankBranchEditCtrl', function($stateParams, bankBranchService, $state, Auth, 
                                             bankService, bankCACService) 
  {
    var self = this;
    self.isDialog = false;
    self.viewMode = false;  // for edit / create
    self.cancel = cancel;
    self.userInfo = Auth.getUserInfo();
    self.create_new = $state.$current.data.can_edit;
    self.can_edit = $state.$current.data.can_edit;

    self.queryBanks = function(searchText) {
      return bankService.getTableList(1, 10, searchText).then(function(resp) {
        return resp.data;
      });
    };

    self.queryBankCACs = function(searchText) {
      return bankCACService.getTableList(1, 10, searchText).then(function(resp) {
        return resp.data;
      });
    };

    bankBranchService.getItem($stateParams.id).then(function(item) {
      self.bankBranch = item;
    });

    function cancel() {
      $state.go('bank-branches.list');
    }
  })

  .controller('bankBranchCreateModalCtrl', function ($uibModalInstance, party, viewMode, 
                                                     bankBranchService, Auth, bankService, 
                                                     bankCACService) 
  {
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

    self.queryBankCACs = function(searchText) {
      return bankCACService.getTableList(1, 10, searchText).then(function(resp) {
        return resp.data;
      });
    };

    if (viewMode) {
      bankBranchService.getItem(party.code).then(function(item) {
        self.bankBranch = item;
      });
    } else {
      self.bankBranch = {};
    }

    function save() {
      bankBranchService.save(self.contact).then(function(contact) {
        $uibModalInstance.close(contact);
      })
      .catch(function(err){
      });
    };

    function cancel() {
      $uibModalInstance.close();
    };
  })
