denningOnline
    .controller('bankListCtrl', function($filter, $sce, $uibModal, NgTableParams, bankService) {
        var self = this;
        self.dataReady = false;
        self.openDelete = openDelete;

        bankService.getList().then(function(data) {
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

                    this.code = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.name = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.email = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.phone = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                    params.total(orderedData.length); // set total for recalc pagination
                    return this.code, this.name, this.email, this.phone;
                }
            })      
        }

        //Create Modal
        function modalInstances(animation, size, backdrop, keyboard, bank) {
            var modalInstance = $uibModal.open({
                animation: animation,
                templateUrl: 'myModalContent.html',
                controller: 'bankDeleteModalCtrl',
                size: size,
                backdrop: backdrop,
                keyboard: keyboard,
                resolve: {
                    bank: function () {
                        return bank;
                    }
                }
            
            });
        }
        //Prevent Outside Click
        function openDelete(bank) {
            modalInstances(true, '', 'static', true, bank)
        };        
    })

    .controller('bankDeleteModalCtrl', function ($scope, $uibModalInstance, bank, bankService, $state) {
        $scope.ok = function () {
            bankService.delete(bank).then(function(bank) {
                $state.reload();
            })
            .catch(function(err){
                //Handler

                //$scope.formname.bankInfo.$error.push({meessage:''});
            });
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })

    .controller('bankEditCtrl', function($filter, $stateParams, bankService, $state) {
        var self = this;
        self.save = save;

        if($stateParams.id) {
            bankService.getItem($stateParams.id)
            .then(function(item){
                self.bank = item;
            });
        } else {
            self.bank = {};
        }

        function save() {
            bankService.save(self.bank).then(function(bank) {
                self.bank = bank;
                $state.go('banks.list');
            })
            .catch(function(err){
                //Handler

                //$scope.formname.bankInfo.$error.push({meessage:''});
            });
        }
    })