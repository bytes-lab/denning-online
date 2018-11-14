denningOnline
  .controller('courtListCtrl', function(NgTableParams, courtService, $state, Auth) {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.tableFilter = new NgTableParams({}, {
      getData: function(params) {
        return courtService.getList(params.page(), params.count(), self.keyword, null)
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

  .controller('courtEditCtrl', function($stateParams, courtService, $state) {
    var self = this;
    self.cancel = cancel;

    courtService.getItem($stateParams.id)
    .then(function(item){
      self.court = item;
    });

    function cancel() {
      $state.go('courts.list');
    }
  })
