denningOnline
  .controller('propertyListCtrl', function (NgTableParams, propertyService, $state, Auth) {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.tableFilter = new NgTableParams({
      page: 1, 
      count: 25
    }, {
      getData: function (params) {
        return propertyService.getList(params.page(), params.count(), self.keyword)
        .then(function (data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    });

    self.search = function () {
      self.tableFilter.reload();
    }
  })

  .controller('propertyEditCtrl', function($stateParams, growlService, $scope, propertyService, 
                                           $state, Auth, $uibModal, contactService, refactorService,
                                           uibDateParser, mukimService, $uibModalInstance, 
                                           entityCode, isDialog, isNew) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();
    
    self.isDialog = isDialog;
    self.can_edit = isNew;
    self.isNew = isNew;
    self.entityCode = isDialog? entityCode: $stateParams.id;

    self.refList = ['MukimType', 'LotType', 'TitleType', 'ParcelType', 'LandUse', 
                    'RestrictionAgainst', 'TenureType', 'AreaType'];
    self.types = {};
    self.true = true;

    if(self.entityCode) {
      propertyService.getItem(self.entityCode).then(function (item) {
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);

        // wrapper attrs for auto complete
        if (self.entity.strMukim) {
          self.strMukim_ = { 
            mukim: self.entity.strMukim,
            daerah: self.entity.strDaerah,
            negeri: self.entity.strNegeri 
          };          
        }

        if (self.entity.strApprovingAuthority) {
          self.strApprovingAuthority_ = {
            description: self.entity.strApprovingAuthority
          }          
        }
      });
    } else {
      self.entity = {
        strMukimType: 'Mukim'
      };
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

    self.queryMukims = function (searchText) {
      return mukimService.getList(1, 10, searchText).then(function (resp) {
        return resp.data;
      });
    }

    // get approving authorities
    propertyService.getApprovingAuthorityList().then(function (data) {
      self.aaList = data;
    })

    self.queryAAs = function (searchText) {
      return self.aaList;
    }

    self.aaChange = function (item) {
      if (item) {
        self.entity.strApprovingAuthority = item.description;
      }
    }

    self.mukimChange = function (item) {
      if (item) {
        self.entity.strMukim = item.mukim;
        self.entity.strDaerah = item.daerah;
        self.entity.strNegeri = item.negeri;
      }
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
      self.isNew = true;
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
        if (property) {
          if (self.isDialog) {
            $uibModalInstance.close(property);
          } else {
            if (self.entity_) {
              $state.reload();
            } else {
              $state.go('properties.edit', { 'id': property.code });
            }
            growlService.growl('Saved successfully!', 'success');
          }          
        }
      });
    }

    self.cancel = function () {
      if (self.isDialog) {
        $uibModalInstance.close();
      } else {
        $state.go('properties.list');
      }
    }
    
    angular.forEach(self.refList, function (value, key) {
      propertyService.getTypeList(value).then(function (data) {
        self.types[value] = data;
      });
    });

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
