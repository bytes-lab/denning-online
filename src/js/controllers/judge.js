denningOnline
  .controller('judgeListCtrl', function (NgTableParams, judgeService, Auth, $state) {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 25,
    }, {
      getData: function(params) {
        return judgeService.getList(params.page(), params.count(), self.keyword)
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

  .controller('judgeEditCtrl', function($stateParams, judgeService, $state, Auth, $scope,
                                        refactorService, growlService, uibDateParser, NgTableParams) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.isDialog = false;
    self.can_edit = $state.$current.data.can_edit;
    self.isNew = $state.$current.data.can_edit;

    if ($stateParams.id) {
      self.title = 'Edit Judge';
      judgeService.getItem($stateParams.id).then(function (item) {
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);
      });
    } else {
      self.title = 'New Judge';
      self.entity = {}
    }

    self.save = function () {
      entity = refactorService.getDiff(self.entity_, self.entity);

      judgeService.save(entity, self.entity_).then(function (item) {
        if (item) {
          if (self.entity_) {
            $state.reload();
          } else {
            $state.go('billing.quotations-edit', { 'id': item.code });
          }
          growlService.growl('Saved successfully!', 'success');          
        }
      });
    }
  })
