denningOnline
  .controller('presetbillListCtrl', function($filter, $uibModal, NgTableParams, $state, 
                                             presetbillService) 
  {
    var self = this;

    presetbillService.getList(1, 500).then(function(data) {
      self.data = data;
      initializeTable();
    });

    function initializeTable () {
      self.tableFilter = new NgTableParams({
        page: 1,
        count: 25,
        sorting: {
          name: 'asc' 
        }
      }, {
        dataset: self.data
      })
    }
  })

  .controller('presetbillEditCtrl', function($filter, $stateParams, presetbillService, 
                                             $state, billingitemService, refactorService,
                                             NgTableParams) 
  {
    var self = this;
    self.isDialog = false;

    billingitemService.getStateList().then(function (resp) {
      self.states = resp.data;
    })

    self.itemType = 'All';

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

    function initializeTable () {
      self.tableFilter = new NgTableParams({
        page: 1,
        count: 25,
        sorting: {
          name: 'asc' 
        }
      }, {
        getData: function (params) {
          return self.entity.listBilledItems.filter(function (item) {
            return self.itemType == 'All' || item.strBillItemType == self.itemType;
          })
        } 
      })
    }

    self.filterItem = function (type) {
      self.itemType = type;
      self.tableFilter.reload();
    }

    if ($stateParams.id) {
      self.title = 'PRESET BILL EDIT';
      presetbillService.getItem($stateParams.id).then(function (item){
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);
        initializeTable();
      });
    } else {
      self.title = 'NEW PRESET BILL';
      self.entity = {
        code: 'P' + Math.floor(Math.random() * 1000 + 1),
        strState: 'Common',
        strCategory: 'Conveyancing',
      };
    }

    self.save = function () {
      presetbillService.save(self.entity).then(function (presetbill) {
        self.entity = presetbill;
        $state.go('billing.presetbills-list');
      });
    }
  })
