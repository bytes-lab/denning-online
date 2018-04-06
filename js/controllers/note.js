materialAdmin
  .controller('noteListCtrl', function($stateParams, NgTableParams, noteService, $state) {
    var self = this;
    self.dataReady = false;
    self.clickHandler = clickHandler;
    self.fileNo = $stateParams.fileNo;

    noteService.getList($stateParams.fileNo, 1, 500).then(function(data) {
      self.fileName = data.length > 0 && (data[0].strFileNo+' ( '+data[0].strFileName+' )') || 'Note List';
      self.data = data;
      self.dataReady = true;
      initializeTable();
    });    

    function clickHandler(item) {
      $state.go('notes.edit', {'fileNo': $stateParams.fileNo, 'id': item.code});
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

  .controller('noteEditCtrl', function($stateParams, noteService, $state, Auth) {
    var self = this;
    self.save = save;
    self.cancel = cancel;
    self.userInfo = Auth.getUserInfo();

    if ($stateParams.id) {
      noteService.getItem($stateParams.id)
      .then(function(item){
        self.note = angular.copy(item);  // important
      });
    } else {
      self.note = {strFileNo: $stateParams.fileNo};
    }

    function save() {
      noteService.save(self.note).then(function(note) {
        self.note = note;
        $state.go('notes.list');
      })
      .catch(function(err){
        //Handler
      });
    }

    function cancel() {
      $state.go('notes.list', {'fileNo': $stateParams.fileNo});      
    }
  })