denningOnline
    .controller('cityListCtrl', function($filter, $sce, $uibModal, NgTableParams, cityService) {
        var self = this;
        self.dataReady = false;
        self.openDelete = openDelete;

        cityService.getList().then(function(data) {
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

                    this.city = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.postcode = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.state = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.country = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                    params.total(orderedData.length); // set total for recalc pagination
                    return this.city, this.postcode, this.state, this.country;
                }
            })      
        }

        self.modalContent = 'Are you sure to delete the city?';
    
        //Create Modal
        function modalInstances(animation, size, backdrop, keyboard, city) {
            var modalInstance = $uibModal.open({
                animation: animation,
                templateUrl: 'myModalContent.html',
                controller: 'cityDeleteModalCtrl',
                size: size,
                backdrop: backdrop,
                keyboard: keyboard,
                resolve: {
                    city: function () {
                        return city;
                    }
                }
            
            });
        }
        //Prevent Outside Click
        function openDelete(city) {
            modalInstances(true, '', 'static', true, city)
        };        
    })

    .controller('cityDeleteModalCtrl', function ($scope, $uibModalInstance, city, cityService, $state) {
        $scope.ok = function () {
            cityService.delete(city).then(function(city) {
                $state.reload();
            })
            .catch(function(err){
                //Handler

                //$scope.formname.cityInfo.$error.push({meessage:''});
            });
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })

    .controller('cityEditCtrl', function($filter, $stateParams, cityService, $state) {
        var self = this;
        self.save = save;

        if($stateParams.id) {
            cityService.getItem($stateParams.id)
            .then(function(item){
                self.city = item;
            });
        } else {
            self.city = {};
        }

        function save() {
            cityService.save(self.city).then(function(city) {
                self.city = city;
                $state.go('cities.list');
            })
            .catch(function(err){
                //Handler

                //$scope.formname.cityInfo.$error.push({meessage:''});
            });
        }
    })