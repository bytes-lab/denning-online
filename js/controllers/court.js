materialAdmin
    .controller('courtListCtrl', function($filter, $sce, $uibModal, NgTableParams, courtService) {
        var self = this;
        self.dataReady = false;
        self.openDelete = openDelete;

        courtService.getList().then(function(data) {
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

                    this.type_eng = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.type_mal = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.place = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    this.phone1 = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                    params.total(orderedData.length); // set total for recalc pagination
                    return this.type_eng, this.type_mal, this.place, this.phone1;
                }
            })      
        }

        //Create Modal
        function modalInstances(animation, size, backdrop, keyboard, court) {
            var modalInstance = $uibModal.open({
                animation: animation,
                templateUrl: 'myModalContent.html',
                controller: 'courtDeleteModalCtrl',
                size: size,
                backdrop: backdrop,
                keyboard: keyboard,
                resolve: {
                    court: function () {
                        return court;
                    }
                }
            
            });
        }
        //Prevent Outside Click
        function openDelete(court) {
            modalInstances(true, '', 'static', true, court)
        };        
    })

    .controller('courtDeleteModalCtrl', function ($scope, $modalInstance, court, courtService, $state) {
        $scope.ok = function () {
            courtService.delete(court).then(function(court) {
                $state.reload();
            })
            .catch(function(err){
                //Handler

                //$scope.formname.courtInfo.$error.push({meessage:''});
            });
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    })

    .controller('courtEditCtrl', function($filter, $stateParams, courtService, $state) {
        var self = this;
        self.save = save;

        if($stateParams.id) {
            courtService.getItem($stateParams.id)
            .then(function(item){
                self.court = item;
            });
        } else {
            self.court = {};
        }

        function save() {
            courtService.save(self.court).then(function(court) {
                self.court = court;
                $state.go('courts.list');
            })
            .catch(function(err){
                //Handler

                //$scope.formname.courtInfo.$error.push({meessage:''});
            });
        }
    })