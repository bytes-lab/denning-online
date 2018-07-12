denningOnline
    .controller('receiptListCtrl', function($filter, $uibModal, NgTableParams, receiptService) {
        var self = this;
        self.dataReady = false;
        self.openDelete = openDelete;

        receiptService.getList().then(function(data) {
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
                    params.total(orderedData.length); // set total for recalc pagination
                    return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                }
            })      
        }

        //Create Modal
        function modalInstances(animation, size, backdrop, keyboard, receipt) {
            var modalInstance = $uibModal.open({
                animation: animation,
                templateUrl: 'myModalContent.html',
                controller: 'ReceiptDeleteModalCtrl',
                size: size,
                backdrop: backdrop,
                keyboard: keyboard,
                resolve: {
                    receipt: function () {
                        return receipt;
                    }
                }            
            });
        }

        //Prevent Outside Click
        function openDelete(receipt) {
            modalInstances(true, '', 'static', true, receipt)
        };        
    })

    .controller('ReceiptDeleteModalCtrl', function ($scope, $uibModalInstance, receipt, receiptService, $state) {
        $scope.ok = function () {
            receiptService.delete(receipt).then(function(receipt) {
                $state.reload();
            })
            .catch(function(err){
                //Handler

                //$scope.formname.receiptInfo.$error.push({meessage:''});
            });
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.close();
            $state.go('receipts.list');
        };
    })

    .controller('receiptEditCtrl', function($filter, $stateParams, receiptService, $state) {
        var self = this;
        self.save = save;
        self.cancel = cancel;
        self.isDialog = false;
        self.viewMode = false;  // for edit / create

        if ($stateParams.id) {
            receiptService.getItem($stateParams.id)
            .then(function(item){
                self.receipt = angular.copy(item);  // important
            });
        } else {
            self.receipt = {};
        }

        function save() {
            receiptService.save(self.receipt).then(function(receipt) {
                self.receipt = receipt;
                $state.go('receipts.list');
            })
            .catch(function(err){
                //Handler
            });
        }

        function cancel() {
            $state.go('receipts.list');            
        }
    })
