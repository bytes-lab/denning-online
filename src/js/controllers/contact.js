denningOnline
  .controller('contactListCtrl', function (NgTableParams, contactService, Auth, $state) {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 25,
    }, {
      getData: function(params) {
        return contactService.getList(params.page(), params.count(), self.keyword)
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

  .controller('contactEditCtrl', function ($filter, $uibModal, $stateParams, growlService, 
                                           contactService, $state, Auth, $scope, 
                                           refactorService, occupationService, raceService, 
                                           religionService, IRDBranchService, cityService,
                                           uibDateParser, bankService, $uibModalInstance, 
                                           entityCode, isDialog, isNew) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();
    self._type = 'contact';

    self.isDialog = isDialog;
    self.can_edit = isNew;
    self.isNew = isNew;
    self.entityCode = isDialog ? entityCode : $stateParams.id;

    self.IDTypes = [];
    self.Salutations = [];
    self.contactTypes = [
      'Individual',
      'Company', 
      'Firm', 
      'Legal Firm',
      'Bank',
      'Government',
      'Others'
    ];

    self.eduLevels = [
      'Primary',
      'Secondary',
      'University'
    ];

    self.citizenships = ['Malaysia', 'India', 'New Zealand', 'Australia', 'Korea', 'Vietnam',
      'Singapore', 'United Kingdom', 'United States of America', 'France', 'Germany', 'PR China',
      'Thailand', 'Japan', 'Indonesia', 'Bangladesh'];

    self.queryList = function (labels, q) {
      return labels.filter(function(item) {
        return item.search(new RegExp(q, "i")) > -1;
      });
    };

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

    // $("#phoneHome").intlTelInput({
    //   utilsScript: "vendors/intl-tel-input/js/utils.js?14",
    //   preferredCountries: ['my'],
    //   separateDialCode: true
    // });

    self.relatedMatter = function () {
      if ($uibModalInstance) {
        $uibModalInstance.close();
      }
      $state.go('contacts.matters', {id: self.entity.code});
    }

    self.openFolder = function () {
      if ($uibModalInstance) {
        $uibModalInstance.close();
      }
      $state.go('folders.list', {id: self.entity.code, type: 'contact'});
    }

    contactService.getSalutationList().then (function (data) {
      self.Salutations = data;
    });

    contactService.getIDTypeList().then (function (data) {
      self.IDTypes = data;
    });

    self.sameOfficeAddr = function (flag) {
      if (flag) {
        self.entity.strRegOff = self.entity.strAddressLine1 + 
                                self.entity.strAddressLine2 + 
                                self.entity.strAddressLine3 +
                                self.entity.strPostCode.trim() + ' ' +
                                self.entity.strCity.trim() + ', ' +
                                self.entity.strState.trim() + ', ' +
                                self.entity.strCountry;
      }
    }

    self.queryContacts = function (searchText) {
      return contactService.getCustomerList(1, 10, searchText).then(function (resp) {
        return resp.data;
      });
    };

    self.queryBanks = function (searchText) {
      return bankService.getTableList(1, 10, searchText).then(function (resp) {
        return resp.data;
      });
    };

    self.queryStaffs = function (searchText) {
      return contactService.getStaffList(1, 10, searchText).then(function (resp) {
        return resp.data;
      });
    }

    self.queryOccupation = function (searchText) {
      return occupationService.getList(1, 10, searchText).then(function (resp) {
        return resp;
      });
    }

    self.workPlaceChange = function (item) {
      if (item) {
        self.entity.strPlaceofWork = item.city;
      }
    }

    self.birthPlaceChange = function (item) {
      if (item) {
        self.entity.strPlaceBirth = item.city;
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

    self.IDTypeChange = function (item) {
      if (item) {
        self.myIC = false;
        if (item.code == '1' || item.code == '2') {
          self.myIC = true;
        }        
      }
    }

    self.titleChange = function (item) {
      if (item) {
        self.entity.strTitle = item.description;
      }
    }

    self.irdBranchChange = function (item) {
      if (item) {
        self.entity.clsIrdBranch = {
          code: item.code,
          strName: item.description
        }
      }
    }

    self.queryPostcodes = function (searchText) {
      return cityService.getList(1, 10, searchText).then(function (resp) {
        return resp.data;
      });
    }

    self.queryRace = function (searchText) {
      return raceService.getList(1, 10, searchText).then(function (resp) {
        return resp;
      });
    }

    self.queryIRDBranch = function (searchText) {
      return IRDBranchService.getList(1, 10, searchText).then(function (resp) {
        return resp;
      });
    }

    self.queryReligion = function (searchText) {
      return religionService.getList(1, 10, searchText).then(function (resp) {
        return resp;
      });
    }

    self.queryFields = function (field, searchText) {
      return self[field].filter(function (c) {
        return (c.strDescription || c.description).search(new RegExp(searchText, "i")) > -1;
      });
    }

    self.parseBirth = function () {
      if (self.entity.strIDNo) {
        var sdate = self.entity.strIDNo.split('-')[0];
        var pdate = uibDateParser.parse(sdate, 'yyMMdd', new Date());
        if (!pdate) {
          alert('Your ID No is not valid. Please provide again.');
        } else {
          // check over current year
          if (pdate.getFullYear() > (new Date()).getFullYear()) {
            pdate = uibDateParser.parse('19'+sdate, 'yyyyMMdd', new Date());
          }
          self.entity.dtDateBirth = pdate;
        }
      }
    }

    self.copy = function () {
      self.isNew = true;
      self.can_edit = true;
      self.entity_ = null;

      var deleteList = ['code', 'dtDateEntered', 'dtDateUpdated', 'strIDNo', 'strIDNoOld', 
                        'strName', 'strEmailAddress', 'strWebSite', 'dtDateBirth', 'dtDateDeceased', 
                        'strTaxFileNo'];
      for (ii in deleteList) {
        key = deleteList[ii];
        delete self.entity[key];
      }
    }

    if (self.entityCode) {
      self.title = 'Edit Contact';

      contactService.getItem(self.entityCode).then(function (item) {
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);

        self.popoutUrl = $state.href('contacts.edit', { id: self.entity.code });
        self.IDTypeChange(self.entity.clsIDType);

        // wrapper attrs for auto complete
        if (self.entity.strTitle) {
          self.strTitle_ = { 
            description: self.entity.strTitle 
          };
        }

        if (self.entity.strPlaceofWork) {
          self.strPlaceofWork_ = { 
            city: self.entity.strPlaceofWork
          };          
        }

        if (self.entity.strPlaceBirth) {
          self.strPlaceBirth_ = { 
            city: self.entity.strPlaceBirth
          };
        }

        if (self.entity.clsIrdBranch.code) {
          self.clsIrdBranch_ = { 
            code: self.entity.clsIrdBranch.code, 
            description: self.entity.clsIrdBranch.strName 
          };
        }

        if (self.entity.strPostCode) {
          self.strPostCode_ = {
            postcode: self.entity.strPostCode,
            city: self.entity.strCity,
            state: self.entity.strState,
            country: self.entity.strCountry
          };
        }
      });
    } else {
      self.title = 'New Contact';

      self.entity = {
        strCitizenship: 'Malaysia',
        clsIDType: {
          code: 2,
          strDescription: 'New IC'
        }
      };
      
      self.popoutUrl = $state.href('contacts.new');
      self.IDTypeChange(self.entity.clsIDType);
    }

    self.save = function () {
      entity = refactorService.getDiff(self.entity_, self.entity);
      contactService.save(entity).then(function (contact) {
        if (contact) {  // ignore when errors
          if (self.isDialog) {
            $uibModalInstance.close(contact);
          } else {
            if (self.entity_) {
              $state.reload();
            } else {
              $state.go('contacts.edit', { 'id': contact.code });
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
        $state.go('contacts.list');
      }
    }

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
            return 'contact';
          },
          service: function () {
            return contactService;
          },
          return_state: function () {
            return 'contacts.list';
          }
        }
      });
    };
  })

  // for general delete
  .controller('deleteEntityModalCtrl', function ($scope, $uibModalInstance, $state, entity, 
                                                 entity_type, service, return_state, on_list) 
  {
    $scope.entity_type = entity_type;

    $scope.ok = function () {
      service.delete(entity).then(function () {
        if (on_list) {
          $state.reload();
        } else {
          $state.go(return_state);
        }
      }).catch(function(err){
        //$scope.formname.contactInfo.$error.push({meessage:''});
      });
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.close();
      if (on_list) {
        $state.go(return_state);
      }
    };
  })
