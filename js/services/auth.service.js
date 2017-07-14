angular.module('materialAdmin').factory('Auth', ['$http', '$window', '$timeout', '$q', function($http, $window, $timeout, $q) {
    var service = {};
    service.rememberMe = false;

    service.login = function(email, pass) {
        var deferred = $q.defer();

        $http({
            method: 'POST',
            url: 'http://denningsoft.dlinkddns.com/denningwcf/v1/signIn',
            data: JSON.stringify({email: email, password: pass}),
            headers: {
                "Accept": "application/json",
                // "Content-Type": "application/json",
                // "X-Login-Ajax-call": 'true',
                // "webuser-sessionid": "{334E910C-CC68-4784-9047-0F23D37C9CF9}"
            }
        }).then(function(response) {
            if (response.data == 'ok') {
                // success
            } else {
                // failed
            }
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
        return info && ((info.logintimestamp + info.expTimeInSec) > new Date().getTime() / 1000);
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