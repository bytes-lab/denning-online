materialAdmin
  .controller('accountListCtrl', function($stateParams, NgTableParams, ledgerService, $state) {
    var self = this;
    self.fileNo = $stateParams.fileNo;
    self.ledger_type = 0;

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
    
    self.set_category('client');

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