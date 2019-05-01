denningOnline
  .controller('IRDBranchListCtrl', function(NgTableParams, IRDBranchService) {
    var self = this;

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 10
    }, {
      getData: function(params) {
        return IRDBranchService.getList(params.page(), params.count(), self.keyword).then(function (data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    });

    self.search = function () {
      self.tableFilter.reload();
    }
  })

  .controller('IRDBranchEditCtrl', function($stateParams, IRDBranchService, $state, Auth, refactorService,
                                            $uibModalInstance, entityCode, isDialog, isNew, growlService,
                                            cityService) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();
    self._type = 'irbbranch';
    
    self.isDialog = isDialog;
    self.can_edit = isNew;
    self.isNew = isNew;
    self.entityCode = isDialog ? entityCode : $stateParams.id;

    self.fullAddress = function () {
      fullAddress = '';
      if (self.entity) {
        if (self.entity.strTypeM)
          fullAddress = self.entity.strTypeM.trim().toUpperCase()+'\n';
        if (self.entity.strAddressLine1)
          fullAddress += self.entity.strAddressLine1.trim()+'\n';
        if (self.entity.strAddressLine2)
          fullAddress += self.entity.strAddressLine2.trim()+'\n';
        if (self.entity.strAddressLine3)
          fullAddress += self.entity.strAddressLine3.trim()+'\n';
        if (self.entity.strPostCode)
          fullAddress += self.entity.strPostCode.trim();
        if (self.entity.strCity)
          fullAddress += ' ' + self.entity.strCity.trim();
        fullAddress += ',\n';
        if (self.entity.strState)
          fullAddress += self.entity.strState.trim()+',\n';
        if (self.entity.strCountry)
          fullAddress += self.entity.strCountry.trim()+'\n';        
      }

      return fullAddress;
    };

    self.queryPostcodes = function (searchText) {
      return cityService.getList(1, 10, searchText).then(function (resp) {
        return resp.data;
      });
    }

    self.postcodeChange = function (item) {
      if (item) {
        self.entity.strPostCode = item.postcode;
        self.entity.strCity = item.city;
        self.entity.strState = item.state;
        self.entity.strCountry = item.country;
      } else {
        self.entity.strPostCode = '';
        self.entity.strCity = '';
        self.entity.strState = '';
        self.entity.strCountry = '';        
      }
    }

    if (self.entityCode) {
      self.title = 'Edit IRB Branch';

      IRDBranchService.getItem(self.entityCode).then(function (item) {
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);

        // set country codes
        if (self.entity.strPhone1CountryCode) {
          iso2 = self.entity.strPhone1CountryCode.substr(0, 2);
          $("input[ng-model='vm.entity.strPhone1No']").intlTelInput("setCountry", iso2);
        }
        if (self.entity.strPhone2CountryCode) {
          iso2 = self.entity.strPhone2CountryCode.substr(0, 2);
          $("input[ng-model='vm.entity.strPhone2No']").intlTelInput("setCountry", iso2);
        }
        if (self.entity.strFax1CountryCode) {
          iso2 = self.entity.strFax1CountryCode.substr(0, 2);
          $("input[ng-model='vm.entity.strFax1No']").intlTelInput("setCountry", iso2);
        }

        if (self.entity.strPostCode) {
          self.strPostCode_ = {
            postcode: self.entity.strPostCode,
            city: self.entity.strCity,
            state: self.entity.strState,
            country: self.entity.strCountry
          };
        }

        self.popoutUrl = $state.href('IRD-branches.edit', { id: self.entity.code });
      });
    } else {
      self.title = 'New IRB Branch';

      self.entity = {
        strTypeM: 'Lembaga Hasil Dalam Negeri',
        strTypeE: 'Inland Revenue Department'
      };
      
      self.popoutUrl = $state.href('IRD-branches.new');
    }

    self.copy = function () {
      self.isNew = true;
      self.can_edit = true;
      self.entity_ = null;

      var deleteList = ['code', 'dtDateEntered', 'dtDateUpdated', 'clsEnteredBy', 'clsUpdatedBy'];
      for (ii in deleteList) {
        key = deleteList[ii];
        delete self.entity[key];
      }
    }

    self.save = function () {
      // get country codes
      var tmp = $("input[ng-model='vm.entity.strPhone1No']").intlTelInput("getSelectedCountryData");
      self.entity.strPhone1CountryCode = tmp.iso2.toUpperCase() + '+' + tmp.dialCode;
      tmp = $("input[ng-model='vm.entity.strPhone2No']").intlTelInput("getSelectedCountryData");
      self.entity.strPhone2CountryCode = tmp.iso2.toUpperCase() + '+' + tmp.dialCode;
      tmp = $("input[ng-model='vm.entity.strFax1No']").intlTelInput("getSelectedCountryData");
      self.entity.strFax1CountryCode = tmp.iso2.toUpperCase() + '+' + tmp.dialCode;

      entity = refactorService.getDiff(self.entity_, self.entity);
      IRDBranchService.save(entity).then(function (res) {
        if (res) {  // ignore when errors
          if (self.isDialog) {
            $uibModalInstance.close(res);
          } else {
            if (self.entity_) {
              $state.reload();
            } else {
              $state.go('IRD-branches.edit', { 'id': res.code });
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
        $state.go('IRD-branches.list');
      }
    }
  })
