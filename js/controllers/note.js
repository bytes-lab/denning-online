denningOnline
  .controller('noteListCtrl', function($stateParams, NgTableParams, noteService, $state) {
    var self = this;
    self.dataReady = false;
    self.fileNo = $stateParams.fileNo;
    self.fileName = $stateParams.fileName;

    noteService.getList($stateParams.fileNo, 1, 500).then(function(data) {
      self.data = [];
      angular.forEach(data, function(value, key) {
        if (value['strNote'].length > 60) 
          value['strNote'] = value['strNote'].substring(0, 60) + '...';

        if (value.clsMeetBy.strName.length > 20)
          value.clsMeetBy.strName = value.clsMeetBy.strName.substring(0, 20) + '...';

        self.data.push(value);
      });

      self.dataReady = true;
      initializeTable();
    });    

    self.clickHandler = function (item) {
      $state.go('notes.edit', {'fileNo': $stateParams.fileNo, 'id': item.code, 'fileName': $stateParams.fileName});
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

  .controller('noteEditCtrl', function($stateParams, growlService, noteService, $state, Auth, $scope) {
    var self = this;
    self.can_edit = $state.$current.data.can_edit;
    self.userInfo = Auth.getUserInfo();
    self.fileNo = $stateParams.fileNo;
    self.fileName = $stateParams.fileName;
    
    if ($stateParams.id) {
      noteService.getItem($stateParams.id)
      .then(function(item){
        self.note = angular.copy(item);  // important
        self.note.dtDate = item.dtDate.split(' ')[0];
        self.title = 'Note Information';
      });
    } else {
      self.note = {
        strFileNo: $stateParams.fileNo,
        dtDate: new Date().toISOString().split('T')[0]
      };
      self.title = 'New Note';
    }

    self.save = function () {
      noteService.save(self.note).then(function(note) {
        if (note) {
          if (self.note.code) {
            $state.reload();
          } else {
            $state.go('notes.edit', {'fileNo': $stateParams.fileNo, 'id': note.code, 'fileName': $stateParams.fileName});
          }
          growlService.growl('Saved successfully!', 'success');          
        }
      });
    }

    self.cancel = function () {
      $state.go('notes.list', {'fileNo': $stateParams.fileNo, 'fileName': $stateParams.fileName});
    }

    $scope.open = function($event, opened) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope[opened] = true;
    };

    $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1
    };

    $scope.format = 'dd-MM-yyyy';
  })

  .controller('paymentRecordListCtrl', function($stateParams, NgTableParams, paymentRecordService, $state) {
    var self = this;
    self.dataReady = false;
    self.fileNo = $stateParams.fileNo;

    paymentRecordService.getList($stateParams.fileNo).then(function(data) {
      self.title = data.strFileNo1+' ( '+data.strFilename+' )';
      self.fileName = data.strFilename;
      self.data = [];

      angular.forEach(data.section1, function(value, key) {
        value['folder'] = ' ';
        value['strDescription'] = moment(value['dtDatePaid'].split(' ')[0]).format('DD/MM/YYYY');
        value['strValue'] = value['decAmount'];
        self.data.push(value);
      })

      angular.forEach(data.section2, function(value, key) {
        value['folder'] = '  ';
        self.data.push(value);
      })

      angular.forEach(data.section3, function(value, key) {
        value['folder'] = '   ';
        self.data.push(value);
      })

      initializeTable();
    });    

    function initializeTable () {
      //Filtering
      self.tableFilter = new NgTableParams({
        page: 1,      
        sorting: {
          name: 'asc' 
        },
        group: "folder"
      }, {
        dataset: self.data,
        counts: []
      })    
    }  
  })
