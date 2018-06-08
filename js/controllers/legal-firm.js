materialAdmin
  .controller('legalFirmListCtrl', function(NgTableParams, legalFirmService, $state) {
    var self = this;
    self.search = search;
    self.keyword = '';
    self.clickHandler = clickHandler;

    function clickHandler(item) {
      $state.go('legal-firms.edit', {'id': item.code});
    }

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 25,
      sorting: {
        name: 'asc'
      }
    }, {
      getData: function(params) {
        return legalFirmService.getList(params.page(), params.count(), self.keyword).then(function(data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    })
  
    function search() {
      self.tableFilter.reload();
    }
  })

  .controller('legalFirmEditCtrl', function($stateParams, legalFirmService, $state, Auth) {
    var self = this;
    self.userInfo = Auth.getUserInfo();
    self.cancel = cancel;
    self.create_new = $state.$current.data.can_edit;
    self.can_edit = $state.$current.data.can_edit;
    self.viewMode = false;

    if ($stateParams.id) {
      legalFirmService.getItem($stateParams.id).then(function(item){
        self.legalFirm = item;
      });      
    } else {
      self.legalFirm = {};
    }

    function cancel() {
      $state.go('legal-firms.list');      
    }  
  })

  .controller('lfCreateModalCtrl', function ($modalInstance, lf, viewMode, legalFirmService, $scope, Auth) {
    var self = this;
    self.save = save;
    self.cancel = cancel;
    self.isDialog = true;
    self.viewMode = viewMode;
    self.userInfo = Auth.getUserInfo();

    if (viewMode) {
      legalFirmService.getItem(lf.party.code)
      .then(function(item){
        self.legalFirm = item;
      });                  
    } else {
      self.legalFirm = {};
    }

    function save() {
      legalFirmService.save(self.legalFirm).then(function(legalFirm) {
        $modalInstance.close(legalFirm);
      })
      .catch(function(err){
        //Handler
      });
    };

    function cancel() {
      $modalInstance.close();
    };
  })
