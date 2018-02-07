angular.module('materialAdmin').factory('Auth', ['$http', '$window', '$timeout', '$q', function($http, $window, $timeout, $q) {
    var service = {};
    service.rememberMe = false;
    service.fakeUser = {
        "catBussiness": [],
        "catDenning": [
            {
                "APIServer": "http://43.252.215.81/",
                "LawFirm": {
                    "IDNo": "Advocates & Solicitors",
                    "IDType": 0,
                    "address": {
                        "city": "Kuala Lumpur",
                        "country": "",
                        "fullAddress": "Suite A, 300-0-5, OBD Garden Tower Condo, Jalan Desa Utama, Taman Desa, 58100 Kuala Lumpur, Wilayah Persekutuan",
                        "line1": "Suite A, 300-0-5, ",
                        "line2": "OBD Garden Tower Condo, ",
                        "line3": "Jalan Desa Utama, Taman Desa, ",
                        "postcode": "58100",
                        "state": "Wilayah Persekutuan"
                    },
                    "code": 8005,
                    "emailAddress": "ho.mogan@hotmail.com",
                    "name": "Ho Mogan & Nor`Aini",
                    "phoneFax": "(03)7982-3392",
                    "phoneHome": "(03)7982-3192",
                    "phoneMobile": "",
                    "phoneOffice": "(03)7982-9350",
                    "title": "Messr.",
                    "webSite": null
                },
                "category": "denning",
                "errorMsg": "",
                "isActive": true,
                "nextPaymentDate": "/Date(1488297600000+0800)/"
            },
            {
                "APIServer": "http://43.252.215.163/",
                "LawFirm": {
                    "IDNo": null,
                    "IDType": 0,
                    "address": {
                        "city": "K. Terengganu",
                        "country": "",
                        "fullAddress": "No. 221-D, 1st FloorJalan Sultan Zainal Abidin20000 K. Terengganu, Terengganu",
                        "line1": "No. 221-D, 1st Floor",
                        "line2": "Jalan Sultan Zainal Abidin",
                        "line3": "",
                        "postcode": "20000",
                        "state": "Terengganu"
                    },
                    "code": 6,
                    "emailAddress": " ",
                    "name": "Denning Test Data",
                    "phoneFax": "(00)9631-633",
                    "phoneHome": "(00)9626-622",
                    "phoneMobile": null,
                    "phoneOffice": "(00)9622-169",
                    "title": null,
                    "webSite": " "
                },
                "category": "denning",
                "errorMsg": "",
                "isActive": true,
                "nextPaymentDate": "/Date(1488297600000+0800)/"
            }
        ],
        "catPersonal": [
            {
                "APIServer": "http://43.252.215.81/",
                "LawFirm": {
                    "IDNo": "Advocates & Solicitors",
                    "IDType": 0,
                    "address": {
                        "city": "Kuala Lumpur",
                        "country": "",
                        "fullAddress": "Suite A, 300-0-5, OBD Garden Tower Condo, Jalan Desa Utama, Taman Desa, 58100 Kuala Lumpur, Wilayah Persekutuan",
                        "line1": "Suite A, 300-0-5, ",
                        "line2": "OBD Garden Tower Condo, ",
                        "line3": "Jalan Desa Utama, Taman Desa, ",
                        "postcode": "58100",
                        "state": "Wilayah Persekutuan"
                    },
                    "code": "68005",
                    "emailAddress": "ho.mogan@hotmail.com",
                    "name": "Ho Mogan & Nor`Aini",
                    "phoneFax": "(03)7982-3392",
                    "phoneHome": "(03)7982-3192",
                    "phoneMobile": "",
                    "phoneOffice": "(03)7982-9350",
                    "title": "Messr.",
                    "webSite": null
                },
                "category": "Personal",
                "errorMsg": "",
                "isActive": true,
                "nextPaymentDate": "/Date(1488297600000+0800)/"
            }
        ],
        "email": "jingpiow@hotmail.com",
        "hpNumber": "+60122868758",
        "lockMinute": 0,
        "name": "jingpiow",
        "sessionID": "9e5e16a5-c632-498c-accd-0d34e8ccfe3c",
        "status": "success - proceed to Home Page.",
        "statusCode": 200,
        "userType": "denning",
        "priority": {
            "matter": {
                "list": true,
                "create": false,
                "read": true,
                "update": false,
                "delete": true
            },
            "contact": {
                "list": true,
                "create": true,
                "read": true,
                "update": true,
                "delete": true
            },
            "legalfirm": {
                "list": true,
                "create": true,
                "read": true,
                "update": true,
                "delete": true
            },
            "property": {
                "list": true,
                "create": true,
                "read": true,
                "update": true,
                "delete": true
            },
            "quotation": {
                "list": true,
                "create": true,
                "read": true,
                "update": false,
                "delete": true
            },
            "courtdiary": {
                "list": true,
                "create": true,
                "read": true,
                "update": true,
                "delete": true
            },
            "spaclitem": {
                "list": true,
                "create": true,
                "read": true,
                "update": true,
                "delete": true
            },
            "spapresetcl": {
                "list": true,
                "create": true,
                "read": true,
                "update": true,
                "delete": true
            },
            "litigationclitem": {
                "list": true,
                "create": true,
                "read": true,
                "update": true,
                "delete": true
            },
            "litigationpresetcl": {
                "list": true,
                "create": true,
                "read": true,
                "update": true,
                "delete": true
            },
        }
    }
    service.login = function(email, pass) {
        var deferred = $q.defer();
        // $timeout(function(){
        //     if ( email == 'demo@demo.com' && pass == "demo") {
        //         deferred.resolve({data: service.fakeUser});
        //     } else {
        //         deferred.reject({
        //             message: 'Your credential is not correct. Please try again.'
        //         });
        //     }
        // }, 1000)
        return $http({
            method: 'POST',
            url: 'http://43.252.215.163:8313/denningapi/v1/signIn',
            data: JSON.stringify({email: email, password: pass}),
            headers: {
                "Content-Type": "application/json",
                "webuser-sessionid": "{334E910C-CC68-4784-9047-0F23D37C9CF9}"
            }
        }).then(function(response) {
            return response.data;
        }).then(function(info) {
            service.setUserInfo(info);
            return info;
        });

        // $http.post('http://denningsoft.dlinkddns.com/denningwcf/v1/signIn', 
        //     {
        //         email: email, 
        //         password: pass,
        //         // "email": "jingpiow@hotmail.com",
        //         // "password":"123456",
        //         "ipWAN": "121.196.213.102",
        //         "ipLAN": "192.168.0.101",
        //         "OS": "Windows 10",
        //         "device": "laptop",
        //         "deviceName": "laptop01",
        //         "MAC": "44:78:3e:94:a0:e5"
        //     })
        //     .then(function(response) {
        //         if (response.data.result === 0) {
                
        //             return response.data;
        //         } else {
        //             throw response.data;
        //         }
        //     })
        //     .then(function(info) {
        //         service.setUserInfo(info);
        //         return info;
        //     })
        //     .catch(function(error){
        //         console.log(error);
        //     })

        return deferred.promise
        .then(function(response) {
            // response.data.logintimestamp = new Date().getTime() / 1000;
            // response.data.expTimeInSec = 1000000;
            // response.data.rememberMe = service.rememberMe;
            return response.data;
            
        })
        .then(function(info) {
            service.setUserInfo(info);
            return info;
        });
    };

    service.setUserInfo = function(info) {
        if ($window.localStorage) {
            $window.localStorage.setItem('userInfo', angular.toJson(info));
        }
        service.info = info;
    };

    service.getUserInfo = function() {
        if (!service.info && $window.localStorage) {
            service.info = angular.fromJson($window.localStorage.getItem('userInfo'));
        }
        return service.info;
    };

    service.isAuthenticated = function() {
        var info = this.getUserInfo();
        // return info && ((info.logintimestamp + info.expTimeInSec) > new Date().getTime() / 1000);
        return info && info.sessionID;
    };


    service.restartSession = function() {
        var info = this.getUserInfo();
        info.logintimestamp = new Date().getTime() / 1000;
    };

    service.getSessionId = function() {
        var info = this.getUserInfo();
        return info && info.sessionId;
    };
    service.logout = function() {
        service.setUserInfo({});
    };
    return service;

}]);