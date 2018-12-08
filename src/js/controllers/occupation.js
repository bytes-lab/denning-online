denningOnline
  .controller('occupationListCtrl', function(NgTableParams, occupationService) {
    var self = this;

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 10
    }, {
      getData: function(params) {
        return occupationService.getList(params.page(), params.count(), self.keyword).then(function (data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    });

    self.search = function () {
      self.tableFilter.reload();
    }   
  })

  .controller('occupationEditCtrl', function($filter, $stateParams, occupationService, $state) {
    var self = this;
    self.save = save;

    if($stateParams.id) {
      occupationService.getItem($stateParams.id)
      .then(function(item){
        self.occupation = item;
      });
    } else {
      self.occupation = {};
    }

    function save() {
      occupationService.save(self.occupation).then(function(occupation) {
        self.occupation = occupation;
        $state.go('occupations.list');
      })
      .catch(function(err){
        //Handler

        //$scope.formname.occupationInfo.$error.push({meessage:''});
      });
    }
  })