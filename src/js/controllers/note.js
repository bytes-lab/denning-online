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

    function initializeTable () {
      self.tableFilter = new NgTableParams({
        count: 10
      }, {
        dataset: self.data
      })
    }
  })

  .controller('noteEditCtrl', function($stateParams, growlService, noteService, $state, Auth, 
                                       $scope) 
  {
    var self = this;
    self.can_edit = $state.$current.data.can_edit;
    self.userInfo = Auth.getUserInfo();

    self.fileNo = $stateParams.fileNo;
    self.fileName = $stateParams.fileName;
    
    if ($stateParams.id) {
      noteService.getItem($stateParams.id)
      .then(function(item){
        self.note = angular.copy(item);
        self.note.dtDate = item.dtDate.split(' ')[0];
        self.title = 'Note Edit';
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
  })

  .controller('paymentRecordListCtrl', function($stateParams, NgTableParams, paymentRecordService, 
                                                $state) 
  {
    var self = this;
    self.fileNo = $stateParams.fileNo;

    paymentRecordService.getList($stateParams.fileNo).then(function (data) {
      self.title = data.strFileNo1+' ( '+data.strFilename+' )';
      self.fileName = data.strFilename;
      self.data = [];

      function compare(a,b) {
        if (a.dtDatePaid < b.dtDatePaid)
          return -1;
        if (a.dtDatePaid > b.dtDatePaid)
          return 1;
        return 0;
      }

      angular.forEach(data.section1, function(value, key) {
        value['section'] = ' ';
        value['dtDatePaid'] = moment(value['dtDatePaid'].split(' ')[0]);
        value['strDescription'] = value['dtDatePaid'].format('DD/MM/YYYY');
        value['strValue'] = value['decAmount'];
        self.data.push(value);
      })

      self.data = self.data.sort(compare);
      angular.forEach(data.section2, function(value, key) {
        value['section'] = '   ';
        self.data.push(value);
      })

      angular.forEach(data.section3, function(value, key) {
        value['section'] = '  ';
        self.data.push(value);
      })

      initializeTable();
    });

    function initializeTable () {
      self.tableFilter = new NgTableParams({
        group: "section"
      }, {
        dataset: self.data
      });
    }
  })

  .controller('paymentRecordEditCtrl', function($stateParams, paymentRecordService, Auth,
                                                $state, growlService, matterService, $scope,
                                                uibDateParser, $filter, refactorService) 
  {
    var self = this;
    self.isDialog = false;
    self.viewMode = false;
    self.userInfo = Auth.getUserInfo();
    self.can_edit = $state.$current.data.can_edit;
    self.create_new = $state.$current.data.can_edit;

    self.fileNo = $stateParams.fileNo;
    self.fileName = $stateParams.fileName;
    self.title_ = self.fileNo+' ( '+self.fileName+' )';

    if ($stateParams.id) {
      self.title = "Payment Record Edit";
      paymentRecordService.getItem($stateParams.id).then(function (item) {
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);

        if (self.entity.strMode) {
          self.strMode = { strDescription: self.entity.strMode };
        }
      });
    } else {
      self.title = "New Payment Record";
      self.entity = {
        strFileNo1: self.fileNo,
        dtDatePaid: uibDateParser.parse(new Date())
      }
    }

    self.paymentMethodChange = function (item) {
      if (item) {
        self.entity.strMode = item.strDescription;
      } else {
        self.entity.strMode = '';
      }
    }

    paymentRecordService.getPaymentMethodList().then(function (data) {
      self.paymentMethodList = data;
    })

    self.queryPaymentMethodType = function (search) {
      return self.paymentMethodList.filter(function (item) {
        return item.strDescription.search(new RegExp(search, "i")) > -1;
      });
    }

    self.save = function () {
      entity = refactorService.getDiff(self.entity_, self.entity);
      paymentRecordService.save(entity).then(function (entity) {
        if (entity) {
          if (self.entity_) {
            $state.reload();
          } else {
            $state.go('payment-records.edit', { id: entity.code, 
                                                fileNo: $stateParams.fileNo, 
                                                fileName: $stateParams.fileName });
          }
          growlService.growl('Saved successfully!', 'success');
        }
      });
    }

    self.cancel = function () {
      $state.go('payment-records.list', { fileNo: self.fileNo });
    }
  })
