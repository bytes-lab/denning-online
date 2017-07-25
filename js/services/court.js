materialAdmin
    // =========================================================================
    // Contacts
    // =========================================================================
    
    .service('courtService', ['$q', '$timeout',function($q, $timeout){
        var service = {};
        var fakedata = [
            {
                "id": 10238,
                "type_eng": "Marc Barnes",
                "type_mal": "marc.barnes54@example.com",
                "place": "760105-06-2540",
                "phone1": "(382)-122-5003"
            },
            {   
                "id": 10243,
                "type_eng": "Glen Curtis",
                "type_mal": "glen.curtis11@example.com",
                "place": "760105-06-2520",
                "id_type": "New + Old IC",
                "phone1": "(477)-981-4948"
            },
            {
                "id": 10248,
                "type_eng": "Beverly Gonzalez",
                "type_mal": "beverly.gonzalez54@example.com",
                "place": "760105-06-2330",
                "id_type": "New + Old IC",
                "phone1": "(832)-255-5161"
            },
            {
                "id": 10253,
                "type_eng": "Yvonne Chavez",
                "type_mal": "yvonne.chavez@example.com",
                "place": "760105-32-2540",
                "id_type": "New + Old IC",
                "phone1": "(477)-446-3715"
            },
            {
                "id": 10234,
                "type_eng": "Melinda Mitchelle",
                "type_mal": "melinda@example.com",
                "place": "778805-06-2540",
                "id_type": "New + Old IC",
                "phone1": "(813)-716-4996"
                
            },
            {
                "id": 10239,
                "type_eng": "Shannon Bradley",
                "type_mal": "shannon.bradley42@example.com",
                "place": "2120105-06-2540",
                "id_type": "New + Old IC",
                "phone1": "(774)-291-9928"
            },
            {
                "id": 10244,
                "type_eng": "Virgil Kim",
                "type_mal": "virgil.kim81@example.com",
                "place": "760005-06-2540",
                "id_type": "New + Old IC",
                "phone1": "(219)-181-7898"
            },
            {
                "id": 10249,
                "type_eng": "Letitia Robertson",
                "type_mal": "letitia.rober@example.com",
                "place": "540105-06-2540",
                "phone1": "(647)-209-4589"
            },
            {
                "id": 10237,
                "type_eng": "Claude King",
                "type_mal": "claude.king22@example.com",
                "place": "98105-06-2540",
                "id_type": "New + Old IC",
                "phone1": "(657)-988-8701"
            },
            {
                "id": 10242,
                "type_eng": "Roland Craig",
                "type_mal": "roland.craig47@example.com",
                "place": "767105-06-2540",
                "id_type": "New + Old IC",
                "phone1": "(932)-935-9471"
            },
            {
                "id": 10247,
                "type_eng": "Colleen Parker",
                "type_mal": "colleen.parker38@example.com",
                "place": "762225-06-2540",
                "id_type": "New + Old IC",
                "phone1": "(857)-459-2792"
            },
            {
                "id": 10252,
                "type_eng": "Leah Jensen",
                "type_mal": "leah.jensen27@example.com",
                "place": "76087-06-2540",
                "id_type": "New + Old IC",
                "phone1": "(861)-275-4686"
            },
            {
                "id": 10236,
                "type_eng": "Harold Martinez",
                "type_mal": "martinez67@example.com",
                "place": "960105-96-2520",
                "id_type": "New + Old IC",
                "phone1": "(836)-634-9133"
            },
            {
                "id": 10241,
                "type_eng": "Keith Lowe",
                "type_mal": "keith.lowe96@example.com",
                "place": "760105-06-2550",
                "id_type": "New + Old IC",
                "phone1": "(778)-787-3100"
            },
            {
                "id": 10246,
                "type_eng": "Charles Walker",
                "type_mal": "charles.walker90@example.com",
                "place": "760105-26-2540",
                "id_type": "New + Old IC",
                "phone1": "(486)-440-4716"
            },
            {
                "id": 10251,
                "type_eng": "Lillie Curtis",
                "type_mal": "lillie.curtis12@example.com",
                "place": "760605-06-2540",
                "id_type": "New + Old IC",
                "phone1": "(342)-510-2258"
            },
            {
                "id": 10235,
                "type_eng": "Genesis Reynolds",
                "type_mal": "genesis@example.com",
                "place": "760105-07-2540",
                "id_type": "New + Old IC",
                "phone1": "(339)-375-1858"
            },
            {
                "id": 10240,
                "type_eng": "Oscar Palmer",
                "type_mal": "oscar.palmer24@example.com",
                "place": "760105-76-2540",
                "id_type": "New + Old IC",
                "phone1": "(544)-270-9912"
            },
            {
                "id": 10245,
                "type_eng": "Lena Bishop",
                "type_mal": "Lena Bishop",
                "place": "550105-06-2540",
                "id_type": "New + Old IC",
                "phone1": "(177)-521-1556"
            },
            {
                "id": 10250,
                "type_eng": "Kent Nguyen",
                "type_mal": "kent.nguyen34@example.com",
                "place": "460105-06-2540",
                "id_type": "New + Old IC",
                "phone1": "(506)-533-6801"
            }
        ];

        service.courts = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getList() {
            var deferred = $q.defer();

            if(service.courts)
                deferred.resolve(service.courts);
            else
                $timeout(function(){
                    deferred.resolve(fakedata);
                    service.courts = fakedata;                
                }, 100);
            return deferred.promise;
        }  

        function getItem(id) {

            var deferred = $q.defer();

            $timeout(function(){
                if (!service.courts) {
                    service.courts = fakedata;
                }
                var item = service.courts.filter(function(c){
                    return c.id == id;
                });
                if (item.length == 1)
                    deferred.resolve(item[0]);
                else
                    deferred.resolve(new Error('No Item with the id'));
                
                
            }, 100);

            return deferred.promise;
        }

        function save(court) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.courts.map(function(c) {return c.id; }).indexOf(court.id);
                if(idx != -1) {
                    service.courts[idx] = court;
                    deferred.resolve(court);
                } else {
                    service.courts.push(court);
                }
                //defered.reject(new Error('dd'));
            }, 100);

            return deferred.promise;
        }

        function delete_(court) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.courts.map(function(c) {return c.id; }).indexOf(court.id);
                if(idx != -1) {
                    service.courts.splice(idx, 1);
                    deferred.resolve(court);
                } else {
                    defered.reject(new Error('There is no such court'));
                }
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
