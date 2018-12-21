denningOnline
  .controller('staffListCtrl', function (NgTableParams, staffService, Auth, $state) {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 10,
    }, {
      getData: function(params) {
        return staffService.getList(params.page(), params.count(), self.keyword)
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

  .controller('staffEditCtrl', function($stateParams, staffService, $state, Auth, contactService,
                                        refactorService, growlService, $uibModalInstance, 
                                        entityCode, isDialog, isNew) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();
    self._type = 'staff';

    self.isDialog = isDialog;
    self.can_edit = isNew;
    self.isNew = isNew;
    self.entityCode = isDialog ? entityCode : $stateParams.id;

    self.Salutations = [];
    self.courtChange = function (item) {
      if (item) {
        self.entity.strCourtType = item.strTypeE;
      } else {
        self.entity.strCourtType = null;
      }
    }

    self.queryFields = function (field, searchText) {
      return self[field].filter(function (c) {
        return (c.strDescription || c.description).search(new RegExp(searchText, "i")) > -1;
      });
    }

    contactService.getSalutationList().then (function (data) {
      self.Salutations = data;
    });

    if (self.entityCode) {
      self.title = 'Edit Staff';
      staffService.getItem(self.entityCode).then(function (item) {
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);
        self.popoutUrl = $state.href('staffs.edit', { id: self.entity.code });

        if (self.entity.strTitle) {
          self.strTitle_ = { 
            description: self.entity.strTitle 
          };
        }
      });
    } else {
      self.title = 'New Staff';
      self.entity = {}
      self.popoutUrl = $state.href('staffs.new');
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
      staffService.save(entity).then(function (item) {
        if (item) {
          if (self.isDialog) {
            $uibModalInstance.close(item);
          } else {
            if (self.entity_) {
              $state.reload();
            } else {
              $state.go('staffs.edit', { 'id': item.code });
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
        $state.go('staffs.list');
      }
    }
  })
