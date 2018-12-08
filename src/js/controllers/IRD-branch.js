denningOnline
  .controller('IRDBranchListCtrl', function(NgTableParams, IRDBranchService) {
    var self = this;

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 10
    }, {
      getData: function(params) {
        return IRDBranchService.getList(params.page(), params.count(), self.keyword).then(function (data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    });

    self.search = function () {
      self.tableFilter.reload();
    }
  })

  .controller('IRDBranchEditCtrl', function($stateParams, IRDBranchService, $state, Auth) {
    var self = this;
    self.userInfo = Auth.getUserInfo();
    self.cancel = cancel;
    self.create_new = $state.$current.data.can_edit;
    self.can_edit = $state.$current.data.can_edit;
    self.viewMode = false;

    if ($stateParams.id) {
      IRDBranchService.getItem($stateParams.id).then(function(item){
        self.IRDBranch = item;
      });
    } else {
      self.IRDBranch = {};
    }

    function cancel() {
      $state.go('IRD-branches.list');
    }
  })
