materialAdmin
  .controller('IRDBranchListCtrl', function($filter, $sce, $uibModal, NgTableParams, IRDBranchService, $state, Auth) {
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
        page: 1,      // show first page
        count: 30,
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

  .controller('IRDBranchEditCtrl', function($filter, $stateParams, IRDBranchService, $state, Auth) {
    var self = this;
    self.save = save;
    self.cancel = cancel;
    self.isDialog = false;
    self.viewMode = true;   // only for view
    self.userInfo = Auth.getUserInfo();
    self.can_edit = false;

    if($stateParams.id) {
      IRDBranchService.getItem($stateParams.id)
      .then(function(item){
        self.IRDBranch = item;
      });
    } else {
      self.IRDBranch = {};
    }

    function save() {
      IRDBranchService.save(self.IRDBranch).then(function(IRDBranch) {
        self.IRDBranch = IRDBranch;
        $state.go('IRD-branches.list');
      })
      .catch(function(err){
        //Handler

        //$scope.formname.IRDBranchInfo.$error.push({meessage:''});
      });
    }

    function cancel() {
      $state.go('IRD-branches.list');      
    }     
  })