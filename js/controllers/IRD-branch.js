materialAdmin
  .controller('IRDBranchListCtrl', function(NgTableParams, IRDBranchService, $state) {
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
        dataset: self.data
      })    
    } 
  })

  .controller('IRDBranchEditCtrl', function($stateParams, IRDBranchService, $state) {
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