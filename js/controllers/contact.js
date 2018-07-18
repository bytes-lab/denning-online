denningOnline
  .controller('contactListCtrl', function($uibModal, NgTableParams, contactService, Auth, $state) {
    var self = this;
    self.userInfo = Auth.getUserInfo();
    self.keyword = '';

    self.clickHandler = function (item) {
      $state.go('contacts.edit', {'id': item.code});
    }

    self.tableFilter = new NgTableParams({
      page: 1,            // show first page
      count: 25,
      sorting: {
        name: 'asc'       // initial sorting
      }
    }, {
      getData: function(params) {
        return contactService.getList(params.page(), params.count(), self.keyword).then(function(data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    })

    self.search = function () {
      self.tableFilter.reload();
    }
  })

  .controller('contactEditCtrl', function($filter, $uibModal, $stateParams, contactService, $state, Auth, $scope, occupationService, raceService, religionService, IRDBranchService) {
    var self = this;
    self.isDialog = false;
    self.viewMode = false;  // for edit / create
    self.userInfo = Auth.getUserInfo();
    self.can_edit = $state.$current.data.can_edit;
    self.create_new = $state.$current.data.can_edit;

    self.IDTypes = [];
    self.Salutations = [];
    self.IRDBranches = [];

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

    contactService.getSalutationList().then(function(data) {
      self.Salutations = data;
    });

    self.queryContacts = function (searchText) {
      return contactService.getCustomerList(1, 10, searchText).then(function(resp) {
        return resp.data;
      });
    };

    self.queryStaffs = function (searchText) {
      return contactService.getStaffList(1, 10, searchText).then(function(resp) {
        return resp.data;
      });
    }

    self.queryOccupation = function (searchText) {
      return occupationService.getList(1, 10, searchText).then(function(resp) {
        return resp;
      });
    }

    self.queryRace = function (searchText) {
      return raceService.getList(1, 10, searchText).then(function(resp) {
        return resp;
      });
    }

    self.queryIRDBranch = function (searchText) {
      return IRDBranchService.getList(1, 10, searchText).then(function(resp) {
        return resp;
      });
    }

    self.queryReligion = function (searchText) {
      return religionService.getList(1, 10, searchText).then(function(resp) {
        return resp;
      });
    }

    self.queryFields = function (field, searchText) {
      return self[field].filter(function(c) {
        return c.description.search(new RegExp(searchText, "i")) > -1;
      });
    }

    self.new_ = function new_() {
      self.contact = {};
      self.can_edit = true;
      self.create_new = true;
    }

    self.copy = function () {
      self.create_new = true;
      self.can_edit = true;
      
      delete self.contact.code;
      delete self.contact.IDNo;
      delete self.contact.old_ic;
      delete self.contact.name;
      delete self.contact.emailAddress;
      delete self.contact.webSite;
      delete self.contact.dateBirth;
      delete self.contact.taxFileNo;
    }

    if ($stateParams.id) {
      contactService.getItem($stateParams.id).then(function(item){
        self.contact = angular.copy(item);  // important
      });
    } else {
      self.contact = {};
    }

    self.save = function () {
      contactService.save(self.contact).then(function(contact) {
        if (contact) {
          self.contact = contact;
        }
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

    self.relatedMatter = function() {
      $state.go('contacts.matters', {id: self.contact.code});
    }

    self.openFolder = function() {
      $state.go('folders.list', {id: self.contact.code, type: 'contact'});
    }

    self.upload = function() {
      self.uploaded = 0;
      angular.element('.contact-upload').click();
    };

    self.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
      var lastModifiedDate = typeof file.lastModified === "number" ? new Date(file.lastModified) : file.lastModifiedDate;

      var info = {
        "fileNo1": self.contact.code,
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
          alert('The file(s) uploaded successfully.');
        }
      })
      .catch(function(err){
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

  .controller('deleteEntityModalCtrl', function ($scope, $uibModalInstance, $state, entity, on_list, entity_type, service, return_state) {
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

  .controller('contactCreateModalCtrl', function ($uibModalInstance, party, viewMode, contactService, IRDBranchService, Auth) {
    var self = this;
    self.isDialog = true;
    self.viewMode = viewMode;
    self.can_edit = !viewMode;
    self.create_new = !viewMode;
    self.userInfo = Auth.getUserInfo();

    if (viewMode) {
      contactService.getItem(party.code).then(function(item){
        self.contact = item;
      });
    } else {
      self.contact = {};
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
      contactService.save(self.contact).then(function(contact) {
        $uibModalInstance.close(contact);
      })
      .catch(function(err){
      });
    };

    self.cancel = function () {
      $uibModalInstance.close();
    };
  })
