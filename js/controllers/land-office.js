materialAdmin
  .controller('landOfficeListCtrl', function($filter, $sce, $uibModal, NgTableParams, landOfficeService, $state) {
    var self = this;
    self.dataReady = false;
    self.openDelete = openDelete;
    self.clickHandler = clickHandler;

    function clickHandler(item) {
      $state.go('land-offices.edit', {'id': item.code});
    }

    landOfficeService.getList().then(function(data) {
      self.data = data;
      self.dataReady = true;
      initializeTable();
    });    
    
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

          this.data = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
          params.total(orderedData.length); // set total for recalc pagination
          return this.data;
        }
      })    
    }

    //Create Modal
    function modalInstances(animation, size, backdrop, keyboard, landOffice) {
      var modalInstance = $uibModal.open({
        animation: animation,
        templateUrl: 'myModalContent.html',
        controller: 'landOfficeDeleteModalCtrl',
        size: size,
        backdrop: backdrop,
        keyboard: keyboard,
        resolve: {
          landOffice: function () {
            return landOffice;
          }
        }
      
      });
    }
    //Prevent Outside Click
    function openDelete(landOffice) {
      modalInstances(true, '', 'static', true, landOffice)
    };    
  })

  .controller('landOfficeDeleteModalCtrl', function ($scope, $modalInstance, landOffice, landOfficeService, $state) {
    $scope.ok = function () {
      landOfficeService.delete(landOffice).then(function(landOffice) {
        $state.reload();
      })
      .catch(function(err){
        //Handler

        //$scope.formname.landOfficeInfo.$error.push({meessage:''});
      });
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  })

  .controller('landOfficeEditCtrl', function($filter, $stateParams, landOfficeService, $state, Auth) {
    var self = this;
    self.userInfo = Auth.getUserInfo();    
    self.save = save;
    self.cancel = cancel;
    self.isDialog = false;
    self.viewMode = false;  // for edit / create
    self.userInfo = Auth.getUserInfo();
    self.openDelete = openDelete;
    self.can_edit = false;

    if($stateParams.id) {
      landOfficeService.getItem($stateParams.id)
      .then(function(item){
        self.landOffice = item;
      });
    } else {
      self.landOffice = {};
    }

    function cancel() {
      $state.go('land-offices.list');      
    }

    function save() {
      landOfficeService.save(self.landOffice).then(function(landOffice) {
        self.landOffice = landOffice;
        $state.go('land-offices.list');
      })
      .catch(function(err){
      });
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