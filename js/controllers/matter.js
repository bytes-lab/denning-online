denningOnline
  .controller('fileMatterListCtrl', function(NgTableParams, fileMatterService, Auth, $state) {
    var self = this;
    self.keyword = '';
    self.userInfo = Auth.getUserInfo();

    self.clickHandler = function (item) {
      $state.go('file-matters.edit', {'fileNo': item.systemNo});
    }

    self.tableFilter = new NgTableParams({
      page: 1,            // show first page
      count: 15,
      sorting: {
        name: 'asc'       // initial sorting
      }
    }, {
      getData: function(params) {
        return fileMatterService.getList(params.page(), params.count(), self.keyword).then(function(data) {
          var data_ = [];
          params.total(data.headers('x-total-count'));
          angular.forEach(data.data, function(value, key) {
            var item = JSON.parse(value.JsonDesc.replace(/[\u0000-\u0019]+/g,""));
            item.dateOpen = item.dateOpen.split(' ')[0];
            data_.push(item);
          });
          return data_;
        });
      }
    })    

    self.search = function () {
      self.tableFilter.reload();
    }
  })

  .controller('relatedMatterCtrl', function($filter, $stateParams, NgTableParams, fileMatterService, $state) {
    var type = $state.$current.data.type;
    var self = this;
    self.filter = true;

    fileMatterService.getRelatedMatters(type, $stateParams.id).then(function (data) {
      self.data = [];
      angular.forEach(data, function(value, key) {
        var item = JSON.parse(value.JsonDesc.replace(/[\u0000-\u0019]+/g,""));
        item.dateOpen = item.dateOpen.split(' ')[0];
        self.data.push(item);
      })
      initializeTable();
    });

    self.clickHandler = function (item) {
      $state.go('file-matters.edit', {'fileNo': item.systemNo});
    }
    
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

  .controller('matterCodeListCtrl', function(NgTableParams, matterCodeService, $state) {
    var self = this;

    self.clickHandler = function (item) {
      $state.go('matter-codes.edit', {'id': item.code});
    }

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 25,
    }, {
      getData: function(params) {
        return matterCodeService.getList(params.page(), params.count(), self.keyword).then(function (data) {
          params.total(data.headers('x-total-count'));
          return data.data;
        });
      }
    })

    self.search = function () {
      self.tableFilter.reload();
    }
  })

  .controller('matterCodeEditCtrl', function($filter, $uibModal, $stateParams, matterCodeService, $state, 
                                             Auth, presetbillService, matterFormService, growlService,
                                             refactorService) 
  {
    var self = this;
    self.isDialog = false;
    self.viewMode = false;  // for edit / create
    self.userInfo = Auth.getUserInfo();
    self.can_edit = $state.$current.data.can_edit;
    self.create_new = $state.$current.data.can_edit;

    self.partyLabels = [
      'Client', 
      'Vendor', 
      'Purchaser', 
      'Borrower', 
      'Guarantor', 
      'Plaintiff', 
      'Defendant', 
      'Assignor', 
      'Assignee',
      'Financing Bank', 
      'Chargee / Assignee Bank', 
      'Landlord', 
      'Tenant', 
      'Lessor', 
      'Lessee', 
      'First Party', 
      'Second Party', 
      'Third Party', 
      'Fourth Party',
      'Fifth Party', 
      'Sixth Party'
    ];

    self.lawyerLabels = [
      'Vendor Solicitors', 
      'Purchaser Solicitors', 
      'Bank Solicitors', 
      'Charger Solicitors', 
      'Plaintiff Solicitors', 
      'Defendant Solicitors', 
      'Third Party Solicitors', 
      'Appellant Solicitors', 
      'Respondent Solicitors'
    ];

    self.bankLabels = [
      'Chargee Bank', 
      'Financing Bank', 
      'Stakeholder Bank', 
      'Developer HDA Bank'
    ];

    self.mattercode = {};   //  temp variable for json fields

    $("#back-top").hide();
    $(window).scroll(function() {
      if ($(this).scrollTop() > 100) {
        $('#back-top').fadeIn();
        $('.btn-balances').fadeIn();
      } else {
        $('#back-top').fadeOut();
        $('.btn-balances').fadeOut();
      }
    });

    presetbillService.getList(1, 500).then(function(data) {
      self.presetBills = data;
    });

    self.scrollUp = function () {
      $('body,html').animate({
          scrollTop : 0
      }, 500);
      return false;
    };

    if ($stateParams.id) {
      matterCodeService.getItem($stateParams.id).then(function (item){
        self.entity = item;
        self.entity_ = angular.copy(self.entity);
        
        angular.forEach(JSON.parse(item.jsonFieldLabels || "{}"), function(value, key) {
          self.mattercode[value.Field] = value;
        })

        // self.mattercode.staff1 = {'Label': 'Partner'};
        // self.mattercode.staff2 = {'Label': 'L.A.'};
        // self.mattercode.staff3 = {'Label': 'Clerk in charge'};
        // self.mattercode.staff4 = {'Label': 'Team'};
      });
    } else {
      self.entity = {};
    }

    self.range = function(min, max, step) {
        step = step || 1;
        var input = [];
        for (var i = min; i <= max; i += step) {
            input.push(i);
        }
        return input;
    };

    self.copy = function () {
      self.create_new = true;
      self.can_edit = true;
      self.entity_ = null;

      var deleteList = ['code', 'dtDateEntered', 'dtDateUpdated'];
      for (ii in deleteList) {
        key = deleteList[ii];
        delete self.entity[key];
      }
    }

    self.save = function () {
      var selected = [];
      angular.forEach(self.mattercode, function(value, key) {
        selected.push(value);
      })

      self.entity.jsonFieldLabels = JSON.stringify(selected);

      entity = refactorService.getDiff(self.entity_, self.entity);
      matterCodeService.save(entity).then(function (entity) {
        if (self.entity_) {
          $state.reload();
        } else {
          $state.go('matter-codes.edit', { 'id': entity.code });
        }
        growlService.growl('Saved successfully!', 'success');
      });
    }

    self.openDelete = function (event, entity) {
      event.stopPropagation();

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'deleteEntityModal.html',
        controller: 'deleteEntityModalCtrl',
        size: '',
        backdrop: 'static',
        keyboard: true,
        resolve: {
          entity: function () {
            return entity;
          }, 
          on_list: function () {
            return false;
          },
          entity_type: function () {
            return 'matter code';
          },
          service: function () {
            return matterCodeService;
          },
          return_state: function () {
            return 'matter-codes.list';
          }
        }
      });      
    };

    self.queryList = function (labels, q) {
      return labels.filter(function(item) {
        return item.search(new RegExp(q, "i")) > -1;
      });
    };

    self.queryForms = function (searchText) {
      return matterFormService.getList(1, 10, searchText).then(function(data) { return data; });
    };

    self.queryBills = function (searchText) {
      return self.presetBills.filter(function(c) {
        return c.code.search(new RegExp(searchText, "i")) > -1 || c.description.search(new RegExp(searchText, "i")) > -1;
      });
    }
  })
