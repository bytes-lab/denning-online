materialAdmin
  .controller('bankCACListCtrl', function(NgTableParams, bankCACService, $state) {
    var self = this;
    self.dataReady = false;
    self.clickHandler = clickHandler;

    function clickHandler(item) {
      $state.go('bank-CACs.edit', {'id': item.code});
    }

    bankCACService.getTableList(1, 500).then(function(data) {
      self.data = data.data;
      self.dataReady = true;
      initializeTable();
    });    
    
    function initializeTable () {
      //Filtering
      self.tableFilter = new NgTableParams({
        page: 1,      // show first page
        count: 25,
        sorting: {
          name: 'asc'   // initial sorting
        }
      }, {
        dataset: self.data
      })    
    }   
  })

  .controller('bankCACDeleteModalCtrl', function ($scope, $modalInstance, bank_CAC, bankCACService, $state) {
    $scope.ok = function () {
      bankCACService.delete(bank_CAC).then(function(bank_CAC) {
        $state.reload();
      })
      .catch(function(err){
        //Handler

        //$scope.formname.bank_CACInfo.$error.push({meessage:''});
      });
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  })

  .controller('bankCACEditCtrl', function($filter, $stateParams, bankCACService, $state) {
    var self = this;
    self.save = save;

    if($stateParams.id) {
      bankCACService.getItem($stateParams.id)
      .then(function(item){
        self.bank_CAC = item;
      });
    } else {
      self.bank_CAC = {};
    }

    function save() {
      bankCACService.save(self.bank_CAC).then(function(bank_CAC) {
        self.bank_CAC = bank_CAC;
        $state.go('bank-CACs.list');
      })
      .catch(function(err){
        //Handler

        //$scope.formname.bank_CACInfo.$error.push({meessage:''});
      });
    }
  })