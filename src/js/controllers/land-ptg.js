denningOnline
  .controller('landPTGListCtrl', function(NgTableParams, landPTGService, $state) {
    var self = this;
    self.dataReady = false;
    self.clickHandler = clickHandler;

    landPTGService.getList(1, 500).then(function(data) {
      self.data = data;
      self.dataReady = true;
      initializeTable();
    });

    function clickHandler(item) {
      $state.go('land-PTGs.edit', {'id': item.code});
    }
    
    function initializeTable () {
      //Filtering
      self.tableFilter = new NgTableParams({
        page: 1,
        count: 10,
        sorting: {
          name: 'asc' 
        }
      }, {
        dataset: self.data
      })
    }
  })

  .controller('landPTGEditCtrl', function($stateParams, landPTGService, $state, $uibModalInstance, 
                                          entityCode, isDialog, isNew, refactorService, growlService,
                                          cityService, Auth) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();
    self._type = 'court';

    self.isDialog = isDialog;
    self.can_edit = isNew;
    self.isNew = isNew;
    self.entityCode = isDialog ? entityCode : $stateParams.id;

    self.fullAddress = function () {
      fullAddress = '';
      if (self.entity) {
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
      }

      return fullAddress;
    };

    self.postcodeChange = function (item) {
      if (item) {
        self.entity.strPostCode = item.postcode;
        self.entity.strCity = item.city;
        self.entity.strState = item.state;
        self.entity.strCountry = item.country;
      }
    }

    self.queryPostcodes = function (searchText) {
      return cityService.getList(1, 10, searchText).then(function (resp) {
        return resp.data;
      });
    }

    if (self.entityCode) {
      self.title = 'Edit State PTG';

      landPTGService.getItem(self.entityCode).then(function (item) {
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
            city: self.entity.strCity,
            state: self.entity.strState,
            country: self.entity.strCountry
          };
        }

        self.popoutUrl = $state.href('land-PTGs.edit', { id: self.entity.code });
      });
    } else {
      self.title = 'New State PTG';

      self.entity = {};
      
      self.popoutUrl = $state.href('land-PTGs.new');
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
      contactService.save(entity).then(function (contact) {
        if (contact) {  // ignore when errors
          if (self.isDialog) {
            $uibModalInstance.close(contact);
          } else {
            if (self.entity_) {
              $state.reload();
            } else {
              $state.go('land-PTGs.edit', { 'id': contact.code });
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
        $state.go('land-PTGs.list');
      }
    }

    self.copy = function () {
      self.isNew = true;
      self.can_edit = true;
      self.entity_ = null;

      var deleteList = ['code', 'dtDateEntered', 'dtDateUpdated', 'strIDNo', 'strIDNoOld', 
                        'strName', 'strEmailAddress', 'strWebSite', 'dtDateBirth', 'dtDateDeceased', 
                        'strTaxFileNo', 'clsEnteredBy', 'clsUpdatedBy'];
      for (ii in deleteList) {
        key = deleteList[ii];
        delete self.entity[key];
      }
    }
  })
