materialAdmin
    // =========================================================================
    // occupations
    // =========================================================================
    
    .service('occupationService', ['$q', '$timeout',function($q, $timeout){
        var service = {};
        var fakedata = [
            {
                "id": 10238,
                "title_eng": "Marc Barnes",
                "title_mal": "marc.barnes54@example.com",
                "id": "760105-06-2540",
                "phone3": "(382)-122-5003"
            },
            {   
                "id": 10243,
                "title_eng": "Glen Curtis",
                "title_mal": "glen.curtis11@example.com",
                "id": "760105-06-2520",
                "id_type": "New + Old IC",
                "phone3": "(477)-981-4948"
            },
            {
                "id": 10248,
                "title_eng": "Beverly Gonzalez",
                "title_mal": "beverly.gonzalez54@example.com",
                "id": "760105-06-2330",
                "id_type": "New + Old IC",
                "phone3": "(832)-255-5161"
            },
            {
                "id": 10253,
                "title_eng": "Yvonne Chavez",
                "title_mal": "yvonne.chavez@example.com",
                "id": "760105-32-2540",
                "id_type": "New + Old IC",
                "phone3": "(477)-446-3715"
            },
            {
                "id": 10234,
                "title_eng": "Melinda Mitchelle",
                "title_mal": "melinda@example.com",
                "id": "778805-06-2540",
                "id_type": "New + Old IC",
                "phone3": "(813)-716-4996"
                
            },
            {
                "id": 10239,
                "title_eng": "Shannon Bradley",
                "title_mal": "shannon.bradley42@example.com",
                "id": "2120105-06-2540",
                "id_type": "New + Old IC",
                "phone3": "(774)-291-9928"
            },
            {
                "id": 10244,
                "title_eng": "Virgil Kim",
                "title_mal": "virgil.kim81@example.com",
                "id": "760005-06-2540",
                "id_type": "New + Old IC",
                "phone3": "(219)-181-7898"
            },
            {
                "id": 10249,
                "title_eng": "Letitia Robertson",
                "title_mal": "letitia.rober@example.com",
                "id": "540105-06-2540",
                "phone3": "(647)-209-4589"
            },
            {
                "id": 10237,
                "title_eng": "Claude King",
                "title_mal": "claude.king22@example.com",
                "id": "98105-06-2540",
                "id_type": "New + Old IC",
                "phone3": "(657)-988-8701"
            },
            {
                "id": 10242,
                "title_eng": "Roland Craig",
                "title_mal": "roland.craig47@example.com",
                "id": "767105-06-2540",
                "id_type": "New + Old IC",
                "phone3": "(932)-935-9471"
            },
            {
                "id": 10247,
                "title_eng": "Colleen Parker",
                "title_mal": "colleen.parker38@example.com",
                "id": "762225-06-2540",
                "id_type": "New + Old IC",
                "phone3": "(857)-459-2792"
            },
            {
                "id": 10252,
                "title_eng": "Leah Jensen",
                "title_mal": "leah.jensen27@example.com",
                "id": "76087-06-2540",
                "id_type": "New + Old IC",
                "phone3": "(861)-275-4686"
            },
            {
                "id": 10236,
                "title_eng": "Harold Martinez",
                "title_mal": "martinez67@example.com",
                "id": "960105-96-2520",
                "id_type": "New + Old IC",
                "phone3": "(836)-634-9133"
            },
            {
                "id": 10241,
                "title_eng": "Keith Lowe",
                "title_mal": "keith.lowe96@example.com",
                "id": "760105-06-2550",
                "id_type": "New + Old IC",
                "phone3": "(778)-787-3100"
            },
            {
                "id": 10246,
                "title_eng": "Charles Walker",
                "title_mal": "charles.walker90@example.com",
                "id": "760105-26-2540",
                "id_type": "New + Old IC",
                "phone3": "(486)-440-4716"
            },
            {
                "id": 10251,
                "title_eng": "Lillie Curtis",
                "title_mal": "lillie.curtis12@example.com",
                "id": "760605-06-2540",
                "id_type": "New + Old IC",
                "phone3": "(342)-510-2258"
            },
            {
                "id": 10235,
                "title_eng": "Genesis Reynolds",
                "title_mal": "genesis@example.com",
                "id": "760105-07-2540",
                "id_type": "New + Old IC",
                "phone3": "(339)-375-1858"
            }
        ];

        service.occupations = null;
        service.getList = getList;
        service.getItem = getItem;
        service.save = save;
        service.delete = delete_;

        function getList() {
            var deferred = $q.defer();

            if(service.occupations)
                deferred.resolve(service.occupations);
            else
                $timeout(function(){
                    deferred.resolve(fakedata);
                    service.occupations = fakedata;                
                }, 100);
            return deferred.promise;
        }  

        function getItem(id) {

            var deferred = $q.defer();

            $timeout(function(){
                if (!service.occupations) {
                    service.occupations = fakedata;
                }
                var item = service.occupations.filter(function(c){
                    return c.id == id;
                });
                if (item.length == 1)
                    deferred.resolve(item[0]);
                else
                    deferred.resolve(new Error('No Item with the id'));
                
                
            }, 100);

            return deferred.promise;
        }

        function save(occupation) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.occupations.map(function(c) {return c.id; }).indexOf(occupation.id);
                if(idx != -1) {
                    service.occupations[idx] = occupation;
                    deferred.resolve(occupation);
                } else {
                    service.occupations.push(occupation);
                }
                //defered.reject(new Error('dd'));
            }, 100);

            return deferred.promise;
        }

        function delete_(occupation) {
            var deferred = $q.defer();

            $timeout(function(){
                var idx = service.occupations.map(function(c) {return c.id; }).indexOf(occupation.id);
                if(idx != -1) {
                    service.occupations.splice(idx, 1);
                    deferred.resolve(occupation);
                } else {
                    defered.reject(new Error('There is no such occupation'));
                }
            }, 100);

            return deferred.promise;
        }
        return service;
        
    }])
