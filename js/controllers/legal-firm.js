materialAdmin
    .controller('legalFirmListCtrl', function($filter, $sce, $uibModal, NgTableParams, legalFirmService) {
        var self = this;
        self.dataReady = false;
        self.openDelete = openDelete;
        self.clickHandler = clickHandler;

        function clickHandler(item) {
            $state.go('legal-firms.edit', {'id': item.code});
        }

        legalFirmService.getList().then(function(data) {
            self.data = data;
            self.dataReady = true;
            initializeTable();
        });        
        
        function initializeTable () {
            //Filtering
            self.tableFilter = new NgTableParams({
                page: 1,            // show first page
                count: 10,
                sorting: {
                    name: 'asc'     // initial sorting
                }
            }, {
                total: self.data.length, // length of data
                getData: function(params) {
                    // use build-in angular filter
                    var orderedData = params.filter() ? $filter('filter')(self.data, params.filter()) : self.data;
                    orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;

                    this.data = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    params.total(orderedData.length); // set total for recalc pagination
                    return this.data;
                }
            })      
        }

        //Create Modal
        function modalInstances(animation, size, backdrop, keyboard, legalFirm) {
            var modalInstance = $uibModal.open({
                animation: animation,
                templateUrl: 'myModalContent.html',
                controller: 'legalFirmDeleteModalCtrl',
                size: size,
                backdrop: backdrop,
                keyboard: keyboard,
                resolve: {
                    legalFirm: function () {
                        return legalFirm;
                    }
                }
            
            });
        }
        //Prevent Outside Click
        function openDelete(legalFirm) {
            modalInstances(true, '', 'static', true, legalFirm)
        };        
    })

    .controller('legalFirmDeleteModalCtrl', function ($scope, $modalInstance, legalFirm, legalFirmService, $state) {
        $scope.ok = function () {
            legalFirmService.delete(legalFirm).then(function(legalFirm) {
                $state.reload();
            })
            .catch(function(err){
                //Handler

                //$scope.formname.legalFirmInfo.$error.push({meessage:''});
            });
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    })

    .controller('legalFirmEditCtrl', function($filter, $stateParams, legalFirmService, $state) {
        var self = this;
        self.save = save;

        if($stateParams.id) {
            legalFirmService.getItem($stateParams.id)
            .then(function(item){
                self.legalFirm = item;
            });
        } else {
            self.legalFirm = {};
        }

        function save() {
            legalFirmService.save(self.legalFirm).then(function(legalFirm) {
                self.legalFirm = legalFirm;
                $state.go('legal-firms.list');
            })
            .catch(function(err){
                //Handler

                //$scope.formname.legalFirmInfo.$error.push({meessage:''});
            });
        }
    })
    .controller('lfCreateModalCtrl', function ($modalInstance, lf, viewMode, legalFirmService, $scope, Auth) {
        var self = this;
        self.save = save;
        self.cancel = cancel;
        self.isDialog = true;
        self.viewMode = viewMode;
        self.userInfo = Auth.getUserInfo();

        if (viewMode) {
            legalFirmService.getItem(lf.party.code)
            .then(function(item){
                self.legalFirm = item;
            });                                    
        } else {
            self.legalFirm = {};
        }

        function save() {
            legalFirmService.save(self.legalFirm).then(function(legalFirm) {
                $modalInstance.close(legalFirm);
            })
            .catch(function(err){
                //Handler
            });
        };

        function cancel() {
            $modalInstance.close();
        };
    })
