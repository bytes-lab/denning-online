materialAdmin
  .controller('accountListCtrl', function($stateParams, NgTableParams, ledgerService, quotationService, $state) {
    var self = this;
    self.fileNo = $stateParams.fileNo;
    self.ledger_level2 = ledger_level2;
    self.ledger_type = 0;
    self.dataReady = false;

    function ledger_level2(category) {
      $state.go('accounts.list2', {'fileNo': $stateParams.fileNo, 'category': category});
    }

    self.quotationTable = new NgTableParams({
      page: 1,      
      count: 5,
      sorting: {
        name: 'asc' 
      }
    }, {
      counts: [],
      getData: function(params) {
        return quotationService.getList(params.page(), params.count(), $stateParams.fileNo).then(function(data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    });    
  })

  .controller('accountList2Ctrl', function($stateParams, NgTableParams, ledgerService, $state, $q) {
    var self = this;
    self.fileNo = $stateParams.fileNo;
    self.ledger_level2 = ledger_level2;
    self.toggleSelection = toggleSelection;
    self.toggleAll = toggleAll;
    self.all_categories = [{'key': 'client', 'val': 'Client'}, 
      {'key': 'fd', 'val': 'FD'}, 
      {'key': 'disb', 'val': 'Disbursement'}, 
      {'key': 'advance', 'val': 'Advanced'}, 
      {'key': 'other', 'val': 'Other'}];
    self.select_all = false;
    self.categories = [$stateParams.category];

    function toggleAll() {
      if (self.select_all) {
        self.categories = ['client', 'fd', 'disb', 'advance', 'other'];
      } else {
        self.categories = [];
      }
      // console.log(self.categories);
      self.set_category();
    }

    function toggleSelection(category) {
      var idx = self.categories.indexOf(category);
      if (idx > -1) {
        self.categories.splice(idx, 1);
        self.select_all = false;
      } else {
        self.categories.push(category);
      }
      // console.log(self.categories);
      self.set_category();
    }

    function ledger_level2(item) {
      $state.go('notes.edit', {'fileNo': $stateParams.fileNo, 'id': item.code});
    }

    self.set_category = function() {
      self.dataReady = false;

      var promises = self.categories.map(function(category) {
        return ledgerService.getList($stateParams.fileNo, category);
      })
      
      $q.all(promises).then(function(data) {
        var allData = [];
        data.map(function(datum){
          allData = allData.concat(datum)
        });

        self.data = [];
        angular.forEach(allData, function(value, key) {
          value['date'] = value['date'].split(' ')[0];
          self.data.push(value);
        });

        self.dataReady = true;
        initializeTable();
      });    
    };
    
    self.set_category();

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