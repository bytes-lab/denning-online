materialAdmin
  .controller('landPTGListCtrl', function(NgTableParams, landPTGService, $state) {
    var self = this;
    self.dataReady = false;
    self.clickHandler = clickHandler;

    landPTGService.getList(1, 500).then(function(data) {
      self.data = data;
      self.dataReady = true;
      initializeTable();
    });

    function clickHandler(item) {
      $state.go('land-PTGs.edit', {'id': item.code});
    }
    
    function initializeTable () {
      //Filtering
      self.tableFilter = new NgTableParams({
        page: 1,
        count: 25,
        sorting: {
          name: 'asc' 
        }
      }, {
        dataset: self.data
      })
    }
  })

  .controller('landPTGEditCtrl', function($stateParams, landPTGService, $state) {
    var self = this;
    self.cancel = cancel;
    self.can_edit = $state.$current.data.can_edit;
    
    landPTGService.getItem($stateParams.id)
    .then(function(item){
      self.landPTG = item;
    });

    function cancel() {
      $state.go('land-PTGs.list');      
    }
  })