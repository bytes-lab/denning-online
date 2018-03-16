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
    service.headers = {
        "Content-Type": "application/json",
        "webuser-sessionid": "{334E910C-CC68-4784-9047-0F23D37C9CF9}",
        "webuser-id": "online@denning.com.my"
    };

    new Fingerprint2().get(function(result, components) {
        service.preData = {
            "ipWAN": "121.196.213.102",
            "ipLAN": "192.168.0.101",
            "OS": "Windows 10",
            "device": "laptop",
            "deviceName": "laptop01",
            "MAC": result
        };
    });
    
    service.login = function(email, pass) {
        data = angular.copy(service.preData);
        data.email = email;
        data.password = pass;

        return $http({
            method: 'POST',
            url: 'http://43.252.215.163:8313/denningapi/v1/signIn',
            headers: service.headers,
            data: data
        }).then(function(response) {
            service.userInfo = response.data;
            return response.data;
        });
    };

    service.staffLogin = function(email, pass, sessionID) {
        data = angular.copy(service.preData);
        data.email = email;
        data.password = pass;
        data.sessionID = sessionID;

        return $http({
            method: 'POST',
            url: 'http://43.252.215.81/denningwcf/v1/app/staffLogin',
            headers: service.headers,
            data: data
        }).then(function(response) {
            return response.data;
        }).then(function(info) {
            if (info.statusCode == 200) {
                service.userInfo.priority = service.demoPriority;
                service.setUserInfo(service.userInfo);
            }
            return info;
        });
    };

    service.tac = function(email, tac) {
        data = angular.copy(service.preData);
        data.email = email;
        data.activationCode = tac;

        return $http({
            method: 'POST',
            url: 'http://43.252.215.163:8313/denningapi/v1/SMS/newDevice',
            headers: service.headers,
            data: data
        }).then(function(response) {
            service.userInfo = response.data;
            service.userInfo.sessionID = tac;
            return response.data;
        });
    };

    service.setUserInfo = function(info) {
        if ($window.localStorage) {
            $window.localStorage.setItem('userInfo', angular.toJson(info));
        }
        service.userInfo = info;
    };

    service.getUserInfo = function() {
        if (!service.userInfo && $window.localStorage) {
            service.userInfo = angular.fromJson($window.localStorage.getItem('userInfo'));
        }
        return service.userInfo;
    };

    service.isAuthenticated = function() {
        // return http header for further api call for successful login
        // return null for non-authorized
        var info = this.getUserInfo();
        if (info && info.sessionID) {
            return {
                "Content-Type": "application/json",
                "webuser-sessionid": info.sessionID,
                "webuser-id": info.email
            };
        } 
        return '';
    };

    service.logout = function() {
        service.setUserInfo({});
    };
    return service;
}]);