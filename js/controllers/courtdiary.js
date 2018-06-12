materialAdmin
  .controller('courtdiaryListCtrl', function($filter, $uibModal, NgTableParams, courtdiaryService, $state, Auth) {
    var self = this;

    self.userInfo = Auth.getUserInfo();
    self.keyword = '';

    self.clickHandler = function (item) {
      $state.go('courtdiaries.edit', {'id': item.code});
    }

    self.tableFilter = new NgTableParams({
      page: 1,        // show first page
      count: 5,
      sorting: {
        name: 'asc'   // initial sorting
      }
    }, {
      getData: function(params) {
        return courtdiaryService.getList(params.page(), params.count(), self.keyword).then(function(data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    });

    self.search = function () {
      self.tableFilter.reload();
    }

    //Create Modal
    function modalInstances(animation, size, backdrop, keyboard, courtdiary) {
      var modalInstance = $uibModal.open({
        animation: animation,
        templateUrl: 'myModalContent.html',
        controller: 'CourtDiaryDeleteModalCtrl',
        size: size,
        backdrop: backdrop,
        keyboard: keyboard,
        resolve: {
          courtdiary: function () {
            return courtdiary;
          }
        }      
      });
    }

    //Prevent Outside Click
    self.openDelete = function (event, courtdiary) {
      event.stopPropagation();
      modalInstances(true, '', 'static', true, courtdiary)
    };    
  })

  .controller('CourtDiaryDeleteModalCtrl', function ($scope, $uibModalInstance, courtdiary, courtdiaryService, $state) {
    $scope.ok = function () {
      courtdiaryService.delete(courtdiary).then(function(courtdiary) {
        $state.reload();
      })
      .catch(function(err){
        //Handler

        //$scope.formname.courtdiaryInfo.$error.push({meessage:''});
      });
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.close();
      $state.go('courtdiary');
    };
  })

  .controller('courtdiaryEditCtrl', function($filter, $uibModal, $stateParams, courtdiaryService, $state, Auth, $scope, uibDateParser) {
    var self = this;
    self.userInfo = Auth.getUserInfo();
    self.create_new = $state.$current.data.can_edit;
    self.can_edit = $state.$current.data.can_edit;

    if ($stateParams.id) {
      courtdiaryService.getItem($stateParams.id).then(function(item){
        self.courtdiary = item;
        angular.forEach(self.courtdiary, function(value, key) {
          if (key.indexOf('dt') == 0) {
            self.courtdiary[key] = uibDateParser.parse(self.courtdiary[key], 'yyyy-MM-dd HH:mm:ss');
          }
        })
      });
    } else {
      self.courtdiary = {};
    }

    self.save = function () {
      courtdiaryService.save(self.courtdiary).then(function(courtdiary) {
        self.courtdiary = courtdiary;
      })
      .catch(function(err){
        //Handler
      });
    }

    self.cancel = function () {
      $state.go('courtdiary');      
    }

    $scope.open = function($event, opened) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[opened] = true;
    };

    $scope.dateOptions = {
      formatYear: 'yyyy',
      startingDay: 1
    };

    $scope.format = 'dd/MM/yyyy';

    //Create Modal
    function modalInstances1(animation, size, backdrop, keyboard, contact) {
      var modalInstance = $uibModal.open({
        animation: animation,
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        backdrop: backdrop,
        keyboard: keyboard,
        resolve: {
          contact: function () {
            return contact;
          }, 
          on_list: function () {
            return false;
          }
        }      
      });
    }

    //Prevent Outside Click
    self.openDelete = function (event, contact) {
      event.stopPropagation();
      modalInstances1(true, '', 'static', true, contact)
    };    
  })
