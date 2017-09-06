materialAdmin
    .controller('quotationListCtrl', function($filter, $uibModal, NgTableParams, quotationService, $state) {
        var self = this;
        self.dataReady = false;
        self.openDelete = openDelete;
        self.clickHandler = clickHandler;

        quotationService.getList().then(function(data) {
            self.data = data;
            self.dataReady = true;
            initializeTable();
        });        
        
        function clickHandler(item) {
            $state.go('quotations.edit', {'id': item.code});
        }

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
        function modalInstances(animation, size, backdrop, keyboard, quotation) {
            var modalInstance = $uibModal.open({
                animation: animation,
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                backdrop: backdrop,
                keyboard: keyboard,
                resolve: {
                    quotation: function () {
                        return quotation;
                    }
                }            
            });
        }

        //Prevent Outside Click
        function openDelete(quotation) {
            modalInstances(true, '', 'static', true, quotation)
        };        
    })

    .controller('ModalInstanceCtrl', function ($scope, $modalInstance, quotation, quotationService, $state) {
        $scope.ok = function () {
            quotationService.delete(quotation).then(function(quotation) {
                $state.reload();
            })
            .catch(function(err){
                //Handler

                //$scope.formname.quotationInfo.$error.push({meessage:''});
            });
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.close();
            $state.go('quotations.list');
        };
    })

    .controller('quotationEditCtrl', function($filter, $stateParams, quotationService, $state) {
        var self = this;
        self.save = save;
        self.cancel = cancel;
        self.isDialog = false;
        self.viewMode = false;  // for edit / create

        if ($stateParams.id) {
            quotationService.getItem($stateParams.id)
            .then(function(item){
                self.quotation = angular.copy(item);  // important
            });
        } else {
            self.quotation = {};
        }

        function save() {
            quotationService.save(self.quotation).then(function(quotation) {
                self.quotation = quotation;
                $state.go('quotations.list');
            })
            .catch(function(err){
                //Handler
            });
        }

        function cancel() {
            $state.go('quotations.list');            
        }
    })
