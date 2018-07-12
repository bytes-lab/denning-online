denningOnline
    // =========================================================================
    // Contacts
    // =========================================================================
    
    .service('mukimService', ['$q', '$timeout',function($q, $timeout){
        var service = {};
        var fakedata = [
            {
                "id": 10238,
                "mukim": "Marc Barnes",
                "district": "marc.barnes54@example.com",
                "state": "760105-06-2540",
                "code_sarawak": "(382)-122-5003"
            },
            {   
                "id": 10243,
                "mukim": "Glen Curtis",
                "district": "glen.curtis11@example.com",
                "id": "760105-06-2520",
                "state": "New + Old IC",
                "code_sarawak": "(477)-981-4948"
            },
            {
                "id": 10248,
                "mukim": "Beverly Gonzalez",
                "district": "beverly.gonzalez54@example.com",
                "id": "760105-06-2330",
                "state": "New + Old IC",
                "code_sarawak": "(832)-255-5161"
            },
            {
                "id": 10253,
                "mukim": "Yvonne Chavez",
                "district": "yvonne.chavez@example.com",
                "id": "760105-32-2540",
                "state": "New + Old IC",
                "code_sarawak": "(477)-446-3715"
            },
            {
                "id": 10234,
                "mukim": "Melinda Mitchelle",
                "district": "melinda@example.com",
                "id": "778805-06-2540",
                "state": "New + Old IC",
                "code_sarawak": "(813)-716-4996"
                
            },
            {
                "id": 10239,
                "mukim": "Shannon Bradley",
                "district": "shannon.bradley42@example.com",
                "id": "2120105-06-2540",
                "state": "New + Old IC",
                "code_sarawak": "(774)-291-9928"
            },
            {
                "id": 10244,
                "mukim": "Virgil Kim",
                "district": "virgil.kim81@example.com",
                "id": "760005-06-2540",
                "state": "New + Old IC",
                "code_sarawak": "(219)-181-7898"
            },
            {
                "id": 10249,
                "mukim": "Letitia Robertson",
                "district": "letitia.rober@example.com",
                "id": "540105-06-2540",
                "code_sarawak": "(647)-209-4589"
            },
            {
                "id": 10237,
                "mukim": "Claude King",
                "district": "claude.king22@example.com",
                "id": "98105-06-2540",
                "state": "New + Old IC",
                "code_sarawak": "(657)-988-8701"
            },
            {
                "id": 10242,
                "mukim": "Roland Craig",
                "district": "roland.craig47@example.com",
                "id": "767105-06-2540",
                "state": "New + Old IC",
                "code_sarawak": "(932)-935-9471"
            },
            {
                "id": 10247,
                "mukim": "Colleen Parker",
                "district": "colleen.parker38@example.com",
                "id": "762225-06-2540",
                "state": "New + Old IC",
                "code_sarawak": "(857)-459-2792"
            },
            {
                "id": 10252,
                "mukim": "Leah Jensen",
                "district": "leah.jensen27@example.com",
                "id": "76087-06-2540",
                "state": "New + Old IC",
                "code_sarawak": "(861)-275-4686"
            },
            {
                "id": 10236,
                "mukim": "Harold Martinez",
                "district": "martinez67@example.com",
                "id": "960105-96-2520",
                "state": "New + Old IC",
                "code_sarawak": "(836)-634-9133"
            },
            {
                "id": 10241,
                "mukim": "Keith Lowe",
                "district": "keith.lowe96@example.com",
                "id": "760105-06-2550",
                "state": "New + Old IC",
                "code_sarawak": "(778)-787-3100"
            },
            {
                "id": 10246,
                "mukim": "Charles Walker",
                "district": "charles.walker90@example.com",
                "id": "760105-26-2540",
                "state": "New + Old IC",
                "code_sarawak": "(486)-440-4716"
            },
            {
                "id": 10251,
                "mukim": "Lillie Curtis",
                "district": "lillie.curtis12@example.com",
                "id": "760605-06-2540",
                "state": "New + Old IC",
                "code_sarawak": "(342)-510-2258"
            },
            {
                "id": 10235,
                "mukim": "Genesis Reynolds",
                "district": "genesis@example.com",
                "id": "760105-07-2540",
                "state": "New + Old IC",
                "code_sarawak": "(339)-375-1858"
            },
            {
                "id": 10240,
                "mukim": "Oscar Palmer",
                "district": "oscar.palmer24@example.com",
                "id": "760105-76-2540",
                "state": "New + Old IC",
                "code_sarawak": "(544)-270-9912"
            },
            {
                "id": 10245,
                "mukim": "Lena Bishop",
                "district": "Lena Bishop",
                "id": "550105-06-2540",
                "state": "New + Old IC",
                "code_sarawak": "(177)-521-1556"
            },
            {
                "id": 10250,
                "mukim": "Kent Nguyen",
                "district": "kent.nguyen34@example.com",
                "id": "460105-06-2540",
                "state": "New + Old IC",
                "code_sarawak": "(506)-533-6801"
            }
        ];

        service.mukims = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getList() {
            var deferred = $q.defer();

            if(service.mukims)
                deferred.resolve(service.mukims);
            else
                $timeout(function(){
                    deferred.resolve(fakedata);
                    service.mukims = fakedata;                
                }, 100);
            return deferred.promise;
        }  

        function getItem(id) {

            var deferred = $q.defer();

            $timeout(function(){
                if (!service.mukims) {
                    service.mukims = fakedata;
                }
                var item = service.mukims.filter(function(c){
                    return c.id == id;
                });
                if (item.length == 1)
                    deferred.resolve(item[0]);
                else
                    deferred.resolve(new Error('No Item with the id'));
                
                
            }, 100);

            return deferred.promise;
        }

        function save(mukim) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.mukims.map(function(c) {return c.id; }).indexOf(mukim.id);
                if(idx != -1) {
                    service.mukims[idx] = mukim;
                    deferred.resolve(mukim);
                } else {
                    service.mukims.push(mukim);
                }
                //deferred.reject(new Error('dd'));
            }, 100);

            return deferred.promise;
        }

        function delete_(mukim) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.mukims.map(function(c) {return c.id; }).indexOf(mukim.id);
                if(idx != -1) {
                    service.mukims.splice(idx, 1);
                    deferred.resolve(mukim);
                } else {
                    deferred.reject(new Error('There is no such mukim'));
                }
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
