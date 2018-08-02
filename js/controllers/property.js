denningOnline
  .controller('propertyListCtrl', function (NgTableParams, propertyService, $state, Auth) {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.clickHandler = function (item) {
      $state.go('properties.edit', {'id': item.code});
    }

    self.tableFilter = new NgTableParams({
      page: 1, 
      count: 25
    }, {
      getData: function (params) {
        return propertyService.getList(params.page(), params.count(), self.keyword).then(function(data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    });

    self.search = function () {
      self.tableFilter.reload();
    }
  })

  .controller('propertyEditCtrl', function($stateParams, growlService, propertyService, $state, Auth, $uibModal, contactService, refactorService) {
    var self = this;
    self.isDialog = false;
    self.viewMode = false;  // for edit / create
    self.userInfo = Auth.getUserInfo();
    self.can_edit = $state.$current.data.can_edit;
    self.create_new = $state.$current.data.can_edit;

    self.refList = ['MukimType', 'LotType', 'TitleType', 'ParcelType', 'LandUse', 
                    'RestrictionAgainst', 'TenureType', 'AreaType'];
    self.types = {};
    self.true = true;

    if($stateParams.id) {
      propertyService.getItem($stateParams.id).then(function (item) {
        self.entity = refactorService.convertBool(item, true);
        self.entity_ = angular.copy(self.entity);
      });
    } else {
      self.entity = {};
    }

    self.queryContacts = function (searchText) {
      return contactService.getCustomerList(1, 10, searchText).then(function (resp) {
        return resp.data;
      });
    };

    self.queryStaffs = function (searchText) {
      return contactService.getStaffList(1, 10, searchText).then(function (resp) {
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
      self.entity_ = null;

      var deleteList = ['code', 'dtDateEntered', 'dtDateUpdated', 'strPropertyID'];
      for (ii in deleteList) {
        key = deleteList[ii];
        delete self.entity[key];
      }
    }

    self.save = function () {
      entity = refactorService.getDiff(self.entity_, self.entity);
      propertyService.save(entity).then(function (property) {
        if (self.entity_) {
          $state.reload();
        } else {
          $state.go('properties.edit', { 'id': property.code });
        }
        growlService.growl('Saved successfully!', 'success');
      });
    }

    angular.forEach(self.refList, function (value, key) {
      propertyService.getTypeList(value).then(function(data) {
        self.types[value] = data;
      });
    });

    //Prevent Outside Click
    self.openDelete = function (event, entity) {
      event.stopPropagation();

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'deleteEntityModal.html',
        controller: 'deleteEntityModalCtrl',
        size: '',
        backdrop: 'static',
        keyboard: true,
        resolve: {
          entity: function () {
            return entity;
          }, 
          on_list: function () {
            return false;
          },
          entity_type: function () {
            return 'property';
          },
          service: function () {
            return propertyService;
          },
          return_state: function () {
            return 'properties.list';
          }
        }
      });
    };
  })

  .controller('propertyCreateModalCtrl', function ($uibuibModalInstance, property, viewMode, propertyService, Auth) {
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
        self.entity = item;
      });
    } else {
      self.entity = {};
    }

    angular.forEach(self.refList, function (value, key) {
      propertyService.getTypeList(value).then(function(data) {
        self.types[value] = data;
      });
    });

    self.save = function () {
      propertyService.save(self.entity).then(function(property) {
        $uibuibModalInstance.close(property);
      })
      .catch(function(err){
      });
    };

    self.cancel = function () {
      $uibuibModalInstance.close();
    };
  })
