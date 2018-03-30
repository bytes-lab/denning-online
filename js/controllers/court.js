materialAdmin
  .controller('courtListCtrl', function($filter, $sce, $uibModal, NgTableParams, courtService, $state) {
    var self = this;
    self.dataReady = false;
    self.clickHandler = clickHandler;

    courtService.getList(1, 500).then(function(data) {
      self.data = data;
      self.dataReady = true;
      initializeTable();
    });    

    function clickHandler(item) {
      $state.go('courts.edit', {'id': item.code});
    }
    
    function initializeTable () {
      //Filtering
      self.tableFilter = new NgTableParams({
        page: 1,                                // show first page
        count: 25,
        sorting: {
          name: 'asc'                           // initial sorting
        }
      }, {
        getData: function(params) {
          var orderedData = params.filter() ? $filter('filter')(self.data, params.filter()) : self.data;
          orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
          params.total(orderedData.length);     // set total for recalc pagination
          return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
        }
      })
    } 
  })

  .controller('courtEditCtrl', function($filter, $stateParams, courtService, $state) {
    var self = this;
    self.cancel = cancel;

    courtService.getItem($stateParams.id)
    .then(function(item){
      self.court = item;
    });

    function cancel() {
      $state.go('courts.list');
    }
  })
