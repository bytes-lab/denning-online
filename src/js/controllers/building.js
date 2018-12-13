denningOnline
  .controller('buildingListCtrl', function(NgTableParams, buildingService) {
    var self = this;

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 10
    }, {
      getData: function(params) {
        return buildingService.getList(params.page(), params.count(), self.keyword)
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

  .controller('buildingEditCtrl', function($filter, $stateParams, buildingService, $state) {
    var self = this;
    self.save = save;

    if($stateParams.id) {
      buildingService.getItem($stateParams.id)
      .then(function(item){
        self.building = item;
      });
    } else {
      self.building = {};
    }

    function save() {
      buildingService.save(self.building).then(function(building) {
        self.building = building;
        $state.go('buildings.list');
      })
      .catch(function(err){
        //Handler

        //$scope.formname.buildingInfo.$error.push({meessage:''});
      });
    }
  })