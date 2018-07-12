denningOnline
    .controller('bankAttorneyListCtrl', function($filter, $sce, $uibModal, NgTableParams, bankAttorneyService) {
        var self = this;
        self.dataReady = false;
        self.openDelete = openDelete;

        bankAttorneyService.getList().then(function(data) {
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

                    this.name = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.ic = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.bank = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.state = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                    params.total(orderedData.length); // set total for recalc pagination
                    return this.name, this.ic, this.bank, this.state;
                }
            })      
        }

        //Create Modal
        function modalInstances(animation, size, backdrop, keyboard, bankAttorney) {
            var modalInstance = $uibModal.open({
                animation: animation,
                templateUrl: 'myModalContent.html',
                controller: 'bankAttorneyDeleteModalCtrl',
                size: size,
                backdrop: backdrop,
                keyboard: keyboard,
                resolve: {
                    bankAttorney: function () {
                        return bankAttorney;
                    }
                }
            
            });
        }
        //Prevent Outside Click
        function openDelete(bankAttorney) {
            modalInstances(true, '', 'static', true, bankAttorney)
        };        
    })

    .controller('bankAttorneyDeleteModalCtrl', function ($scope, $uibModalInstance, bankAttorney, bankAttorneyService, $state) {
        $scope.ok = function () {
            bankAttorneyService.delete(bankAttorney).then(function(bankAttorney) {
                $state.reload();
            })
            .catch(function(err){
                //Handler

                //$scope.formname.bankAttorneyInfo.$error.push({meessage:''});
            });
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })

    .controller('bankAttorneyEditCtrl', function($filter, $stateParams, bankAttorneyService, $state) {
        var self = this;
        self.save = save;

        if($stateParams.id) {
            bankAttorneyService.getItem($stateParams.id)
            .then(function(item){
                self.bankAttorney = item;
            });
        } else {
            self.bankAttorney = {};
        }

        function save() {
            bankAttorneyService.save(self.bankAttorney).then(function(bankAttorney) {
                self.bankAttorney = bankAttorney;
                $state.go('bank-attorneys.list');
            })
            .catch(function(err){
                //Handler

                //$scope.formname.bankAttorneyInfo.$error.push({meessage:''});
            });
        }
    })