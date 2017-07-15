materialAdmin
    // =========================================================================
    // Search Filter Data
    // =========================================================================

    .service('searchFilterService', ['$http', function($http){
        this.getFilter = function() {
            return $http.get('http://43.252.215.81/denningwcf/v1/generalSearch/category')
            .then(function(resp){
                return resp.data;
            })
        }
    }])

    // =========================================================================
    // Legal Firm List Data
    // =========================================================================

    .service('legalFirmListService', ['$http', function($http){
        this.getList = function() {
            return [{
                "IDNo": null,
                "IDType": 0,
                "address": {
                    "city": "Petaling Jaya",
                    "country": "",
                    "fullAddress": "No. 59B, 1st Floor & 2nd Floor, Jalan SS 6/10, Kelana Jaya47301 Petaling Jaya, Selangor",
                    "line1": "No. 59B, 1st Floor & 2nd Floor, ",
                    "line2": "Jalan SS 6/10, Kelana Jaya",
                    "line3": "",
                    "postcode": "47301",
                    "state": "Selangor"
                },
                "code": 4293,
                "emailAddress": "absidek@tm.net.my",
                "name": "A B Sidek & Co.",
                "phoneFax": "(03)7805-2924",
                "phoneHome": "(03)7805-2920",
                "phoneMobile": null,
                "phoneOffice": "(03)7805-2921",
                "title": null,
                "webSite": " "
            },
            {
                "IDNo": null,
                "IDType": 0,
                "address": {
                    "city": "Kuala Lumpur",
                    "country": "",
                    "fullAddress": "No. Gc, Ground FloorRuby Tower, Og Heights56, Jalan Awan China58200 Kuala Lumpur",
                    "line1": "No. Gc, Ground Floor",
                    "line2": "Ruby Tower, Og Heights",
                    "line3": "56, Jalan Awan China",
                    "postcode": "58200",
                    "state": ""
                },
                "code": 5385,
                "emailAddress": "abteoh@pd.jaring.my",
                "name": "A B Teoh & Shariza",
                "phoneFax": "(03)7782-3966",
                "phoneHome": "(03)7781-5816",
                "phoneMobile": null,
                "phoneOffice": null,
                "title": null,
                "webSite": " "
            },
            {
                "IDNo": null,
                "IDType": 0,
                "address": {
                    "city": "Subang Jaya",
                    "country": "",
                    "fullAddress": "No. 22, Jalan Usj 9/3bUep Subang Jaya47620 Subang Jaya, Selangor",
                    "line1": "No. 22, Jalan Usj 9/3b",
                    "line2": "Uep Subang Jaya",
                    "line3": "",
                    "postcode": "47620",
                    "state": "Selangor"
                },
                "code": 923,
                "emailAddress": " ",
                "name": "A D Rajah",
                "phoneFax": "(03)5638-9957",
                "phoneHome": "(03)5638-8744",
                "phoneMobile": null,
                "phoneOffice": null,
                "title": null,
                "webSite": " "
            },
            {
                "IDNo": null,
                "IDType": 0,
                "address": {
                    "city": "Klang",
                    "country": "",
                    "fullAddress": "No. 14-B, Jalan Istana41000 Klang, Selangor",
                    "line1": "No. 14-B, Jalan Istana",
                    "line2": "",
                    "line3": "",
                    "postcode": "41000",
                    "state": "Selangor"
                },
                "code": 924,
                "emailAddress": " ",
                "name": "A D Rajah",
                "phoneFax": "(03)3373-8525",
                "phoneHome": "(03)3371-8785",
                "phoneMobile": null,
                "phoneOffice": "(03)3372-8810",
                "title": null,
                "webSite": " "
            },
            {
                "IDNo": null,
                "IDType": 0,
                "address": {
                    "city": "Ipoh",
                    "country": "",
                    "fullAddress": "No.73 B, 1st FloorJalan Sultan Yusuff,30000 Ipoh, Perak",
                    "line1": "No.73 B, 1st Floor",
                    "line2": "Jalan Sultan Yusuff,",
                    "line3": "",
                    "postcode": "30000",
                    "state": "Perak"
                },
                "code": 2576,
                "emailAddress": " ",
                "name": "A Damadram Mariah & Associates(closed)",
                "phoneFax": "(05)2410-259",
                "phoneHome": "(05)2410-258",
                "phoneMobile": null,
                "phoneOffice": null,
                "title": null,
                "webSite": " "
            }];
            // return $http.get('http://denningsoft.dlinkddns.com/denningwcf/v1/Solicitor', {headers: {'webuser-sessionid':'{334E910C-CC68-4784-9047-0F23D37C9CF9}'}})
            // .then(function(resp){
            //     return resp.data;
            // })
        }
    }])
    // =========================================================================
    // Header Messages and Notifications list Data
    // =========================================================================

    .service('messageService', ['$resource', function($resource){
        this.getMessage = function(img, user, text) {
            var gmList = $resource("data/messages-notifications.json");
            
            return gmList.get({
                img: img,
                user: user,
                text: text
            });
        }
    }])
    

    // =========================================================================
    // Best Selling Widget Data (Home Page)
    // =========================================================================

    .service('bestsellingService', ['$resource', function($resource){
        this.getBestselling = function(img, name, range) {
            var gbList = $resource("data/best-selling.json");
            
            return gbList.get({
                img: img,
                name: name,
                range: range,
            });
        }
    }])

    
    // =========================================================================
    // Todo List Widget Data
    // =========================================================================

    .service('todoService', ['$resource', function($resource){
        this.getTodo = function(todo) {
            var todoList = $resource("data/todo.json");
            
            return todoList.get({
                todo: todo
            });
        }
    }])


    // =========================================================================
    // Recent Items Widget Data
    // =========================================================================
    
    .service('recentitemService', ['$resource', function($resource){
        this.getRecentitem = function(id, name, price) {
            var recentitemList = $resource("data/recent-items.json");
            
            return recentitemList.get ({
                id: id,
                name: name,
                price: price
            })
        }
    }])


    // =========================================================================
    // Recent Posts Widget Data
    // =========================================================================
    
    .service('recentpostService', ['$resource', function($resource){
        this.getRecentpost = function(img, user, text) {
            var recentpostList = $resource("data/messages-notifications.json");
            
            return recentpostList.get ({
                img: img,
                user: user,
                text: text
            })
        }
    }])
    
    // =========================================================================
    // Data Table
    // =========================================================================
    
    .service('tableService', [function(){
        this.data = [
            {
                "id": 10238,
                "name": "Marc Barnes",
                "email": "marc.barnes54@example.com",
                "username": "MarcBarnes",
                "contact": "(382)-122-5003"
            },
            {   
                "id": 10243,
                "name": "Glen Curtis",
                "email": "glen.curtis11@example.com",
                "username": "GlenCurtis",
                "contact": "(477)-981-4948"
            },
            {
                "id": 10248,
                "name": "Beverly Gonzalez",
                "email": "beverly.gonzalez54@example.com",
                "username": "BeverlyGonzalez",
                "contact": "(832)-255-5161"
            },
            {
                "id": 10253,
                "name": "Yvonne Chavez",
                "email": "yvonne.chavez@example.com",
                "username": "YvonneChavez",
                "contact": "(477)-446-3715"
            },
            {
                "id": 10234,
                "name": "Melinda Mitchelle",
                "email": "melinda@example.com",
                "username": "MelindaMitchelle",
                "contact": "(813)-716-4996"
                
            },
            {
                "id": 10239,
                "name": "Shannon Bradley",
                "email": "shannon.bradley42@example.com",
                "username": "ShannonBradley",
                "contact": "(774)-291-9928"
            },
            {
                "id": 10244,
                "name": "Virgil Kim",
                "email": "virgil.kim81@example.com",
                "username": "VirgilKim",
                "contact": "(219)-181-7898"
            },
            {
                "id": 10249,
                "name": "Letitia Robertson",
                "email": "letitia.rober@example.com",
                "username": "Letitia Robertson",
                "contact": "(647)-209-4589"
            },
            {
                "id": 10237,
                "name": "Claude King",
                "email": "claude.king22@example.com",
                "username": "ClaudeKing",
                "contact": "(657)-988-8701"
            },
            {
                "id": 10242,
                "name": "Roland Craig",
                "email": "roland.craig47@example.com",
                "username": "RolandCraig",
                "contact": "(932)-935-9471"
            },
            {
                "id": 10247,
                "name": "Colleen Parker",
                "email": "colleen.parker38@example.com",
                "username": "ColleenParker",
                "contact": "(857)-459-2792"
            },
            {
                "id": 10252,
                "name": "Leah Jensen",
                "email": "leah.jensen27@example.com",
                "username": "LeahJensen",
                "contact": "(861)-275-4686"
            },
            {
                "id": 10236,
                "name": "Harold Martinez",
                "email": "martinez67@example.com",
                "username": "HaroldMartinez",
                "contact": "(836)-634-9133"
            },
            {
                "id": 10241,
                "name": "Keith Lowe",
                "email": "keith.lowe96@example.com",
                "username": "KeithLowe",
                "contact": "(778)-787-3100"
            },
            {
                "id": 10246,
                "name": "Charles Walker",
                "email": "charles.walker90@example.com",
                "username": "CharlesWalker",
                "contact": "(486)-440-4716"
            },
            {
                "id": 10251,
                "name": "Lillie Curtis",
                "email": "lillie.curtis12@example.com",
                "username": "LillieCurtis",
                "contact": "(342)-510-2258"
            },
            {
                "id": 10235,
                "name": "Genesis Reynolds",
                "email": "genesis@example.com",
                "username": "GenesisReynolds",
                "contact": "(339)-375-1858"
            },
            {
                "id": 10240,
                "name": "Oscar Palmer",
                "email": "oscar.palmer24@example.com",
                "username": "OscarPalmer",
                "contact": "(544)-270-9912"
            },
            {
                "id": 10245,
                "name": "Lena Bishop",
                "email": "Lena Bishop",
                "username": "LenaBishop",
                "contact": "(177)-521-1556"
            },
            {
                "id": 10250,
                "name": "Kent Nguyen",
                "email": "kent.nguyen34@example.com",
                "username": "KentNguyen",
                "contact": "(506)-533-6801"
            }
        ];
    }])


    // =========================================================================
    // Malihu Scroll - Custom Scroll bars
    // =========================================================================
    .service('scrollService', function() {
        var ss = {};
        ss.malihuScroll = function scrollBar(selector, theme, mousewheelaxis) {
            $(selector).mCustomScrollbar({
                theme: theme,
                scrollInertia: 100,
                axis:'yx',
                mouseWheel: {
                    enable: true,
                    axis: mousewheelaxis,
                    preventDefault: true
                }
            });
        }
        
        return ss;
    })


    //==============================================
    // BOOTSTRAP GROWL
    //==============================================

    .service('growlService', function(){
        var gs = {};
        gs.growl = function(message, type) {
            $.growl({
                message: message
            },{
                type: type,
                allow_dismiss: false,
                label: 'Cancel',
                className: 'btn-xs btn-inverse',
                placement: {
                    from: 'top',
                    align: 'right'
                },
                delay: 2500,
                animate: {
                        enter: 'animated bounceIn',
                        exit: 'animated bounceOut'
                },
                offset: {
                    x: 20,
                    y: 85
                }
            });
        }
        
        return gs;
    })
