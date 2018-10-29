denningOnline
  .controller('projectListCtrl', function(NgTableParams, projectService, $state) {
    var self = this;

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 25,
      sorting: {
        name: 'asc'
      }
    }, {
      getData: function(params) {
        return projectService.getHousingList(params.page(), params.count(), self.keyword)
        .then(function (data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    })
  
    self.search = function (event, clear) {
      if(event.which == 13 || clear) { 
        if (clear) {
          self.keyword='';
        }
        self.tableFilter.reload();
      }
    }
  })

  .controller('projectEditCtrl', function($filter, $stateParams, projectService, $state) {
    var self = this;
    self.save = save;

    if($stateParams.id) {
      projectService.getItem($stateParams.id)
      .then(function(item){
        self.contact = item;
      });
    } else {
      self.contact = {};
    }

    function save() {
      projectService.save(self.contact).then(function(contact) {
        self.contact = contact;
        $state.go('contacts.list');
      })
      .catch(function(err){
        //Handler

        //$scope.formname.contactInfo.$error.push({meessage:''});
      });
    }
  })