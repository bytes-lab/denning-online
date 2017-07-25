materialAdmin
    .controller('legalFirmListCtrl', function($filter, $sce, $uibModal, NgTableParams, legalFirmService) {
        var self = this;
        self.dataReady = false;
        self.openDelete = openDelete;

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

                    this.firm_name = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.title = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.email = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.phone2 = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                    params.total(orderedData.length); // set total for recalc pagination
                    return this.firm_name, this.title, this.email, this.phone2;
                }
            })      
        }

        self.modalContent = 'Are you sure to delete the legal firm?';
    
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