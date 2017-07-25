materialAdmin
    // =========================================================================
    // Contacts
    // =========================================================================
    
    .service('landPTGService', ['$q', '$timeout',function($q, $timeout){
        var service = {};
        var fakedata = [
            {
                "id": 10238,
                "branch": "Marc Barnes",
                "email": "marc.barnes54@example.com",
                "town": "760105-06-2540",
                "registrar": "New + Old IC",
                "phone1": "(382)-122-5003"
            },
            {   
                "id": 10243,
                "branch": "Glen Curtis",
                "email": "glen.curtis11@example.com",
                "town": "760105-06-2520",
                "registrar": "New + Old IC",
                "phone1": "(477)-981-4948"
            },
            {
                "id": 10248,
                "branch": "Beverly Gonzalez",
                "email": "beverly.gonzalez54@example.com",
                "town": "760105-06-2330",
                "registrar": "New + Old IC",
                "phone1": "(832)-255-5161"
            },
            {
                "id": 10253,
                "branch": "Yvonne Chavez",
                "email": "yvonne.chavez@example.com",
                "town": "760105-32-2540",
                "registrar": "New + Old IC",
                "phone1": "(477)-446-3715"
            },
            {
                "id": 10234,
                "branch": "Melinda Mitchelle",
                "email": "melinda@example.com",
                "town": "778805-06-2540",
                "registrar": "New + Old IC",
                "phone1": "(813)-716-4996"
                
            },
            {
                "id": 10239,
                "branch": "Shannon Bradley",
                "email": "shannon.bradley42@example.com",
                "town": "2120105-06-2540",
                "registrar": "New + Old IC",
                "phone1": "(774)-291-9928"
            },
            {
                "id": 10244,
                "branch": "Virgil Kim",
                "email": "virgil.kim81@example.com",
                "town": "760005-06-2540",
                "registrar": "New + Old IC",
                "phone1": "(219)-181-7898"
            },
            {
                "id": 10249,
                "branch": "Letitia Robertson",
                "email": "letitia.rober@example.com",
                "town": "540105-06-2540",
                "phone1": "(647)-209-4589"
            },
            {
                "id": 10237,
                "branch": "Claude King",
                "email": "claude.king22@example.com",
                "town": "98105-06-2540",
                "registrar": "New + Old IC",
                "phone1": "(657)-988-8701"
            },
            {
                "id": 10242,
                "branch": "Roland Craig",
                "email": "roland.craig47@example.com",
                "town": "767105-06-2540",
                "registrar": "New + Old IC",
                "phone1": "(932)-935-9471"
            },
            {
                "id": 10247,
                "branch": "Colleen Parker",
                "email": "colleen.parker38@example.com",
                "town": "762225-06-2540",
                "registrar": "New + Old IC",
                "phone1": "(857)-459-2792"
            },
            {
                "id": 10252,
                "branch": "Leah Jensen",
                "email": "leah.jensen27@example.com",
                "town": "76087-06-2540",
                "registrar": "New + Old IC",
                "phone1": "(861)-275-4686"
            },
            {
                "id": 10236,
                "branch": "Harold Martinez",
                "email": "martinez67@example.com",
                "town": "960105-96-2520",
                "registrar": "New + Old IC",
                "phone1": "(836)-634-9133"
            },
            {
                "id": 10241,
                "branch": "Keith Lowe",
                "email": "keith.lowe96@example.com",
                "town": "760105-06-2550",
                "registrar": "New + Old IC",
                "phone1": "(778)-787-3100"
            },
            {
                "id": 10246,
                "branch": "Charles Walker",
                "email": "charles.walker90@example.com",
                "town": "760105-26-2540",
                "registrar": "New + Old IC",
                "phone1": "(486)-440-4716"
            },
            {
                "id": 10251,
                "branch": "Lillie Curtis",
                "email": "lillie.curtis12@example.com",
                "town": "760605-06-2540",
                "registrar": "New + Old IC",
                "phone1": "(342)-510-2258"
            },
            {
                "id": 10235,
                "branch": "Genesis Reynolds",
                "email": "genesis@example.com",
                "town": "760105-07-2540",
                "registrar": "New + Old IC",
                "phone1": "(339)-375-1858"
            },
            {
                "id": 10240,
                "branch": "Oscar Palmer",
                "email": "oscar.palmer24@example.com",
                "town": "760105-76-2540",
                "registrar": "New + Old IC",
                "phone1": "(544)-270-9912"
            },
            {
                "id": 10245,
                "branch": "Lena Bishop",
                "email": "Lena Bishop",
                "town": "550105-06-2540",
                "registrar": "New + Old IC",
                "phone1": "(177)-521-1556"
            },
            {
                "id": 10250,
                "branch": "Kent Nguyen",
                "email": "kent.nguyen34@example.com",
                "town": "460105-06-2540",
                "registrar": "New + Old IC",
                "phone1": "(506)-533-6801"
            }
        ];

        service.landPTGs = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getList() {
            var deferred = $q.defer();

            if(service.landPTGs)
                deferred.resolve(service.landPTGs);
            else
                $timeout(function(){
                    deferred.resolve(fakedata);
                    service.landPTGs = fakedata;                
                }, 100);
            return deferred.promise;
        }  

        function getItem(id) {

            var deferred = $q.defer();

            $timeout(function(){
                if (!service.landPTGs) {
                    service.landPTGs = fakedata;
                }
                var item = service.landPTGs.filter(function(c){
                    return c.id == id;
                });
                if (item.length == 1)
                    deferred.resolve(item[0]);
                else
                    deferred.resolve(new Error('No Item with the id'));
                
                
            }, 100);

            return deferred.promise;
        }

        function save(landPTG) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.landPTGs.map(function(c) {return c.id; }).indexOf(landPTG.id);
                if(idx != -1) {
                    service.landPTGs[idx] = landPTG;
                    deferred.resolve(landPTG);
                } else {
                    service.landPTGs.push(landPTG);
                }
                //defered.reject(new Error('dd'));
            }, 100);

            return deferred.promise;
        }

        function delete_(landPTG) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.landPTGs.map(function(c) {return c.id; }).indexOf(landPTG.id);
                if(idx != -1) {
                    service.landPTGs.splice(idx, 1);
                    deferred.resolve(landPTG);
                } else {
                    defered.reject(new Error('There is no such landPTG'));
                }
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
