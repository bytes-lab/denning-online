materialAdmin
  .controller('landOfficeListCtrl', function($filter, $sce, $uibModal, NgTableParams, landOfficeService, $state) {
    var self = this;
    self.dataReady = false;
    self.clickHandler = clickHandler;

    function clickHandler(item) {
      $state.go('land-offices.edit', {'id': item.code});
    }

    landOfficeService.getList().then(function(data) {
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

  .controller('landOfficeEditCtrl', function($filter, $stateParams, landOfficeService, $state, Auth) {
    var self = this;
    self.cancel = cancel;
    self.isDialog = false;
    self.viewMode = false;  // for edit / create
    self.can_edit = false;

    landOfficeService.getItem($stateParams.id)
    .then(function(item){
      self.landOffice = item;
    });

    function cancel() {
      $state.go('land-offices.list');
    }
  })
