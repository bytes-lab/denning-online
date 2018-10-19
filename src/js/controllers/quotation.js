denningOnline
  .controller('quotationListCtrl', function(NgTableParams, quotationService, Auth, $state, refactorService) {
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
          return data.data.map(function (item) {
            var item_ = angular.copy(item);
            item_.tax = refactorService.convertFloat(item.decTaxofDisbWithTax) + 
                        refactorService.convertFloat(item.decTaxofFee);
            item_.total = refactorService.convertFloat(item.decTaxofDisbWithTax) + 
                          refactorService.convertFloat(item.decTaxofFee) +
                          refactorService.convertFloat(item.decDisb) +
                          refactorService.convertFloat(item.decDisbWithTax) +
                          refactorService.convertFloat(item.decFee);
            return item_;
          });
        });
      }
    })

    self.search = function () {
      self.tableFilter.reload();
    }
  })

  .controller('quotationEditCtrl', function($stateParams, quotationService, $state, Auth,
                                            refactorService, fileMatterService, growlService,
                                            matterCodeService, presetbillService,
                                            uibDateParser, $uibModal, NgTableParams) 
  {
    var self = this;
    self.userInfo = Auth.getUserInfo();

    self.isDialog = false;
    self.can_edit = $state.$current.data.can_edit;
    self.isNew = $state.$current.data.can_edit;

    self.itemType = 'All';
    self.taxType = 'NoTax';
    self.quoteToList = [];

    self.queryMatters = function (search) {
      return fileMatterService.getList(1, 5, search).then(function (resp) {
        return resp.data
      })
    }

    self.matterChange = function (matter, json) {
      if (matter) {
        var matterInfo = matter;
        if (json) {
          if (!matter.JsonDesc) return;
          matterInfo = JSON.parse(matter.JsonDesc.replace(/[\u0000-\u0019]+/g,""));
        }

        self.entity.fileNo = matterInfo.systemNo;
        var clsPrimaryClient = matterInfo.primaryClient;

        self.entity.clsMatterCode = {
          'code': matterInfo.matter.code,
          'strDescription': matterInfo.matter.description,
        };

        self.matterDescription = matterInfo.matter.description;
        if (matterInfo.propertyGroup[0]) {
          self.entity.strPropertyAddress = matterInfo.propertyGroup[0].fullTitle;
        }
        self.entity.issueToName = clsPrimaryClient.name;
        self.entity.strClientName = clsPrimaryClient.name;

        // get quotation to info
        self.quoteToList = [];
        for (var idx in matterInfo.partyGroup) {
          var pg = matterInfo.partyGroup[idx];
          if (pg.party.length > 0) {
            self.quoteToList.push({ name: pg.PartyName, group: true });
            for (var sidx in pg.party) {
              self.quoteToList.push({ name: pg.party[sidx].name, group: false });
            }
          }
        }
      } else {
        self.entity.strClientName = '';
        self.entity.issueToName = '';
        self.quoteToList = [];
        self.strBillTo2 = null;
      }
    }

    self.presetBillChange = function (item) {
      if (item) {
        presetbillService.getItem(item.code).then(function (item) {
          self.entity.listBilledItems = item.listBilledItems;
          self.refreshItems();
        });
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
        self.entity.strBillingMatter = item.strDescription;
      }
    }

    self.insert = function (idx) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'billItemModal.html',
        controller: 'billItemModalCtrl as vm',
        size: 'lg',
        keyboard: true,
        resolve: {
          state: function () {
            return self.entity.strState;
          },
          category: function () {
            return null;
          },
          excludes: function () {
            var arr = [];
            for (ii in self.entity.listBilledItems) {
              var item = self.entity.listBilledItems[ii];
              arr.push(item.strItemCode);
            }
            return arr;
          }
        }
      }).result.then(function (res) {
        if (res && res.length > 0) {
          for (ii in res) {
            if (idx != -1) {
              self.entity.listBilledItems.splice(idx+parseInt(ii)+1, 0, res[ii]);
            } else {
              self.entity.listBilledItems.push(res[ii]);
            }
          }
          self.refreshItems();
        }
      }, function (res) {});
    }

    self.move = function (x, y) {
      if (x < 0) {
        return;
      } else if (y == self.entity.listBilledItems.length) {
        return;
      }

      var b = self.entity.listBilledItems[y];
      self.entity.listBilledItems[y] = self.entity.listBilledItems[x];
      self.entity.listBilledItems[x] = b;
      self.tableFilter.reload();
    };

    self.remove = function (code) {
      for (ii in self.entity.listBilledItems) {
        var item = self.entity.listBilledItems[ii];
        if (item.strItemCode == code) {
          self.entity.listBilledItems.splice(ii, 1);
          break;
        }
      }
      self.refreshItems();
    }

    function initializeTable () {
      self.tableFilter = new NgTableParams({
        page: 1,
        count: 25,
        sorting: {
          name: 'asc' 
        }
      }, {
        counts: [],
        getData: function (params) {
          return self.entity.listBilledItems.filter(function (item) {
            return self.itemType == 'All' || 
                   item.strBillItemType == self.itemType || 
                   item.strTaxCode == self.taxType;
          })
        } 
      });
      
      self.refreshItems();
    }

    function parseFFloat(strVal) {
      return parseFloat(strVal.replace(',', '').replace('(', '').replace(')', ''));
    }

    self.refreshItems = function () {
      self.gross = {
        All: 0.0,
        Fees: 0.0,
        Disb: 0.0,
        DisbWithTax: 0.0
      };

      self.sst = {
        Fees: 0.0,
        Disb: 0.0,
        DisbWithTax: 0.0
      };

      for (ii in self.entity.listBilledItems) {
        var item = self.entity.listBilledItems[ii];
        item.decUnitCost = parseFFloat(item.decUnitPrice) * parseFFloat(item.decUnit);
        item.decUnitTax = parseFFloat(item.decTaxRate) * item.decUnitCost;
        item.decTotal = item.decUnitCost + item.decUnitTax;

        self.gross[item.strBillItemType] += item.decUnitCost;
        self.sst[item.strBillItemType] += item.decUnitTax;
        self.gross['All'] += item.decUnitCost;
      }

      self.tableFilter.reload();
    }

    self.filterItem = function (type, tax) {
      self.itemType = type;
      self.taxType = tax;
      self.tableFilter.reload();
    }

    if ($stateParams.id) {
      self.title = 'Edit Quotation';
      quotationService.getItem($stateParams.id).then(function (item){
        self.entity = refactorService.preConvert(item, true);
        self.entity_ = angular.copy(self.entity);
        initializeTable();

        fileMatterService.getItemApp(self.entity.clsFileNo.strFileNo1).then(function (matterInfo) {
          for (var idx in matterInfo.partyGroup) {
            var pg = matterInfo.partyGroup[idx];
            if (pg.party.length > 0) {
              self.quoteToList.push({ name: pg.PartyName, group: true });
              for (var sidx in pg.party) {
                self.quoteToList.push({ name: pg.party[sidx].name, group: false });
              }
            }
          }
        });

        if(!self.entity.clsPresetBill.code) {
          self.entity.clsPresetBill = null;
        }
        
        if (self.entity.strBillTo2) {
          self.strBillTo2 = {
            name: self.entity.strBillTo2,
            group: false
          }
        }
      });
    } else {
      self.title = 'New Quotation';
      self.entity = {
        strState: 'Common',
        dtCreateDate: uibDateParser.parse(new Date()),
        listBilledItems: []
      };

      if ($stateParams.fileNo) {
        self.entity.clsFileNo = {
          strFileNo1: $stateParams.fileNo
        };

        fileMatterService.getItemApp(self.entity.clsFileNo.strFileNo1).then(function (matterInfo) {
          self.matterChange(matterInfo, false);
        });
      }

      if ($stateParams.billNo) {
        self.entity.clsPresetBill = {
          code: $stateParams.billNo
        };
        self.presetBillChange(self.entity.clsPresetBill);
      }

      initializeTable();
    }

    self.quoteToChange = function (item) {
      if (item) {
        self.entity.strBillTo2 = item.name;
      }
    }

    self.save = function () {
      entity = refactorService.getDiff(self.entity_, self.entity);
      quotationService.save(entity, self.entity_).then(function (item) {
        if (item) {
          if (self.entity_) {
            $state.reload();
          } else {
            $state.go('billing.quotations-edit', { 'id': item.code });
          }
          growlService.growl('Saved successfully!', 'success');          
        }
      });
    }
  })
