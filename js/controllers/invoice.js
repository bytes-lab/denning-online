materialAdmin
    .controller('invoiceListCtrl', function($filter, $uibModal, NgTableParams, invoiceService) {
        var self = this;
        self.dataReady = false;
        self.openDelete = openDelete;

        invoiceService.getList().then(function(data) {
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
        function modalInstances(animation, size, backdrop, keyboard, invoice) {
            var modalInstance = $uibModal.open({
                animation: animation,
                templateUrl: 'myModalContent.html',
                controller: 'InvoiceDeleteModalCtrl',
                size: size,
                backdrop: backdrop,
                keyboard: keyboard,
                resolve: {
                    invoice: function () {
                        return invoice;
                    }
                }            
            });
        }

        //Prevent Outside Click
        function openDelete(invoice) {
            modalInstances(true, '', 'static', true, invoice)
        };        
    })

    .controller('InvoiceDeleteModalCtrl', function ($scope, $uibModalInstance, invoice, invoiceService, $state) {
        $scope.ok = function () {
            invoiceService.delete(invoice).then(function(invoice) {
                $state.reload();
            })
            .catch(function(err){
                //Handler

                //$scope.formname.invoiceInfo.$error.push({meessage:''});
            });
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.close();
            $state.go('invoices.list');
        };
    })

    .controller('invoiceEditCtrl', function($filter, $stateParams, invoiceService, $state) {
        var self = this;
        self.save = save;
        self.cancel = cancel;
        self.isDialog = false;
        self.viewMode = false;  // for edit / create

        if ($stateParams.id) {
            invoiceService.getItem($stateParams.id)
            .then(function(item){
                self.invoice = angular.copy(item);  // important
            });
        } else {
            self.invoice = {};
        }

        function save() {
            invoiceService.save(self.invoice).then(function(invoice) {
                self.invoice = invoice;
                $state.go('invoices.list');
            })
            .catch(function(err){
                //Handler
            });
        }

        function cancel() {
            $state.go('invoices.list');            
        }
    })
