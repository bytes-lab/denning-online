denningOnline
  .controller('quotationListCtrl', function(NgTableParams, quotationService, Auth, $state) {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.tableFilter = new NgTableParams({
      page: 1,
      count: 25,
    }, {
      getData: function(params) {
        return quotationService.getList(params.page(), params.count(), self.keyword)
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

  .controller('quotationEditCtrl', function($stateParams, quotationService, $state, Auth,
                                            refactorService, fileMatterService, 
                                            matterCodeService) 
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
        var clsPrimaryClient = JSON.parse(matter.JsonDesc.replace(/[\u0000-\u0019]+/g,"")).primaryClient;
        self.entity.issueToName = clsPrimaryClient.name;
        self.entity.primaryClient = clsPrimaryClient.name;
      }
    }

    self.queryCodes = function(searchText) {
      return matterCodeService.getList(1, 10, searchText).then(function (data) {
        return data.data;
      });
    }

    self.matterCodeChange = function (item) {
      if (item && item.strDescription) {
        self.matterDescription = item.strDescription;
      }
    }

    if ($stateParams.id) {
      self.title = 'Edit Quotation';
      quotationService.getItem($stateParams.id).then(function(item){
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);

        self.rmatter = {
          key: self.entity.fileNo || ' '
        }

        self.matterDescription = self.entity.matter.description;
      });
    } else {
      self.title = 'New Quotation';
      self.entity = {};
    }
  })
