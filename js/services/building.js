denningOnline
    // =========================================================================
    // Contacts
    // =========================================================================
    
    .service('buildingService', ['$q', '$timeout',function($q, $timeout){
        var service = {};
        var fakedata = [
            {
                "code": 10238,
                "type": "Marc Barnes",
                "email": "marc.barnes54@example.com",
                "code": "760105-06-2540",
                "phone3": "(382)-122-5003",
                "bc_type": "New + Old IC"
            },
            {   
                "code": 10243,
                "type": "Glen Curtis",
                "email": "glen.curtis11@example.com",
                "code": "760105-06-2520",
                "bc_type": "New + Old IC",
                "phone3": "(477)-981-4948"
            },
            {
                "code": 10248,
                "type": "Beverly Gonzalez",
                "email": "beverly.gonzalez54@example.com",
                "code": "760105-06-2330",
                "bc_type": "New + Old IC",
                "phone3": "(832)-255-5161"
            },
            {
                "code": 10253,
                "type": "Yvonne Chavez",
                "email": "yvonne.chavez@example.com",
                "code": "760105-32-2540",
                "bc_type": "New + Old IC",
                "phone3": "(477)-446-3715"
            },
            {
                "code": 10234,
                "type": "Melinda Mitchelle",
                "email": "melinda@example.com",
                "code": "778805-06-2540",
                "bc_type": "New + Old IC",
                "phone3": "(813)-716-4996"
                
            },
            {
                "code": 10239,
                "type": "Shannon Bradley",
                "email": "shannon.bradley42@example.com",
                "code": "2120105-06-2540",
                "bc_type": "New + Old IC",
                "phone3": "(774)-291-9928"
            },
            {
                "code": 10244,
                "type": "Virgil Kim",
                "email": "virgil.kim81@example.com",
                "code": "760005-06-2540",
                "bc_type": "New + Old IC",
                "phone3": "(219)-181-7898"
            },
            {
                "code": 10249,
                "type": "Letitia Robertson",
                "email": "letitia.rober@example.com",
                "code": "540105-06-2540",
                "phone3": "(647)-209-4589"
            },
            {
                "code": 10237,
                "type": "Claude King",
                "email": "claude.king22@example.com",
                "code": "98105-06-2540",
                "bc_type": "New + Old IC",
                "phone3": "(657)-988-8701"
            },
            {
                "code": 10242,
                "type": "Roland Craig",
                "email": "roland.craig47@example.com",
                "code": "767105-06-2540",
                "bc_type": "New + Old IC",
                "phone3": "(932)-935-9471"
            },
            {
                "code": 10247,
                "type": "Colleen Parker",
                "email": "colleen.parker38@example.com",
                "code": "762225-06-2540",
                "bc_type": "New + Old IC",
                "phone3": "(857)-459-2792"
            },
            {
                "code": 10252,
                "type": "Leah Jensen",
                "email": "leah.jensen27@example.com",
                "code": "76087-06-2540",
                "bc_type": "New + Old IC",
                "phone3": "(861)-275-4686"
            },
            {
                "code": 10236,
                "type": "Harold Martinez",
                "email": "martinez67@example.com",
                "code": "960105-96-2520",
                "bc_type": "New + Old IC",
                "phone3": "(836)-634-9133"
            },
            {
                "code": 10241,
                "type": "Keith Lowe",
                "email": "keith.lowe96@example.com",
                "code": "760105-06-2550",
                "bc_type": "New + Old IC",
                "phone3": "(778)-787-3100"
            },
            {
                "code": 10246,
                "type": "Charles Walker",
                "email": "charles.walker90@example.com",
                "code": "760105-26-2540",
                "bc_type": "New + Old IC",
                "phone3": "(486)-440-4716"
            },
            {
                "code": 10251,
                "type": "Lillie Curtis",
                "email": "lillie.curtis12@example.com",
                "code": "760605-06-2540",
                "bc_type": "New + Old IC",
                "phone3": "(342)-510-2258"
            },
            {
                "code": 10235,
                "type": "Genesis Reynolds",
                "email": "genesis@example.com",
                "code": "760105-07-2540",
                "bc_type": "New + Old IC",
                "phone3": "(339)-375-1858"
            },
            {
                "code": 10240,
                "type": "Oscar Palmer",
                "email": "oscar.palmer24@example.com",
                "code": "760105-76-2540",
                "bc_type": "New + Old IC",
                "phone3": "(544)-270-9912"
            },
            {
                "code": 10245,
                "type": "Lena Bishop",
                "email": "Lena Bishop",
                "code": "550105-06-2540",
                "bc_type": "New + Old IC",
                "phone3": "(177)-521-1556"
            },
            {
                "code": 10250,
                "type": "Kent Nguyen",
                "email": "kent.nguyen34@example.com",
                "code": "460105-06-2540",
                "bc_type": "New + Old IC",
                "phone3": "(506)-533-6801"
            }
        ];

        service.buildings = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getList() {
            var deferred = $q.defer();

            if(service.buildings)
                deferred.resolve(service.buildings);
            else
                $timeout(function(){
                    deferred.resolve(fakedata);
                    service.buildings = fakedata;                
                }, 100);
            return deferred.promise;
        }  

        function getItem(code) {

            var deferred = $q.defer();

            $timeout(function(){
                if (!service.buildings) {
                    service.buildings = fakedata;
                }
                var item = service.buildings.filter(function(c){
                    return c.code == code;
                });
                if (item.length == 1)
                    deferred.resolve(item[0]);
                else
                    deferred.resolve(new Error('No Item with the code'));
                
                
            }, 100);

            return deferred.promise;
        }

        function save(building) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.buildings.map(function(c) {return c.code; }).indexOf(building.code);
                if(idx != -1) {
                    service.buildings[idx] = building;
                    deferred.resolve(building);
                } else {
                    service.buildings.push(building);
                }
                //deferred.reject(new Error('dd'));
            }, 100);

            return deferred.promise;
        }

        function delete_(building) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.buildings.map(function(c) {return c.code; }).indexOf(building.code);
                if(idx != -1) {
                    service.buildings.splice(idx, 1);
                    deferred.resolve(building);
                } else {
                    deferred.reject(new Error('There is no such building'));
                }
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
