materialAdmin
  .controller('IRDBranchListCtrl', function($filter, $sce, $uibModal, NgTableParams, IRDBranchService, $state, Auth) {
    var self = this;
    self.dataReady = false;
    self.openDelete = openDelete;
    self.clickHandler = clickHandler;
    self.userInfo = Auth.getUserInfo();

    IRDBranchService.getList().then(function(data) {
      self.data = data;
      self.dataReady = true;
      initializeTable();
    });    

    function clickHandler(item) {
      $state.go('IRD-branches.edit', {'id': item.code});
    }
    
    function initializeTable () {
      //Filtering
      self.tableFilter = new NgTableParams({
        page: 1,      // show first page
        count: 10,
        sorting: {
          name: 'asc'   // initial sorting
        }
      }, {
        total: self.data.length, // length of data
        getData: function(params) {
          // use build-in angular filter
          var orderedData = params.filter() ? $filter('filter')(self.data, params.filter()) : self.data;
          orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
          params.total(orderedData.length); // set total for recalc pagination
          return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
        }
      })    
    }

    self.modalContent = 'Are you sure to delete the IRD Branch?';
  
    //Create Modal
    function modalInstances(animation, size, backdrop, keyboard, IRDBranch) {
      var modalInstance = $uibModal.open({
        animation: animation,
        templateUrl: 'myModalContent.html',
        controller: 'IRDBranchDeleteModalCtrl',
        size: size,
        backdrop: backdrop,
        keyboard: keyboard,
        resolve: {
          IRDBranch: function () {
            return IRDBranch;
          }
        }
      
      });
    }
    //Prevent Outside Click
    function openDelete(IRDBranch) {
      modalInstances(true, '', 'static', true, IRDBranch)
    };    
  })

  .controller('IRDBranchDeleteModalCtrl', function ($scope, $modalInstance, IRDBranch, IRDBranchService, $state) {
    $scope.ok = function () {
      IRDBranchService.delete(IRDBranch).then(function(IRDBranch) {
        $state.reload();
      })
      .catch(function(err){
        //Handler

        //$scope.formname.IRDBranchInfo.$error.push({meessage:''});
      });
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  })

  .controller('IRDBranchEditCtrl', function($filter, $stateParams, IRDBranchService, $state, Auth) {
    var self = this;
    self.save = save;
    self.cancel = cancel;
    self.isDialog = false;
    self.viewMode = false;  // for edit / create
    self.userInfo = Auth.getUserInfo();
    self.openDelete = openDelete;
    self.can_edit = false;

    if($stateParams.id) {
      IRDBranchService.getItem($stateParams.id)
      .then(function(item){
        self.IRDBranch = item;
      });
    } else {
      self.IRDBranch = {};
    }

    function save() {
      IRDBranchService.save(self.IRDBranch).then(function(IRDBranch) {
        self.IRDBranch = IRDBranch;
        $state.go('IRD-branches.list');
      })
      .catch(function(err){
        //Handler

        //$scope.formname.IRDBranchInfo.$error.push({meessage:''});
      });
    }

    function cancel() {
      $state.go('IRD-branches.list');      
    }

    //Create Modal
    function modalInstances1(animation, size, backdrop, keyboard, property) {
      var modalInstance = $uibModal.open({
        animation: animation,
        templateUrl: 'myModalContent.html',
        controller: 'propertyDeleteModalCtrl',
        size: size,
        backdrop: backdrop,
        keyboard: keyboard,
        resolve: {
          property: function () {
            return property;
          }, 
          on_list: function () {
            return false;
          }
        }      
      });
    }

    //Prevent Outside Click
    function openDelete(event, property) {
      event.stopPropagation();
      modalInstances1(true, '', 'static', true, property)
    };        
  })