denningOnline
  .controller('IRDBranchListCtrl', function(NgTableParams, IRDBranchService, $state, Auth) {
    var self = this;
    self.dataReady = false;
    self.clickHandler = clickHandler;
    self.userInfo = Auth.getUserInfo();

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
        page: 1,
        count: 10,
        sorting: {
          name: 'asc'
        }
      }, {
        dataset: self.data
      })    
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
