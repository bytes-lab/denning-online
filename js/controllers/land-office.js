materialAdmin
    .controller('landOfficeListCtrl', function($filter, $sce, $uibModal, NgTableParams, landOfficeService) {
        var self = this;
        self.dataReady = false;
        self.openDelete = openDelete;

        landOfficeService.getList().then(function(data) {
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

                    this.land_admin = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.town = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.email = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.phone1 = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                    params.total(orderedData.length); // set total for recalc pagination
                    return this.land_admin, this.town, this.email, this.phone1;
                }
            })      
        }

        //Create Modal
        function modalInstances(animation, size, backdrop, keyboard, landOffice) {
            var modalInstance = $uibModal.open({
                animation: animation,
                templateUrl: 'myModalContent.html',
                controller: 'landOfficeDeleteModalCtrl',
                size: size,
                backdrop: backdrop,
                keyboard: keyboard,
                resolve: {
                    landOffice: function () {
                        return landOffice;
                    }
                }
            
            });
        }
        //Prevent Outside Click
        function openDelete(landOffice) {
            modalInstances(true, '', 'static', true, landOffice)
        };        
    })

    .controller('landOfficeDeleteModalCtrl', function ($scope, $modalInstance, landOffice, landOfficeService, $state) {
        $scope.ok = function () {
            landOfficeService.delete(landOffice).then(function(landOffice) {
                $state.reload();
            })
            .catch(function(err){
                //Handler

                //$scope.formname.landOfficeInfo.$error.push({meessage:''});
            });
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    })

    .controller('landOfficeEditCtrl', function($filter, $stateParams, landOfficeService, $state) {
        var self = this;
        self.save = save;

        if($stateParams.id) {
            landOfficeService.getItem($stateParams.id)
            .then(function(item){
                self.landOffice = item;
            });
        } else {
            self.landOffice = {};
        }

        function save() {
            landOfficeService.save(self.landOffice).then(function(landOffice) {
                self.landOffice = landOffice;
                $state.go('land-offices.list');
            })
            .catch(function(err){
                //Handler

                //$scope.formname.landOfficeInfo.$error.push({meessage:''});
            });
        }
    })