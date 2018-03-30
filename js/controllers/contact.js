materialAdmin
  .controller('contactListCtrl', function($uibModal, NgTableParams, contactService, Auth, $state) {
    var self = this;
    self.userInfo = Auth.getUserInfo();
    self.clickHandler = clickHandler;
    self.search = search;
    self.keyword = '';

    function clickHandler(item) {
      $state.go('contacts.edit', {'id': item.code});
    }

    self.tableFilter = new NgTableParams({
      page: 1,          // show first page
      count: 25,
      sorting: {
        name: 'asc'       // initial sorting
      }
    }, {
      getData: function(params) {
        return contactService.getList(params.page(), params.count(), self.keyword).then(function(data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    })    

    function search() {
      self.tableFilter.reload();
    }
  })

  .controller('ModalInstanceCtrl', function ($scope, $modalInstance, contact, on_list, contactService, $state) {
    $scope.ok = function () {
      contactService.delete(contact).then(function(contact) {
        if (on_list)
          $state.reload();
        else
          $state.go('contacts.list');
      })
      .catch(function(err){
        //$scope.formname.contactInfo.$error.push({meessage:''});
      });
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.close();
      if (on_list)
        $state.go('contacts.list');
    };
  })

  .controller('contactEditCtrl', function($filter, $uibModal, $stateParams, contactService, $state, Auth) {
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

    contactService.getIDTypeList().then(function(data) {
      self.IDTypes = data;
    });

    contactService.getSalutationList().then(function(data) {
      self.Salutations = data;
    });

    contactService.getIRDBranchList().then(function(data) {
      self.IRDBranches = data;
    });

    function queryFields(field, searchText) {
      return self[field].filter(function(c) {
        return c.description.search(new RegExp(searchText, "i")) > -1;
      });
    }

    if ($stateParams.id) {
      contactService.getItem($stateParams.id)
      .then(function(item){
        self.contact = angular.copy(item);  // important
      });
    } else {
      self.contact = {};
    }

    function save() {
      contactService.save(self.contact).then(function(contact) {
        self.contact = contact;
        $state.go('contacts.list');
      })
      .catch(function(err){
        //Handler
      });
    }

    function cancel() {
      $state.go('contacts.list');      
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

  .controller('contactCreateModalCtrl', function ($modalInstance, party, viewMode, contactService, $scope, Auth) {
    var self = this;
    self.save = save;
    self.cancel = cancel;
    self.isDialog = true;
    self.viewMode = viewMode;
    self.userInfo = Auth.getUserInfo();

    if (viewMode) {
      contactService.getItem(party.party.code)
      .then(function(item){
        self.contact = item;
      });                  
    } else {
      self.contact = {};
    }

    function save() {
      contactService.save(self.contact).then(function(contact) {
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
