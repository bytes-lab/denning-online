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

  .controller('legalFirmEditCtrl', function($stateParams, legalFirmService, $state, Auth, cityService,
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

    self.fileStatus = ['Active', 'Closed', 'Unknown'];

    if (self.entityCode) {
      self.title = 'Edit Legal Firm';
      legalFirmService.getItem(self.entityCode).then(function (item) {
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);
        if (self.entity.strPostCode) {
          self.strPostCode_ = { 
            postcode: self.entity.strPostCode,
            init: true 
          };
        }
        self.popoutUrl = $state.href('legal-firms.edit', { id: self.entity.code });
      });
    } else {
      self.title = 'New Legal Firm';
      self.entity = {
        strTitle: 'Messr.',
        strStatus: 'Active'
      };

      self.popoutUrl = $state.href('legal-firms.new');
    }

    self.queryPostcodes = function (searchText) {
      return cityService.getList(1, 10, searchText).then(function (resp) {
        return resp.data;
      });
    }

    self.postcodeChange = function (item) {
      if (item && !item.init) {
        self.entity.strPostCode = item.postcode;
        self.entity.strCity = item.city;
        self.entity.strState = item.state;
        self.entity.strCountry = item.country;
      }
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
