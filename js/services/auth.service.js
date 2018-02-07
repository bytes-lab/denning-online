angular.module('materialAdmin').factory('Auth', ['$http', '$window', '$timeout', '$q', function($http, $window, $timeout, $q) {
    var service = {};
    service.rememberMe = false;
    service.demoPriority = {
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
        }
    };

    service.login = function(email, pass) {
        return $http({
            method: 'POST',
            url: 'http://43.252.215.163:8313/denningapi/v1/signIn',
            headers: {
                "Content-Type": "application/json",
                "webuser-sessionid": "{334E910C-CC68-4784-9047-0F23D37C9CF9}"
            },
            data: {
                "ipWAN": "121.196.213.102",
                "ipLAN": "192.168.0.101",
                "OS": "Windows 10",
                "device": "laptop",
                "deviceName": "laptop01",
                "MAC": "44:78:3e:94:a0:e5",
                "email": email, 
                "password": pass
            }
        }).then(function(response) {
            return response.data;
        }).then(function(info) {
            info.priority = service.demoPriority;
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