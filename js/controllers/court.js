materialAdmin
  .controller('courtListCtrl', function(NgTableParams, courtService, $state) {
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
        dataset: self.data
      })
    } 
  })

  .controller('courtEditCtrl', function($stateParams, courtService, $state) {
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
