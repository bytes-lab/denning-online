materialAdmin
    .controller('bankCACListCtrl', function($filter, $sce, $uibModal, NgTableParams, bankCACService) {
        var self = this;
        self.dataReady = false;
        self.openDelete = openDelete;

        bankCACService.getList().then(function(data) {
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

                    this.master_bank_code = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.CAC_name = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.email = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.phone3 = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                    params.total(orderedData.length); // set total for recalc pagination
                    return this.master_bank_code, this.CAC_name, this.email, this.phone3;
                }
            })      
        }

        self.modalContent = 'Are you sure to delete the bank CAC?';
    
        //Create Modal
        function modalInstances(animation, size, backdrop, keyboard, bank_CAC) {
            var modalInstance = $uibModal.open({
                animation: animation,
                templateUrl: 'myModalContent.html',
                controller: 'bankCACDeleteModalCtrl',
                size: size,
                backdrop: backdrop,
                keyboard: keyboard,
                resolve: {
                    bank_CAC: function () {
                        return bank_CAC;
                    }
                }
            
            });
        }
        //Prevent Outside Click
        function openDelete(bank_CAC) {
            modalInstances(true, '', 'static', true, bank_CAC)
        };        
    })

    .controller('bankCACDeleteModalCtrl', function ($scope, $modalInstance, bank_CAC, bankCACService, $state) {
        $scope.ok = function () {
            bankCACService.delete(bank_CAC).then(function(bank_CAC) {
                $state.reload();
            })
            .catch(function(err){
                //Handler

                //$scope.formname.bank_CACInfo.$error.push({meessage:''});
            });
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    })

    .controller('bankCACEditCtrl', function($filter, $stateParams, bankCACService, $state) {
        var self = this;
        self.save = save;

        if($stateParams.id) {
            bankCACService.getItem($stateParams.id)
            .then(function(item){
                self.bank_CAC = item;
            });
        } else {
            self.bank_CAC = {};
        }

        function save() {
            bankCACService.save(self.bank_CAC).then(function(bank_CAC) {
                self.bank_CAC = bank_CAC;
                $state.go('bank-CACs.list');
            })
            .catch(function(err){
                //Handler

                //$scope.formname.bank_CACInfo.$error.push({meessage:''});
            });
        }
    })