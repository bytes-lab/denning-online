materialAdmin
  .controller('fileMatterListCtrl', function($uibModal, NgTableParams, fileMatterService, Auth, $state) {
    var self = this;
    self.userInfo = Auth.getUserInfo();
    self.clickHandler = clickHandler;
    self.search = search;
    self.keyword = '';

    function clickHandler(item) {
      $state.go('matterforms.edit', {'fileNo': item.systemNo});
    }

    self.tableFilter = new NgTableParams({
      page: 1,            // show first page
      count: 15,
      sorting: {
        name: 'asc'       // initial sorting
      }
    }, {
      getData: function(params) {
        return fileMatterService.getList(params.page(), params.count(), self.keyword).then(function(data) {
          var data_ = [];
          params.total(data.headers('x-total-count'));
          angular.forEach(data.data, function(value, key) {
            var item = JSON.parse(value.JsonDesc.replace(/[\u0000-\u0019]+/g,""));
            item.dateOpen = item.dateOpen.split(' ')[0];
            data_.push(item);
          });
          return data_;
        });
      }
    })    

    function search() {
      self.tableFilter.reload();
    }
  })

  .controller('ModalInstanceCtrl', function ($scope, $modalInstance, contact, on_list, fileMatterService, $state) {
    $scope.ok = function () {
      fileMatterService.delete(contact).then(function(contact) {
        if (on_list)
          $state.reload();
        else
          $state.go('file-matters.list');
      })
      .catch(function(err){
        //$scope.formname.contactInfo.$error.push({meessage:''});
      });
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.close();
      if (on_list)
        $state.go('file-matters.list');
    };
  })

  .controller('fileMatterEditCtrl', function($filter, $uibModal, $stateParams, fileMatterService, $state, Auth) {
    var self = this;
    self.save = save;
    self.cancel = cancel;
    self.isDialog = false;
    self.viewMode = false;  // for edit / create
    self.userInfo = Auth.getUserInfo();
    self.openDelete = openDelete;
    self.queryFields = queryFields;
    self.can_edit = false;    
    self.IDTypes = [];
    self.Salutations = [];
    self.IRDBranches = [];

    fileMatterService.getIDTypeList().then(function(data) {
      self.IDTypes = data;
    });

    fileMatterService.getSalutationList().then(function(data) {
      self.Salutations = data;
    });

    fileMatterService.getIRDBranchList().then(function(data) {
      self.IRDBranches = data;
    });

    function queryFields(field, searchText) {
      return self[field].filter(function(c) {
        return c.description.search(new RegExp(searchText, "i")) > -1;
      });
    }

    if ($stateParams.id) {
      fileMatterService.getItem($stateParams.id)
      .then(function(item){
        self.filematter = angular.copy(item);  // important
      });
    } else {
      self.filematter = {};
    }

    function save() {
      fileMatterService.save(self.filematter).then(function(contact) {
        self.filematter = contact;
        $state.go('file-matters.list');
      })
      .catch(function(err){
        //Handler
      });
    }

    function cancel() {
      $state.go('file-matters.list');      
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

  .controller('fileMatterCreateModalCtrl', function ($modalInstance, party, viewMode, fileMatterService, $scope, Auth) {
    var self = this;
    self.save = save;
    self.cancel = cancel;
    self.isDialog = true;
    self.viewMode = viewMode;
    self.userInfo = Auth.getUserInfo();

    if (viewMode) {
      fileMatterService.getItem(party.party.code)
      .then(function(item){
        self.filematter = item;
      });                  
    } else {
      self.filematter = {};
    }

    function save() {
      fileMatterService.save(self.filematter).then(function(contact) {
        $modalInstance.close(contact);
      })
      .catch(function(err){
        //Handler
      });
    };

    function cancel() {
      $modalInstance.close();
    };
  })

  .controller('matterCodeListCtrl', function($filter, $sce, $uibModal, NgTableParams, matterCodeService, $state) {
    var self = this;
    self.dataReady = false;
    self.clickHandler = clickHandler;

    matterCodeService.getList(1, 500).then(function(data) {
      self.data = data;
      self.dataReady = true;
      initializeTable();
    });    

    function clickHandler(item) {
      $state.go('matter-codes.edit', {'id': item.code});
    }
    
    function initializeTable () {
      //Filtering
      self.tableFilter = new NgTableParams({
        page: 1,      
        count: 25,
        sorting: {
          name: 'asc' 
        }
      }, {
        getData: function(params) {
          var orderedData = params.filter() ? $filter('filter')(self.data, params.filter()) : self.data;
          orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
          params.total(orderedData.length); // set total for recalc pagination
          return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
        }
      })    
    }  
  })

  .controller('matterCodeEditCtrl', function($filter, $stateParams, matterCodeService, $state) {
    var self = this;
    self.cancel = cancel;

    matterCodeService.getItem($stateParams.id)
    .then(function(item){
      self.landPTG = item;
    });

    function cancel() {
      $state.go('matter-codes.list');      
    }
  })