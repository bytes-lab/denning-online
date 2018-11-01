denningOnline
  .controller('projectListCtrl', function(NgTableParams, projectService, $state) {
    var self = this;

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 25,
      sorting: {
        name: 'asc'
      }
    }, {
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

  .controller('projectEditCtrl', function($filter, $stateParams, refactorService, projectService, $state,
                                          growlService, Auth) 
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
  })