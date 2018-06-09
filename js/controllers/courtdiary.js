materialAdmin
  .controller('courtdiaryListCtrl', function($filter, $uibModal, NgTableParams, courtdiaryService, $state, Auth) {
    var self = this;
    self.openDelete = openDelete;
    self.clickHandler = clickHandler;
    self.userInfo = Auth.getUserInfo();
    self.search = search;
    self.keyword = '';

    function clickHandler(item) {
      // $state.go('courtdiaries.edit', {'id': item.code});
    }

    self.tableFilter = new NgTableParams({
      page: 1,        // show first page
      count: 25,
      sorting: {
        name: 'asc'   // initial sorting
      }
    }, {
      getData: function(params) {
        var start = '2014-04-01',
            end = '2014-04-30';

        return courtdiaryService.getList(start, end, params.page(), params.count(), self.keyword).then(function(data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    });

    function search() {
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
    function openDelete(event, courtdiary) {
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

  .controller('courtdiaryEditCtrl', function($filter, $uibModal, $stateParams, courtdiaryService, $state, Auth) {
    var self = this;
    self.save = save;
    self.cancel = cancel;
    self.userInfo = Auth.getUserInfo();
    self.openDelete = openDelete;
    self.can_edit = false;

    if ($stateParams.id) {
      courtdiaryService.getItem($stateParams.id)
      .then(function(item){
        self.courtdiary = angular.copy(item);  // important
      });
    } else {
      self.courtdiary = {};
    }

    function save() {
      courtdiaryService.save(self.courtdiary).then(function(courtdiary) {
        self.courtdiary = courtdiary;
        $state.go('courtdiary');
      })
      .catch(function(err){
        //Handler
      });
    }

    function cancel() {
      $state.go('courtdiary');      
    }

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
    function openDelete(event, contact) {
      event.stopPropagation();
      modalInstances1(true, '', 'static', true, contact)
    };    
  })
