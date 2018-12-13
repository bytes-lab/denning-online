denningOnline
  .controller('trialBalanceListCtrl', function(NgTableParams, trialBalanceService, $q) {
    var self = this;
    self.select_all = false;
    self.categories = ['client'];

    self.allCategories = [
      {'key': 'client', 'val': 'Client'}, 
      {'key': 'disb', 'val': 'Disbursement'}, 
      {'key': 'advance', 'val': 'Advances'}, 
      {'key': 'fd', 'val': 'FD Control'}, 
      {'key': 'other', 'val': 'Other'},
      {'key': 'recv', 'val': 'Receivables'},
      {'key': 'expense', 'val': 'Expense'},
      {'key': 'payable', 'val': 'Payable'},
    ];

    self.toggleAll = function () {
      self.categories = [];
      if (!self.select_all) {
        for (ii in self.allCategories) {
          self.categories.push(self.allCategories[ii].key);
        }
      }
      // console.log(self.categories);
      // self.set_category();
    }

    // self.toggleSelection = function (category) {
    //   var idx = self.categories.indexOf(category);
    //   if (idx > -1) {
    //     self.categories.splice(idx, 1);
    //     self.select_all = false;
    //   } else {
    //     self.categories.push(category);
    //   }
    //   // console.log(self.categories);
    //   self.set_category();
    // }

    // self.set_category = function() {
    //   self.dataReady = false;

    //   var promises = self.categories.map(function(category) {
    //     return ledgerService.getList($stateParams.fileNo, category);
    //   })
      
    //   $q.all(promises).then(function(data) {
    //     var allData = [];
    //     data.map(function (datum) {
    //       allData = allData.concat(datum)
    //     });

    //     self.dataReady = true;
    //     initializeTable();
    //   });
    // };


    // function initializeTable () {
    //   self.tableFilter = new NgTableParams({
    //     page: 1,
    //     count: 10
    //   }, {
    //     dataset: self.data
    //   })
    // }

    self.category = 'client';
    self.tableFilter = new NgTableParams({
      page: 1,
      count: 10
    }, {
      getData: function(params) {
        return trialBalanceService.getList(self.category, params.page(), params.count(), self.keyword)
        .then(function (data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    });

    self.search = function () {
      self.tableFilter.reload();
    }
  })

  .controller('trialBalanceEditCtrl', function($filter, $stateParams, trialBalanceService, $state) {
    var self = this;
    self.save = save;

    if($stateParams.id) {
      trialBalanceService.getItem($stateParams.id)
      .then(function(item){
        self.building = item;
      });
    } else {
      self.building = {};
    }

    function save() {
      trialBalanceService.save(self.building).then(function(building) {
        self.building = building;
        $state.go('buildings.list');
      })
      .catch(function(err){
        //Handler

        //$scope.formname.buildingInfo.$error.push({meessage:''});
      });
    }
  })