denningOnline
  .controller('projectListCtrl', function(NgTableParams, projectService, $state) {
    var self = this;

    self.tableFilter = new NgTableParams({}, {
      getData: function(params) {
        return projectService.getList(params.page(), params.count(), self.keyword)
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

  .controller('projectEditCtrl', function($stateParams, refactorService, projectService, $state, $scope,
                                          growlService, Auth, contactService) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();
    self.isNew = $state.$current.data.can_edit;
    self.can_edit = $state.$current.data.can_edit;

    if($stateParams.id) {
      self.title = 'Edit Project';
      projectService.getItem($stateParams.id).then(function (item) {
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);
      });
    } else {
      self.title = 'New Project';
    }

    $scope.open = function($event, opened) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[opened] = true;
    };

    self.queryContacts = function (searchText) {
      return contactService.getCustomerList(1, 10, searchText).then(function (resp) {
        return resp.data;
      });
    };

    self.copy = function () {
      self.isNew = true;
      self.can_edit = true;
      self.entity_ = null;

      var deleteList = ['code', 'dtDateEntered', 'dtDateUpdated', 'strProjectName'];
      for (ii in deleteList) {
        key = deleteList[ii];
        delete self.entity[key];
      }
    }

    self.save = function () {
      entity = refactorService.getDiff(self.entity_, self.entity);
      projectService.save(entity).then(function (Project) {
        if (self.entity_) {
          $state.reload();
        } else {
          $state.go('projects.edit', { 'id': Project.code });
        }
        growlService.growl('Saved successfully!', 'success');
      });
    }

    self.cancel = function () {
      $state.go('projects.list');
    }
  })