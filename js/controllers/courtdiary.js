materialAdmin
    .controller('courtdiaryListCtrl', function($filter, $uibModal, NgTableParams, courtdiaryService, $state, Auth) {
        var self = this;
        self.dataReady = false;
        self.openDelete = openDelete;
        self.clickHandler = clickHandler;
        self.userInfo = Auth.getUserInfo();

        courtdiaryService.getList().then(function(data) {
            self.data = data;
            self.dataReady = true;
            initializeTable();
        });        
        
        function clickHandler(item) {
            $state.go('courtdiaries.edit', {'id': item.code});
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
        function modalInstances(animation, size, backdrop, keyboard, courtdiary) {
            var modalInstance = $uibModal.open({
                animation: animation,
                templateUrl: 'myModalContent.html',
                controller: 'CourtDiaryDeleteModalCtrl',
                size: size,
                backdrop: backdrop,
                keyboard: keyboard,
                resolve: {
                    courtdiary: function () {
                        return courtdiary;
                    }
                }            
            });
        }

        //Prevent Outside Click
        function openDelete(event, courtdiary) {
            event.stopPropagation();
            modalInstances(true, '', 'static', true, courtdiary)
        };        
    })

    .controller('CourtDiaryDeleteModalCtrl', function ($scope, $modalInstance, courtdiary, courtdiaryService, $state) {
        $scope.ok = function () {
            courtdiaryService.delete(courtdiary).then(function(courtdiary) {
                $state.reload();
            })
            .catch(function(err){
                //Handler

                //$scope.formname.courtdiaryInfo.$error.push({meessage:''});
            });
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.close();
            $state.go('courtdiaries.list');
        };
    })

    .controller('courtdiaryEditCtrl', function($filter, $stateParams, courtdiaryService, $state) {
        var self = this;
        self.save = save;
        self.cancel = cancel;
        self.isDialog = false;
        self.viewMode = false;  // for edit / create
        self.userInfo = Auth.getUserInfo();
        self.openDelete = openDelete;
        self.can_edit = false;

        if ($stateParams.id) {
            courtdiaryService.getItem($stateParams.id)
            .then(function(item){
                self.courtdiary = angular.copy(item);  // important
            });
        } else {
            self.courtdiary = {};
        }

        function save() {
            courtdiaryService.save(self.courtdiary).then(function(courtdiary) {
                self.courtdiary = courtdiary;
                $state.go('courtdiaries.list');
            })
            .catch(function(err){
                //Handler
            });
        }

        function cancel() {
            $state.go('courtdiaries.list');            
        }

        //Create Modal
        function modalInstances1(animation, size, backdrop, keyboard, contact) {
            var modalInstance = $uibModal.open({
                animation: animation,
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                backdrop: backdrop,
                keyboard: keyboard,
                resolve: {
                    contact: function () {
                        return contact;
                    }, 
                    on_list: function () {
                        return false;
                    }
                }            
            });
        }

        //Prevent Outside Click
        function openDelete(event, contact) {
            event.stopPropagation();
            modalInstances1(true, '', 'static', true, contact)
        };        
    })
