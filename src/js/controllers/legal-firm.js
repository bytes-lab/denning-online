denningOnline
  .controller('legalFirmListCtrl', function(NgTableParams, legalFirmService, $state) {
    var self = this;

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 10
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

        // set country codes
        if (self.entity.strPhone1CountryCode) {
          iso2 = self.entity.strPhone1CountryCode.substr(0, 2);
          $("input[ng-model='vm.entity.strPhone1No']").intlTelInput("setCountry", iso2);
        }
        if (self.entity.strPhone2CountryCode) {
          iso2 = self.entity.strPhone2CountryCode.substr(0, 2);
          $("input[ng-model='vm.entity.strPhone2No']").intlTelInput("setCountry", iso2);
        }
        if (self.entity.strPhone3CountryCode) {
          iso2 = self.entity.strPhone3CountryCode.substr(0, 2);
          $("input[ng-model='vm.entity.strPhone3No']").intlTelInput("setCountry", iso2);
        }
        if (self.entity.strFax1CountryCode) {
          iso2 = self.entity.strFax1CountryCode.substr(0, 2);
          $("input[ng-model='vm.entity.strFax1No']").intlTelInput("setCountry", iso2);
        }

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


    self.fullAddress = function () {
      fullAddress = '';
      if (self.entity.strName)
        fullAddress = self.entity.strName.trim().toUpperCase()+'\n';
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

      return fullAddress;
    };

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
      // get country codes
      var tmp = $("input[ng-model='vm.entity.strPhone1No']").intlTelInput("getSelectedCountryData");
      self.entity.strPhone1CountryCode = tmp.iso2.toUpperCase() + '+' + tmp.dialCode;
      tmp = $("input[ng-model='vm.entity.strPhone2No']").intlTelInput("getSelectedCountryData");
      self.entity.strPhone2CountryCode = tmp.iso2.toUpperCase() + '+' + tmp.dialCode;
      tmp = $("input[ng-model='vm.entity.strPhone3No']").intlTelInput("getSelectedCountryData");
      self.entity.strPhone3CountryCode = tmp.iso2.toUpperCase() + '+' + tmp.dialCode;
      tmp = $("input[ng-model='vm.entity.strFax1No']").intlTelInput("getSelectedCountryData");
      self.entity.strFax1CountryCode = tmp.iso2.toUpperCase() + '+' + tmp.dialCode;

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
