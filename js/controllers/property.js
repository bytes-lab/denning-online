materialAdmin
  .controller('propertyListCtrl', function($sce, $uibModal, NgTableParams, propertyService, $state, Auth) {
    var self = this;
    self.dataReady = false;
    self.clickHandler = clickHandler;
    self.userInfo = Auth.getUserInfo();
    self.search = search;
    self.keyword = '';

    function clickHandler(item) {
      $state.go('properties.edit', {'id': item.code});
    }

    self.tableFilter = new NgTableParams({
      page: 1,      // show first page
      count: 25,
      sorting: {
        name: 'asc'   // initial sorting
      }
    }, {
      getData: function(params) {
        return propertyService.getList(params.page(), params.count(), self.keyword).then(function(data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    })    

    function search() {
      self.tableFilter.reload();
    }
  })

  .controller('propertyDeleteModalCtrl', function ($scope, $modalInstance, property, propertyService, $state) {
    $scope.ok = function () {
      propertyService.delete(property).then(function(property) {
        $state.reload();
      })
      .catch(function(err){
        //Handler

        //$scope.formname.propertyInfo.$error.push({meessage:''});
      });
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.close();
      if (on_list)
        $state.go('propertys.list');      
    };
  })

  .controller('propertyEditCtrl', function($filter, $stateParams, propertyService, $state, Auth, $uibModal) {
    var self = this;
    self.save = save;
    self.cancel = cancel;
    self.isDialog = false;
    self.viewMode = false;  // for edit / create
    self.userInfo = Auth.getUserInfo();
    self.openDelete = openDelete;
    self.can_edit = $state.$current.data.can_edit;

    if($stateParams.id) {
      propertyService.getItem($stateParams.id).then(function(item){
        self.property = item;
      });
    } else {
      self.property = {};
    }

    function save() {
      propertyService.save(self.property).then(function(property) {
        self.property = property;
        $state.go('properties.list');
      });
    }

    function cancel() {
      $state.go('properties.list');      
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