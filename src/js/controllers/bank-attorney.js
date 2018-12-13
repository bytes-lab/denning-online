denningOnline
  .controller('bankAttorneyListCtrl', function(NgTableParams, bankAttorneyService) {
    var self = this;

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 10
    }, {
      getData: function(params) {
        return bankAttorneyService.getTableList(params.page(), params.count(), self.keyword)
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

  .controller('bankAttorneyEditCtrl', function($filter, $stateParams, bankAttorneyService, $state) {
    var self = this;
    self.save = save;

    if($stateParams.id) {
      bankAttorneyService.getItem($stateParams.id)
      .then(function(item){
        self.bankAttorney = item;
      });
    } else {
      self.bankAttorney = {};
    }

    function save() {
      bankAttorneyService.save(self.bankAttorney).then(function(bankAttorney) {
        self.bankAttorney = bankAttorney;
        $state.go('bank-attorneys.list');
      })
      .catch(function(err){
        //Handler

        //$scope.formname.bankAttorneyInfo.$error.push({meessage:''});
      });
    }
  })