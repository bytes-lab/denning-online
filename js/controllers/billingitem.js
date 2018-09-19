denningOnline
  .controller('billingitemListCtrl', function(NgTableParams, billingitemService, Auth, 
                                              $state) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 25,
    }, {
      getData: function(params) {
        return billingitemService.getList(params.page(), params.count(), self.keyword)
        .then(function (data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    })

    self.search = function () {
      self.tableFilter.reload();
    }
  })

  .controller('billingitemEditCtrl', function($stateParams, billingitemService, $state,
                                              refactorService, fileMatterService, Auth, 
                                              matterCodeService, presetbillService,
                                              uibDateParser) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.isDialog = false;
    self.can_edit = $state.$current.data.can_edit;
    self.isNew = $state.$current.data.can_edit;

    self.categories = [
        'Conveyancing',
        'Agreement',
        'Litigation',
        'Will',
        'Estate Admin',
        'Tenancy',
        'Discharge of Charge',
        'Divorce',
        'Corporate Secretarial',
        'General',
        'Common'
    ];

    billingitemService.getStateList().then(function (resp) {
      self.states = resp.data;
    })

    if ($stateParams.id) {
      self.title = 'EDIT BILL ITEM';
      billingitemService.getItem($stateParams.id).then(function(item){
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);
      });
    } else {
      self.title = 'NEW BILL ITEM';
      self.entity = { };
    }
  })
