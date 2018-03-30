materialAdmin
  .controller('landOfficeListCtrl', function($filter, $sce, $uibModal, NgTableParams, landOfficeService, $state) {
    var self = this;
    self.dataReady = false;
    self.clickHandler = clickHandler;

    function clickHandler(item) {
      $state.go('land-offices.edit', {'id': item.code});
    }

    landOfficeService.getList(1, 500).then(function(data) {
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
        getData: function(params) {
          var orderedData = params.filter() ? $filter('filter')(self.data, params.filter()) : self.data;
          orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
          params.total(orderedData.length); // set total for recalc pagination
          return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
        }
      })    
    }   
  })

  .controller('landOfficeEditCtrl', function($filter, $stateParams, landOfficeService, $state, Auth) {
    var self = this;
    self.cancel = cancel;

    landOfficeService.getItem($stateParams.id)
    .then(function(item){
      self.landOffice = item;
    });

    function cancel() {
      $state.go('land-offices.list');
    }
  })
