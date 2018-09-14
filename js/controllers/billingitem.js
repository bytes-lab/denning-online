denningOnline
  .controller('billingitemListCtrl', function(NgTableParams, billingitemService, Auth, $state) {
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

  .controller('billingitemEditCtrl', function($stateParams, billingitemService, $state, Auth,
                                            refactorService, fileMatterService, 
                                            matterCodeService, presetbillService,
                                            uibDateParser) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.isDialog = false;
    self.can_edit = $state.$current.data.can_edit;
    self.isNew = $state.$current.data.can_edit;

    self.queryMatters = function (search) {
      return fileMatterService.getList(1, 5, search).then(function (resp) {
        return resp.data
      })
    }

    self.matterChange = function (matter) {
      if (matter && matter.JsonDesc) {
        self.entity.fileNo = matter.key;
        var matterInfo = JSON.parse(matter.JsonDesc.replace(/[\u0000-\u0019]+/g,""));
        console.log(matterInfo);
        var clsPrimaryClient = matterInfo.primaryClient;

        self.entity.matter = matterInfo.matter;
        self.matterDescription = self.entity.matter.description;
        if (matterInfo.propertyGroup[0]) {
          self.entity.strPropertyAddress = matterInfo.propertyGroup[0].fullTitle;
          self.entity.strState = matterInfo.propertyGroup[0]
        }
        self.entity.issueToName = clsPrimaryClient.name;
        self.entity.strClientName = clsPrimaryClient.name;
      }
    }

    self.queryCodes = function(searchText) {
      return matterCodeService.getList(1, 10, searchText).then(function (data) {
        return data.data;
      });
    }

    self.queryBills = function (keyword) {
      return presetbillService.getTableList(1, 10, keyword).then(function (resp) {
        return resp;
      });
    }

    self.matterCodeChange = function (item) {
      if (item && item.strDescription) {
        self.matterDescription = item.strDescription;
      }
    }

    if ($stateParams.id) {
      self.title = 'EDIT QUOTATION';
      billingitemService.getItem($stateParams.id).then(function(item){
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);

        if (self.entity.strBillName) {
          self.presetCode = {
            code: self.entity.strBillName
          }
        }
      });
    } else {
      self.title = 'NEW QUOTATION';
      self.entity = {
        dtCreateDate: uibDateParser.parse(new Date())
      };
    }
  })
