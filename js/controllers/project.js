materialAdmin
  .controller('projectListCtrl', function($filter, $sce, $uibModal, NgTableParams, projectService) {
    var self = this;
    self.dataReady = false;
    self.openDelete = openDelete;

    projectService.getList().then(function(data) {
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

          this.new_ic = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
          this.name = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
          this.email = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
          this.phone3 = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

          params.total(orderedData.length); // set total for recalc pagination
          return this.new_ic, this.id_type, this.name, this.email, this.phone3;
        }
      })    
    }

    self.modalContent = 'Are you sure to delete the contract?';
  
    //Create Modal
    function modalInstances(animation, size, backdrop, keyboard, contact) {
      var modalInstance = $uibModal.open({
        animation: animation,
        templateUrl: 'myModalContent.html',
        controller: 'projectDeleteModalCtrl',
        size: size,
        backdrop: backdrop,
        keyboard: keyboard,
        resolve: {
          contact: function () {
            return contact;
          }
        }
      
      });
    }
    //Prevent Outside Click
    function openDelete(contact) {
      modalInstances(true, '', 'static', true, contact)
    };    
  })

  .controller('projectDeleteModalCtrl', function ($scope, $modalInstance, contact, projectService, $state) {
    $scope.ok = function () {
      projectService.delete(contact).then(function(contact) {
        $state.reload();
      })
      .catch(function(err){
        //Handler

        //$scope.formname.contactInfo.$error.push({meessage:''});
      });
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  })

  .controller('projectEditCtrl', function($filter, $stateParams, projectService, $state) {
    var self = this;
    self.save = save;

    if($stateParams.id) {
      projectService.getItem($stateParams.id)
      .then(function(item){
        self.contact = item;
      });
    } else {
      self.contact = {};
    }

    function save() {
      projectService.save(self.contact).then(function(contact) {
        self.contact = contact;
        $state.go('contacts.list');
      })
      .catch(function(err){
        //Handler

        //$scope.formname.contactInfo.$error.push({meessage:''});
      });
    }
  })