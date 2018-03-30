materialAdmin
  .controller('legalFirmListCtrl', function($filter, $sce, $uibModal, NgTableParams, legalFirmService, $state) {
    var self = this;
    self.dataReady = false;
    self.clickHandler = clickHandler;

    function clickHandler(item) {
      $state.go('legal-firms.edit', {'id': item.code});
    }

    legalFirmService.getList().then(function(data) {
      self.data = data;
      self.dataReady = true;
      initializeTable();
    });    
    
    function initializeTable () {
      //Filtering
      self.tableFilter = new NgTableParams({
        page: 1,      // show first page
        count: 25,
        sorting: {
          name: 'asc'   // initial sorting
        }
      }, {
        total: self.data.length, // length of data
        getData: function(params) {
          // use build-in angular filter
          var orderedData = params.filter() ? $filter('filter')(self.data, params.filter()) : self.data;
          orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;

          this.data = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
          params.total(orderedData.length); // set total for recalc pagination
          return this.data;
        }
      })    
    }  
  })

  .controller('legalFirmEditCtrl', function($filter, $stateParams, legalFirmService, $state, Auth) {
    var self = this;
    self.cancel = cancel;
    self.isDialog = false;
    self.viewMode = false;  // for edit / create
    self.can_edit = false;

    if($stateParams.id) {
      legalFirmService.getItem($stateParams.id)
      .then(function(item){
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
