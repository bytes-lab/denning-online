materialAdmin
    .controller('contactListCtrl', function($filter, $uibModal, NgTableParams, contactService, Auth, $state) {
        var self = this;
        self.dataReady = false;
        self.openDelete = openDelete;
        self.userInfo = Auth.getUserInfo();
        self.clickHandler = clickHandler;

        contactService.getList().then(function(data) {
            self.data = data;
            self.dataReady = true;
            initializeTable();
        });        
        
        function clickHandler(item) {
            $state.go('contacts.edit', {'id': item.code});
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
                    // use built-in angular filter
                    var orderedData = params.filter() ? $filter('filter')(self.data, params.filter()) : self.data;
                    orderedData = params.sorting() ? $filter('orderBy')(orderedData, params.orderBy()) : orderedData;
                    params.total(orderedData.length); // set total for recalc pagination
                    return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                }
            })      
        }

        //Create Modal
        function modalInstances(animation, size, backdrop, keyboard, contact) {
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
                        return true;
                    }
                }            
            });
        }

        //Prevent Outside Click
        function openDelete(event, contact) {
            event.stopPropagation();
            modalInstances(true, '', 'static', true, contact)
        };        
    })

    .controller('ModalInstanceCtrl', function ($scope, $modalInstance, contact, on_list, contactService, $state) {
        $scope.ok = function () {
            contactService.delete(contact).then(function(contact) {
                if (on_list)
                    $state.reload();
                else
                    $state.go('contacts.list');
            })
            .catch(function(err){
                //Handler

                //$scope.formname.contactInfo.$error.push({meessage:''});
            });
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.close();
            if (on_list)
                $state.go('contacts.list');
        };
    })

    .controller('contactEditCtrl', function($filter, $uibModal, $stateParams, contactService, $state, Auth) {
        var self = this;
        self.save = save;
        self.cancel = cancel;
        self.isDialog = false;
        self.viewMode = false;  // for edit / create
        self.userInfo = Auth.getUserInfo();
        self.openDelete = openDelete;
        self.can_edit = false;

        if ($stateParams.id) {
            contactService.getItem($stateParams.id)
            .then(function(item){
                self.contact = angular.copy(item);  // important
            });
        } else {
            self.contact = {};
        }

        function save() {
            contactService.save(self.contact).then(function(contact) {
                self.contact = contact;
                $state.go('contacts.list');
            })
            .catch(function(err){
                //Handler
            });
        }

        function cancel() {
            $state.go('contacts.list');            
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

    .controller('contactCreateModalCtrl', function ($modalInstance, party, viewMode, initContacts, contactService, $scope, Auth) {
        var self = this;
        self.save = save;
        self.cancel = cancel;
        self.isDialog = true;
        self.viewMode = viewMode;
        self.party = party;
        self.userInfo = Auth.getUserInfo();
        self.initContacts = initContacts;

        if (viewMode) {
            contactService.getItem(party.party.code)
            .then(function(item){
                self.contact = item;
            });                                    
        } else {
            self.contact = {};
        }

        function save() {
            contactService.save(self.contact).then(function(contact) {
                self.contact = contact;
                // self.initContacts();
                self.party.party = contact.code;
                $modalInstance.close(contact);
            })
            .catch(function(err){
                //Handler
            });
        };

        function cancel() {
            $modalInstance.close();
        };
    })
