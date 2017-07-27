materialAdmin
    // =========================================================================
    // LAND OFFICE
    // =========================================================================
    
    .service('landOfficeService', ['$q', '$timeout',function($q, $timeout){
        var service = {};
        var fakedata = [
            {
                "id": 10238,
                "land_admin": "Marc Barnes",
                "email": "marc.barnes54@example.com",
                "town": "760105-06-2540",
                "phone1": "(382)-122-5003"
            },
            {   
                "id": 10243,
                "land_admin": "Glen Curtis",
                "email": "glen.curtis11@example.com",
                "town": "760105-06-2520",
                "id_type": "New + Old IC",
                "phone1": "(477)-981-4948"
            },
            {
                "id": 10248,
                "land_admin": "Beverly Gonzalez",
                "email": "beverly.gonzalez54@example.com",
                "town": "760105-06-2330",
                "id_type": "New + Old IC",
                "phone1": "(832)-255-5161"
            },
            {
                "id": 10253,
                "land_admin": "Yvonne Chavez",
                "email": "yvonne.chavez@example.com",
                "town": "760105-32-2540",
                "id_type": "New + Old IC",
                "phone1": "(477)-446-3715"
            },
            {
                "id": 10234,
                "land_admin": "Melinda Mitchelle",
                "email": "melinda@example.com",
                "town": "778805-06-2540",
                "id_type": "New + Old IC",
                "phone1": "(813)-716-4996"
                
            },
            {
                "id": 10239,
                "land_admin": "Shannon Bradley",
                "email": "shannon.bradley42@example.com",
                "town": "2120105-06-2540",
                "id_type": "New + Old IC",
                "phone1": "(774)-291-9928"
            },
            {
                "id": 10244,
                "land_admin": "Virgil Kim",
                "email": "virgil.kim81@example.com",
                "town": "760005-06-2540",
                "id_type": "New + Old IC",
                "phone1": "(219)-181-7898"
            },
            {
                "id": 10249,
                "land_admin": "Letitia Robertson",
                "email": "letitia.rober@example.com",
                "town": "540105-06-2540",
                "phone1": "(647)-209-4589"
            },
            {
                "id": 10237,
                "land_admin": "Claude King",
                "email": "claude.king22@example.com",
                "town": "98105-06-2540",
                "id_type": "New + Old IC",
                "phone1": "(657)-988-8701"
            },
            {
                "id": 10242,
                "land_admin": "Roland Craig",
                "email": "roland.craig47@example.com",
                "town": "767105-06-2540",
                "id_type": "New + Old IC",
                "phone1": "(932)-935-9471"
            },
            {
                "id": 10247,
                "land_admin": "Colleen Parker",
                "email": "colleen.parker38@example.com",
                "town": "762225-06-2540",
                "id_type": "New + Old IC",
                "phone1": "(857)-459-2792"
            },
            {
                "id": 10252,
                "land_admin": "Leah Jensen",
                "email": "leah.jensen27@example.com",
                "town": "76087-06-2540",
                "id_type": "New + Old IC",
                "phone1": "(861)-275-4686"
            },
            {
                "id": 10236,
                "land_admin": "Harold Martinez",
                "email": "martinez67@example.com",
                "town": "960105-96-2520",
                "id_type": "New + Old IC",
                "phone1": "(836)-634-9133"
            },
            {
                "id": 10241,
                "land_admin": "Keith Lowe",
                "email": "keith.lowe96@example.com",
                "town": "760105-06-2550",
                "id_type": "New + Old IC",
                "phone1": "(778)-787-3100"
            },
            {
                "id": 10246,
                "land_admin": "Charles Walker",
                "email": "charles.walker90@example.com",
                "town": "760105-26-2540",
                "id_type": "New + Old IC",
                "phone1": "(486)-440-4716"
            },
            {
                "id": 10251,
                "land_admin": "Lillie Curtis",
                "email": "lillie.curtis12@example.com",
                "town": "760605-06-2540",
                "id_type": "New + Old IC",
                "phone1": "(342)-510-2258"
            },
            {
                "id": 10235,
                "land_admin": "Genesis Reynolds",
                "email": "genesis@example.com",
                "town": "760105-07-2540",
                "id_type": "New + Old IC",
                "phone1": "(339)-375-1858"
            },
            {
                "id": 10240,
                "land_admin": "Oscar Palmer",
                "email": "oscar.palmer24@example.com",
                "town": "760105-76-2540",
                "id_type": "New + Old IC",
                "phone1": "(544)-270-9912"
            },
            {
                "id": 10245,
                "land_admin": "Lena Bishop",
                "email": "Lena Bishop",
                "town": "550105-06-2540",
                "id_type": "New + Old IC",
                "phone1": "(177)-521-1556"
            },
            {
                "id": 10250,
                "land_admin": "Kent Nguyen",
                "email": "kent.nguyen34@example.com",
                "town": "460105-06-2540",
                "id_type": "New + Old IC",
                "phone1": "(506)-533-6801"
            }
        ];

        service.landOffices = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getList() {
            var deferred = $q.defer();

            if(service.landOffices)
                deferred.resolve(service.landOffices);
            else
                $timeout(function(){
                    deferred.resolve(fakedata);
                    service.landOffices = fakedata;                
                }, 100);
            return deferred.promise;
        }  

        function getItem(id) {

            var deferred = $q.defer();

            $timeout(function(){
                if (!service.landOffices) {
                    service.landOffices = fakedata;
                }
                var item = service.landOffices.filter(function(c){
                    return c.id == id;
                });
                if (item.length == 1)
                    deferred.resolve(item[0]);
                else
                    deferred.resolve(new Error('No Item with the id'));
                
                
            }, 100);

            return deferred.promise;
        }

        function save(landOffice) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.landOffices.map(function(c) {return c.id; }).indexOf(landOffice.id);
                if(idx != -1) {
                    service.landOffices[idx] = landOffice;
                    deferred.resolve(landOffice);
                } else {
                    service.landOffices.push(landOffice);
                }
                //defered.reject(new Error('dd'));
            }, 100);

            return deferred.promise;
        }

        function delete_(landOffice) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.landOffices.map(function(c) {return c.id; }).indexOf(landOffice.id);
                if(idx != -1) {
                    service.landOffices.splice(idx, 1);
                    deferred.resolve(landOffice);
                } else {
                    defered.reject(new Error('There is no such landOffice'));
                }
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
