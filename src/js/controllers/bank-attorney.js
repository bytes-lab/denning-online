denningOnline
  .controller('bankAttorneyListCtrl', function(NgTableParams, bankAttorneyService) {
    var self = this;

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 10
    }, {
      getData: function(params) {
        return bankAttorneyService.getTableList(params.page(), params.count(), self.keyword)
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

  .controller('bankAttorneyEditCtrl', function($stateParams, bankAttorneyService, $state, Auth, courtService,
                                        refactorService, growlService, $uibModalInstance, $scope,
                                        entityCode, isDialog, isNew) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();
    self._type = 'bank-attorney';

    self.isDialog = isDialog;
    self.can_edit = isNew;
    self.isNew = isNew;
    self.entityCode = isDialog ? entityCode : $stateParams.id;

    self.queryCourts = function (searchText) {
      return courtService.getTypeList(1, 10, searchText).then(function (resp) {
        return resp.data;
      })
    }

    self.courtChange = function (item) {
      if (item) {
        self.entity.strCourtType = item.strTypeE;
      } else {
        self.entity.strCourtType = null;
      }
    }

    $scope.open = function($event, opened) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[opened] = true;
    };

    if (self.entityCode) {
      self.title = 'Edit Bank Attorney';
      bankAttorneyService.getItem(self.entityCode).then(function (item) {
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);
        self.popoutUrl = $state.href('bank-attorneys.edit', { id: self.entity.code });

        if (self.entity.strCourtType) {
          self.strCourtType = { strTypeE: self.entity.strCourtType };
        }
      });
    } else {
      self.title = 'New Bank Attorney';
      self.entity = {}
      self.popoutUrl = $state.href('bank-attorneys.new');
    }

    self.copy = function () {
      self.isNew = true;
      self.can_edit = true;
      self.entity_ = null;

      var deleteList = ['code', 'name', 'dtDateEntered', 'dtDateUpdated'];
      
      for (ii in deleteList) {
        key = deleteList[ii];
        delete self.entity[key];
      }
    }

    self.save = function () {
      entity = refactorService.getDiff(self.entity_, self.entity);
      bankAttorneyService.save(entity).then(function (item) {
        if (item) {
          if (self.isDialog) {
            $uibModalInstance.close(item);
          } else {
            if (self.entity_) {
              $state.reload();
            } else {
              $state.go('bank-attorneys.edit', { 'id': item.code });
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
        $state.go('bank-attorneys.list');
      }
    }
  })
