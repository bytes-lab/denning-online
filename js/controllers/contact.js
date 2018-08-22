denningOnline
  .controller('contactListCtrl', function (NgTableParams, contactService, Auth, $state) {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.clickHandler = function (item) {
      $state.go('contacts.edit', {'id': item.code});
    }

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

    self.search = function () {
      self.tableFilter.reload();
    }
  })

  .controller('contactEditCtrl', function ($filter, $uibModal, $stateParams, growlService, 
                                           contactService, $state, Auth, $scope, 
                                           refactorService, occupationService, raceService, 
                                           religionService, IRDBranchService, cityService,
                                           uibDateParser) 
  {
    var self = this;
    self.isDialog = false;
    self.viewMode = false;  // for edit / create
    self.userInfo = Auth.getUserInfo();
    self.can_edit = $state.$current.data.can_edit;
    self.create_new = $state.$current.data.can_edit;

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

    contactService.getSalutationList().then (function (data) {
      self.Salutations = data;
    });

    contactService.getIDTypeList().then (function (data) {
      self.IDTypes = data;
    });

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

    self.queryOccupation = function (searchText) {
      return occupationService.getList(1, 10, searchText).then(function (resp) {
        return resp;
      });
    }

    self.postcodeChange = function (item) {
      if (item) {
        self.entity.strPostCode = item.postcode;
        self.entity.strCity = item.city;
        self.entity.strState = item.state;
        self.entity.strCountry = item.country;
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
      self.create_new = true;
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

    if ($stateParams.id) {
      contactService.getItem($stateParams.id).then(function (item) {
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);

        // wrapper attrs for auto complete
        self.strTitle_ = { 
          description: self.entity.strTitle 
        };

        self.clsIrdBranch_ = { 
          code: self.entity.clsIrdBranch.code, 
          description: self.entity.clsIrdBranch.strName 
        };

        self.strPostCode_ = {
          postcode: self.entity.strPostCode,
          city: self.entity.strCity,
          state: self.entity.strState,
          country: self.entity.strCountry
        };
      });
    } else {
      self.entity = {
        strCitizenship: 'Malaysia Citizen'
      };
    }

    self.save = function () {
      entity = refactorService.getDiff(self.entity_, self.entity);
      contactService.save(entity).then(function (contact) {
        if (self.entity_) {
          $state.reload();
        } else {
          $state.go('contacts.edit', { 'id': contact.code });
        }
        growlService.growl('Saved successfully!', 'success');
      });
    }

    self.cancel = function () {
      $state.go('contacts.list');
    }
    
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

    self.upload = function() {
      self.uploaded = 0;
      angular.element('.contact-upload').click();
    };

    self.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
      var lastModifiedDate = file.lastModifiedDate;
      if (typeof file.lastModified === "number") {
        lastModifiedDate = new Date(file.lastModified);
      }

      var info = {
        "fileNo1": self.entity.code,
        "documents":[
          {
            "FileName": fileObj.filename,
            "MimeType": fileObj.filetype,
            "dateCreate": lastModifiedDate.toISOString().replace('T', ' ').split('.')[0],
            "dateModify": lastModifiedDate.toISOString().replace('T', ' ').split('.')[0],
            "fileLength": fileObj.filesize,
            "base64": fileObj.base64
          }
        ]
      };

      contactService.upload(info, 'contact').then(function(res) {
        self.uploaded = self.uploaded + 1;
        if (fileList.length == self.uploaded) {
          growlService('The file(s) uploaded successfully.', 'success');
        }
      })
      .catch(function (err) {
      });
    };

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

  .controller('deleteEntityModalCtrl', function ($scope, $uibModalInstance, $state, entity, on_list, 
                                                 entity_type, service, return_state) 
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

  .controller('contactCreateModalCtrl', function ($uibModalInstance, party, viewMode, contactService, 
                                                  IRDBranchService, Auth) 
  {
    var self = this;
    self.isDialog = true;
    self.viewMode = viewMode;
    self.can_edit = !viewMode;
    self.create_new = !viewMode;
    self.userInfo = Auth.getUserInfo();

    if (viewMode) {
      contactService.getItem(party.code).then(function(item){
        self.entity = item;
      });
    } else {
      self.entity = {};
    }

    contactService.getSalutationList().then(function(data) {
      self.Salutations = data;
    });

    self.queryIRDBranch = function (searchText) {
      return IRDBranchService.getList(1, 10, searchText).then(function(resp) {
        return resp;
      });
    }

    self.queryFields = function (field, searchText) {
      return self[field].filter(function(c) {
        return c.description.search(new RegExp(searchText, "i")) > -1;
      });
    }

    self.save = function () {
      contactService.save(self.entity).then(function(contact) {
        $uibModalInstance.close(contact);
      })
      .catch(function(err){
      });
    };

    self.cancel = function () {
      $uibModalInstance.close();
    };
  })
