denningOnline
  .controller('trialBalanceListCtrl', function(NgTableParams, trialBalanceService) {
    var self = this;
    self.all_categories = [
      {'key': 'client', 'val': 'Client'}, 
      {'key': 'disb', 'val': 'Disbursement'}, 
      {'key': 'advance', 'val': 'Advances'}, 
      {'key': 'fd', 'val': 'FD Control'}, 
      {'key': 'other', 'val': 'Other'},
      {'key': 'recv', 'val': 'Receivables'},
      {'key': 'expense', 'val': 'Expense'},
      {'key': 'payable', 'val': 'Payable'},
    ];

    self.category = 'all';
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