denningOnline
  .controller('propertyListCtrl', function (NgTableParams, propertyService, $state, Auth) {
    var self = this;
    self.dataReady = false;
    self.userInfo = Auth.getUserInfo();
    self.search = search;
    self.keyword = '';

    self.clickHandler = function (item) {
      $state.go('properties.edit', {'id': item.code});
    }

    self.tableFilter = new NgTableParams({
      page: 1,        // show first page
      count: 25,
      sorting: {
        name: 'asc'   // initial sorting
      }
    }, {
      getData: function (params) {
        return propertyService.getList(params.page(), params.count(), self.keyword).then(function(data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    });

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

  .controller('propertyEditCtrl', function($stateParams, propertyService, $state, Auth, $uibModal, contactService) {
    var self = this;
    self.isDialog = false;
    self.viewMode = false;  // for edit / create
    self.userInfo = Auth.getUserInfo();
    self.can_edit = $state.$current.data.can_edit;
    self.create_new = $state.$current.data.can_edit;

    self.refList = ['MukimType', 'LotType', 'TitleType', 'ParcelType', 'LandUse', 
                    'RestrictionAgainst', 'TenureType', 'AreaType'];
    self.types = {};

    if($stateParams.id) {
      propertyService.getItem($stateParams.id).then(function(item){
        self.property = item;
      });
    } else {
      self.property = {};
    }

    self.queryContacts = function (searchText) {
      return contactService.getCustomerList(1, 10, searchText).then(function(resp) {
        return resp.data;
      });
    };

    self.queryStaffs = function (searchText) {
      return contactService.getStaffList(1, 10, searchText).then(function(resp) {
        return resp.data;
      });
    }

    $("#back-top").hide();
    $(window).scroll(function() {
      if ($(this).scrollTop() > 100) {
        $('#back-top').fadeIn();
        $('.btn-balances').fadeIn();
      } else {
        $('#back-top').fadeOut();
        $('.btn-balances').fadeOut();
      }
    });

    self.scrollUp = function () {
      $('body,html').animate({
          scrollTop : 0
      }, 500);
      return false;
    };
    
    self.copy = function () {
      self.create_new = true;
      self.can_edit = true;
      
      delete self.property.code;
      delete self.property.IDNo;
      delete self.property.old_ic;
      delete self.property.name;
      delete self.property.emailAddress;
      delete self.property.webSite;
      delete self.property.dateBirth;
      delete self.property.taxFileNo;
    }

    self.save = function () {
      propertyService.save(self.property).then(function(property) {
        if (property) {
          self.property = property;
        }
      });
    }

    self.relatedMatter = function() {
      $state.go('properties.matters', {id: self.property.code});
    }

    self.cancel = function () {
      $state.go('properties.list');
    }

    angular.forEach(self.refList, function (value, key) {
      propertyService.getTypeList(value).then(function(data) {
        self.types[value] = data;
      });
    });

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
    self.openDelete = function (event, property) {
      event.stopPropagation();
      modalInstances1(true, '', 'static', true, property)
    };
  })

  .controller('propertyCreateModalCtrl', function ($uibModalInstance, property, viewMode, propertyService, Auth) {
    var self = this;
    self.isDialog = true;
    self.viewMode = viewMode;
    self.userInfo = Auth.getUserInfo();
    self.create_new = !viewMode;
    self.can_edit = !viewMode;
    self.refList = ['MukimType', 'LotType', 'TitleType', 'ParcelType', 'LandUse', 
                    'RestrictionAgainst', 'TenureType', 'AreaType'];
    self.types = {};

    if (viewMode) {
      propertyService.getItem(property.code)
      .then(function(item){
        self.property = item;
      });
    } else {
      self.property = {};
    }

    angular.forEach(self.refList, function (value, key) {
      propertyService.getTypeList(value).then(function(data) {
        self.types[value] = data;
      });
    });

    self.save = function () {
      propertyService.save(self.property).then(function(property) {
        $uibModalInstance.close(property);
      })
      .catch(function(err){
      });
    };

    self.cancel = function () {
      $uibModalInstance.close();
    };
  })
