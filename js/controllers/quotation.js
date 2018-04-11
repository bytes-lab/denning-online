materialAdmin
  .controller('quotationListCtrl', function($filter, $uibModal, NgTableParams, quotationService, $state) {
    var self = this;
    self.dataReady = false;
    self.clickHandler = clickHandler;

    quotationService.getList().then(function(data) {
      self.data = data;
      self.dataReady = true;
      initializeTable();
    });    
    
    function clickHandler(item) {
      // $state.go('quotations.edit', {'id': item.code});
    }

    function initializeTable () {
      //Filtering
      self.tableFilter = new NgTableParams({
        page: 1,      // show first page
        count: 10,
        sorting: {
          name: 'asc'   // initial sorting
        }
      }, {
        total: self.data.length, // length of data
        getData: function(params) {
          // use build-in angular filter
          var orderedData = params.filter() ? $filter('filter')(self.data, params.filter()) : self.data;
          orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
          params.total(orderedData.length); // set total for recalc pagination
          return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
        }
      })
    }  
  })

  .controller('quotationEditCtrl', function($filter, $stateParams, quotationService, $state) {
    var self = this;
    self.cancel = cancel;
    self.isDialog = false;
    self.viewMode = false;  // for edit / create

    quotationService.getItem($stateParams.id)
    .then(function(item){
      self.quotation = angular.copy(item);  // important
    });

    function cancel() {
      $state.go('quotations.list');      
    }
  })
