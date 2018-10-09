denningOnline
  .controller('legalFirmListCtrl', function(NgTableParams, legalFirmService, $state) {
    var self = this;

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 25,
      sorting: {
        name: 'asc'
      }
    }, {
      getData: function(params) {
        return legalFirmService.getList(params.page(), params.count(), self.keyword)
        .then(function (data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    })
  
    self.search = function () {
      self.tableFilter.reload();
    }
  })

  .controller('legalFirmEditCtrl', function($stateParams, legalFirmService, $state, Auth, 
                                            $uibModalInstance, entityCode, isDialog, isNew,
                                            refactorService, growlService) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();
    self._type = 'legal-firm';

    self.isDialog = isDialog;
    self.can_edit = isNew;
    self.isNew = isNew;
    self.entityCode = isDialog ? entityCode : $stateParams.id;

    if (self.entityCode) {
      self.title = 'Edit Legal Firm';
      legalFirmService.getItem(self.entityCode).then(function (item){
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);
        self.popoutUrl = $state.href('legal-firms.edit', { id: self.entity.code });
      });
    } else {
      self.title = 'New Legal Firm';
      self.entity = { };
      self.popoutUrl = $state.href('legal-firms.new');
    }

    self.copy = function () {
      self.isNew = true;
      self.can_edit = true;
      self.entity_ = null;

      var deleteList = ['code', 'dtDateEntered', 'dtDateUpdated'];
      
      for (ii in deleteList) {
        key = deleteList[ii];
        delete self.entity[key];
      }
    }

    self.save = function () {
      entity = refactorService.getDiff(self.entity_, self.entity);
      legalFirmService.save(entity).then(function (item) {
        if (item) {
          if (self.isDialog) {
            $uibModalInstance.close(item);
          } else {
            if (self.entity_) {
              $state.reload();
            } else {
              $state.go('legal-firms.edit', { 'id': item.code });
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
        $state.go('legal-firms.list');
      }
    }
  })
