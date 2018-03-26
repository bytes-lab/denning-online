materialAdmin
  .controller('landPTGListCtrl', function($filter, $sce, $uibModal, NgTableParams, landPTGService, $state) {
    var self = this;
    self.dataReady = false;
    self.openDelete = openDelete;
    self.clickHandler = clickHandler;

    landPTGService.getList().then(function(data) {
      self.data = data;
      self.dataReady = true;
      initializeTable();
    });    

    function clickHandler(item) {
      $state.go('land-PTGs.edit', {'id': item.code});
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

    //Create Modal
    function modalInstances(animation, size, backdrop, keyboard, landPTG) {
      var modalInstance = $uibModal.open({
        animation: animation,
        templateUrl: 'myModalContent.html',
        controller: 'landPTGDeleteModalCtrl',
        size: size,
        backdrop: backdrop,
        keyboard: keyboard,
        resolve: {
          landPTG: function () {
            return landPTG;
          }
        }
      
      });
    }
    //Prevent Outside Click
    function openDelete(landPTG) {
      modalInstances(true, '', 'static', true, landPTG)
    };    
  })

  .controller('landPTGDeleteModalCtrl', function ($scope, $modalInstance, landPTG, landPTGService, $state) {
    $scope.ok = function () {
      landPTGService.delete(landPTG).then(function(landPTG) {
        $state.reload();
      })
      .catch(function(err){
        //Handler

        //$scope.formname.landPTGInfo.$error.push({meessage:''});
      });
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  })

  .controller('landPTGEditCtrl', function($filter, $stateParams, landPTGService, $state) {
    var self = this;
    self.save = save;

    if($stateParams.id) {
      landPTGService.getItem($stateParams.id)
      .then(function(item){
        self.landPTG = item;
      });
    } else {
      self.landPTG = {};
    }

    function save() {
      landPTGService.save(self.landPTG).then(function(landPTG) {
        self.landPTG = landPTG;
        $state.go('land-PTGs.list');
      })
      .catch(function(err){
        //Handler

        //$scope.formname.landPTGInfo.$error.push({meessage:''});
      });
    }
  })