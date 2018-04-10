materialAdmin
  .controller('accountListCtrl', function($stateParams, NgTableParams, ledgerService, $state) {
    var self = this;
    self.fileNo = $stateParams.fileNo;
    self.ledger_level2 = ledger_level2;
    self.ledger_type = 0;
    self.dataReady = false;

    function ledger_level2(category) {
      $state.go('accounts.list2', {'fileNo': $stateParams.fileNo, 'category': category});
    }

    ledgerService.getList($stateParams.fileNo, 'client').then(function(data) {
      self.data = [];
      angular.forEach(data, function(value, key) {
        value['date'] = value['date'].split(' ')[0];
        self.data.push(value);
      });

      self.dataReady = true;
      initializeTable();
    });    

    function initializeTable () {
      //Filtering
      self.tableFilter = new NgTableParams({
        page: 1,      
        count: 5,
        sorting: {
          name: 'asc' 
        }
      }, {
        counts: [],
        dataset: self.data
      })    
    }  
  })

  .controller('accountList2Ctrl', function($stateParams, NgTableParams, ledgerService, $state) {
    var self = this;
    self.fileNo = $stateParams.fileNo;
    self.ledger_level2 = ledger_level2;
    self.category = $stateParams.category;

    function ledger_level2(item) {
      $state.go('notes.edit', {'fileNo': $stateParams.fileNo, 'id': item.code});
    }

    self.set_category = function(category) {
      self.dataReady = false;
      ledgerService.getList($stateParams.fileNo, category).then(function(data) {
        self.data = [];
        angular.forEach(data, function(value, key) {
          value['date'] = value['date'].split(' ')[0];
          self.data.push(value);
        });

        self.dataReady = true;
        initializeTable();
      });    
    };
    
    self.set_category($stateParams.category);

    function initializeTable () {
      //Filtering
      self.tableFilter = new NgTableParams({
        page: 1,      
        count: 5,
        sorting: {
          name: 'asc' 
        }
      }, {
        counts: [],
        dataset: self.data
      })    
    }  
  })

  .controller('landPTGEditCtrl', function($stateParams, ledgerService, $state) {
    var self = this;
    self.cancel = cancel;

    ledgerService.getItem($stateParams.id)
    .then(function(item){
      self.landPTG = item;
    });

    function cancel() {
      $state.go('land-PTGs.list');      
    }
  })