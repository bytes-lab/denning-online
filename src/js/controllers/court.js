denningOnline
  .controller('courtListCtrl', function(NgTableParams, courtService, $state, Auth) {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.tableFilter = new NgTableParams({}, {
      getData: function(params) {
        return courtService.getList(params.page(), params.count(), self.keyword, null)
        .then(function (data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    })

    self.search = function (event, clear) {
      if(event.which == 13 || clear) { 
        if (clear) {
          self.keyword='';
        }
        self.tableFilter.reload();
      }
    }
  })

  .controller('courtEditCtrl', function($stateParams, courtService, $state, $uibModalInstance, 
                                        entityCode, isDialog, isNew, refactorService, growlService,
                                        cityService, Auth, judgeService) 
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

    self.queryCourts = function (searchText) {
      return courtService.getTypeList(1, 10, searchText).then(function (resp) {
        return resp.data;
      })
    }

    self.courtChange = function (item) {
      if (item) {
        self.entity.strTypeE = item.strTypeE;
        self.entity.strTypeM = item.strTypeM;
      } else {
        self.entity.strTypeE = null;
        self.entity.strTypeM = null;
      }
    }

    self.postcodeChange = function (item) {
      if (item) {
        self.entity.strPostCode = item.postcode;
        self.entity.strCity = item.city;
        self.entity.strState = item.state;
        self.entity.strCountry = item.country;
      }
    }

    self.queryJudge = function (search) {
      return judgeService.getList(1, 10, search).then(function (resp) {
        return resp.data;
      })
    }

    self.queryPostcodes = function (searchText) {
      return cityService.getList(1, 10, searchText).then(function (resp) {
        return resp.data;
      });
    }

    if (self.entityCode) {
      self.title = 'Edit Court';

      courtService.getItem(self.entityCode).then(function (item) {
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

        if (self.entity.strTypeE) {
          self.strCourtType = { 
            strTypeE: self.entity.strTypeE,
            strTypeM: self.entity.strTypeM,
          };
        }

        self.popoutUrl = $state.href('courts.edit', { id: self.entity.code });
      });
    } else {
      self.title = 'New Court';

      self.entity = {};
      
      self.popoutUrl = $state.href('courts.new');
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
      courtService.save(entity).then(function (contact) {
        if (contact) {  // ignore when errors
          if (self.isDialog) {
            $uibModalInstance.close(contact);
          } else {
            if (self.entity_) {
              $state.reload();
            } else {
              $state.go('courts.edit', { 'id': contact.code });
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
        $state.go('courts.list');
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
