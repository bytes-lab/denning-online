materialAdmin
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
        return bankBranchService.getList(params.page(), params.count(), self.keyword).then(function(data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    })    

    function search() {
      self.tableFilter.reload();
    }
  })

  .controller('bankBranchEditCtrl', function($stateParams, bankBranchService, $state) {
    var self = this;
    self.cancel = cancel;

    bankBranchService.getItem($stateParams.id)
    .then(function(item){
      self.bankBranch = angular.copy(item);
    });

    function cancel() {
      $state.go('bank-branches.list');
    }
  })
