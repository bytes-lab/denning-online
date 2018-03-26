materialAdmin
  .controller('bankBranchListCtrl', function($filter, $uibModal, NgTableParams, bankBranchService, Auth, $state) {
    var self = this;
    self.dataReady = false;
    self.openDelete = openDelete;
    self.userInfo = Auth.getUserInfo();
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
        count: 10,
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

    //Create Modal
    function modalInstances(animation, size, backdrop, keyboard, bankBranch) {
      var modalInstance = $uibModal.open({
        animation: animation,
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        backdrop: backdrop,
        keyboard: keyboard,
        resolve: {
          bankBranch: function () {
            return bankBranch;
          },
          on_list: function () {
            return true;
          }
        }      
      });
    }

    //Prevent Outside Click
    function openDelete(event, bankBranch) {
      event.stopPropagation();
      modalInstances(true, '', 'static', true, bankBranch)
    };    
  })

  .controller('ModalInstanceCtrl', function ($scope, $modalInstance, bankBranch, on_list, bankBranchService, $state) {
    $scope.ok = function () {
      bankBranchService.delete(bankBranch).then(function(bankBranch) {
        if (on_list)
          $state.reload();
        else
          $state.go('bank-branches.list');
      })
      .catch(function(err){
        //Handler

        //$scope.formname.bankBranchInfo.$error.push({meessage:''});
      });
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.close();
      if (on_list)
        $state.go('bank-branches.list');
    };
  })

  .controller('bankBranchEditCtrl', function($filter, $uibModal, $stateParams, bankBranchService, $state, Auth) {
    var self = this;
    self.save = save;
    self.cancel = cancel;
    self.isDialog = false;
    self.viewMode = false;  // for edit / create
    self.userInfo = Auth.getUserInfo();
    self.openDelete = openDelete;
    self.queryFields = queryFields;
    self.can_edit = false;    

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

    function save() {
      bankBranchService.save(self.bankBranch).then(function(bankBranch) {
        self.bankBranch = bankBranch;
        $state.go('bank-branches.list');
      })
      .catch(function(err){
        //Handler
      });
    }

    function cancel() {
      $state.go('bank-branches.list');      
    }

    //Create Modal
    function modalInstances1(animation, size, backdrop, keyboard, bankBranch) {
      var modalInstance = $uibModal.open({
        animation: animation,
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        backdrop: backdrop,
        keyboard: keyboard,
        resolve: {
          bankBranch: function () {
            return bankBranch;
          }, 
          on_list: function () {
            return false;
          }
        }      
      });
    }

    //Prevent Outside Click
    function openDelete(event, bankBranch) {
      event.stopPropagation();
      modalInstances1(true, '', 'static', true, bankBranch)
    };    
  })

  .controller('bankBranchCreateModalCtrl', function ($modalInstance, party, viewMode, bankBranchService, $scope, Auth) {
    var self = this;
    self.save = save;
    self.cancel = cancel;
    self.isDialog = true;
    self.viewMode = viewMode;
    self.userInfo = Auth.getUserInfo();

    if (viewMode) {
      bankBranchService.getItem(party.party.code)
      .then(function(item){
        self.bankBranch = item;
      });                  
    } else {
      self.bankBranch = {};
    }

    function save() {
      bankBranchService.save(self.bankBranch).then(function(bankBranch) {
        $modalInstance.close(bankBranch);
      })
      .catch(function(err){
        //Handler
      });
    };

    function cancel() {
      $modalInstance.close();
    };
  })
