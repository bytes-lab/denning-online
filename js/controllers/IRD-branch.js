materialAdmin
  .controller('IRDBranchListCtrl', function($filter, $sce, $uibModal, NgTableParams, IRDBranchService, $state) {
    var self = this;
    self.dataReady = false;
    self.clickHandler = clickHandler;

    IRDBranchService.getList(1, 100).then(function(data) {
      self.data = data;
      self.dataReady = true;
      initializeTable();
    });    

    function clickHandler(item) {
      $state.go('IRD-branches.edit', {'id': item.code});
    }
    
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

  .controller('IRDBranchEditCtrl', function($filter, $stateParams, IRDBranchService, $state, Auth) {
    var self = this;
    self.cancel = cancel;

    IRDBranchService.getItem($stateParams.id)
    .then(function(item){
      self.IRDBranch = item;
    });

    function cancel() {
      $state.go('IRD-branches.list');      
    }     
  })