materialAdmin
  .controller('noteListCtrl', function($stateParams, NgTableParams, noteService, $state) {
    var self = this;
    self.dataReady = false;
    self.clickHandler = clickHandler;

    noteService.getList($stateParams.id, 1, 500).then(function(data) {
      self.data = data;
      self.dataReady = true;
      initializeTable();
    });    

    function clickHandler(item) {
      $state.go('notes.edit', {'id': item.code});
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

  .controller('noteEditCtrl', function($stateParams, noteService, $state) {
    var self = this;
    self.cancel = cancel;

    noteService.getItem($stateParams.id)
    .then(function(item){
      self.landPTG = item;
    });

    function cancel() {
      $state.go('notes.list');      
    }
  })