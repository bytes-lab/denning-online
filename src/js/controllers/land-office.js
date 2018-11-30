denningOnline
  .controller('landOfficeListCtrl', function(NgTableParams, landOfficeService, $state) {
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
        count: 10,
        sorting: {
          name: 'asc'   // initial sorting
        }
      }, {
        dataset: self.data
      })    
    }   
  })

  .controller('landOfficeEditCtrl', function($stateParams, landOfficeService, $state) {
    var self = this;
    self.cancel = cancel;
    self.can_edit = $state.$current.data.can_edit;
    
    landOfficeService.getItem($stateParams.id)
    .then(function(item){
      self.landOffice = item;
    });

    function cancel() {
      $state.go('land-offices.list');
    }
  })
