materialAdmin
  .controller('bankBranchListCtrl', function($filter, $uibModal, NgTableParams, bankBranchService, Auth, $state) {
    var self = this;
    self.dataReady = false;
    self.clickHandler = clickHandler;

    bankBranchService.getList().then(function(data) {
      self.data = data;
      self.dataReady = true;
      initializeTable();
    });    
    
    function clickHandler(item) {
      $state.go('bank-branches.edit', {'id': item.code});
    }

    function initializeTable () {
      //Filtering
      self.tableFilter = new NgTableParams({
        page: 1,          // show first page
        count: 25,
        sorting: {
          name: 'asc'       // initial sorting
        }
      }, {
        total: self.data.length,  // length of data
        getData: function(params) {
          // use built-in angular filter
          var orderedData = params.filter() ? $filter('filter')(self.data, params.filter()) : self.data;
          orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
          params.total(orderedData.length); // set total for recalc pagination
          return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
        }
      })    
    } 
  })

  .controller('bankBranchEditCtrl', function($filter, $uibModal, $stateParams, bankBranchService, $state, Auth) {
    var self = this;
    self.save = save;
    self.cancel = cancel;
    self.isDialog = false;
    self.viewMode = false;  // for edit / create
    self.userInfo = Auth.getUserInfo();
    self.can_edit = false;
    self.queryFields = queryFields;

    function queryFields(field, searchText) {
      return self[field].filter(function(c) {
        return c.description.search(new RegExp(searchText, "i")) > -1;
      });
    }

    if ($stateParams.id) {
      bankBranchService.getItem($stateParams.id)
      .then(function(item){
        self.bankBranch = angular.copy(item);  // important
      });
    } else {
      self.bankBranch = {};
    }

    function cancel() {
      $state.go('bank-branches.list');      
    }
  })
