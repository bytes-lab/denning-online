denningOnline
  .factory('Auth', function ($http, $window) {
    var service = {
      baseUrl: 'https://denningonline.com.my/denningapi'
    };

    service.rememberMe = false;
    service.demoPriority = {
      "matter": {
        "list": true,
        "create": false,
        "read": true,
        "update": false,
        "delete": true
      },
      "filematter": {
        "list": true,
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      },
      "mattercode": {
        "list": true,
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      },
      "matterform": {
        "list": true,
        "create": true,
        "read": true,
        "update": true,
        "delete": true
      },
      "note": {
        "list": true,
        "create": true,
        "read": true,
        "update": true,
        "delete": false
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
      "landoffice": {
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
      "court": {
        "list": true,
        "create": false,
        "read": true,
        "update": false,
        "delete": false
      },
      "irbbranch": {
        "list": true,
        "create": true,
        "read": true,
        "update": true,
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

    new Fingerprint2().get(function (result, components) {
      service.preData = {
        "ipWAN": "121.196.213.102",
        "ipLAN": "192.168.0.101",
        "OS": "Windows 10",
        "device": "laptop",
        "deviceName": "laptop01",
        "MAC": result
      };
    });
    
    service.login = function (email, pass) {
      data = angular.copy(service.preData);
      data.email = email;
      data.password = pass;

      return $http({
        method: 'POST',
        url: service.baseUrl + '/v1/signIn',
        headers: service.headers,
        data: data
      }).then(function(response) {
        service.userInfo = response.data;
        return response.data;
      });
    };

    service.tac = function (email, tac) {
      data = angular.copy(service.preData);
      data.email = email;
      data.activationCode = tac;

      return $http({
        method: 'POST',
        url: service.baseUrl + '/v1/SMS/newDevice',
        headers: service.headers,
        data: data
      }).then(function(response) {
        var tEmail = service.userInfo.email,
            tSessionID = service.userInfo.sessionID;

        service.userInfo = response.data;
        service.userInfo.email = tEmail;
        service.userInfo.sessionID = tSessionID;
        return response.data;
      });
    };

    service.resetPassword = function (email, pass) {
      data = angular.copy(service.preData);
      data.email = email;
      data.password = pass;

      return $http({
        method: 'POST',
        url: service.baseUrl + '/v1/password/new',
        headers: service.headers,
        data: data
      }).then(function(response) {
        service.userInfo = response.data;
        service.userInfo.priority = service.demoPriority;
        service.setUserInfo(service.userInfo);
        return response.data;
      });
    };

    service.staffLogin = function (pass) {
      data = angular.copy(service.preData);
      data.email = service.userInfo.email;
      data.sessionID = service.userInfo.sessionID;
      data.password = pass;

      baseUrl = service.getBaseURL();

      return $http({
        method: 'POST',
        url: baseUrl + '/v1/web/staffLogin',
        headers: service.headers,
        data: data
      }).then(function (response) {
        return response.data;
      }).then(function (info) {
        if (info.statusCode == 200) {
          var cp = info.companyProfile || {};
          service.userInfo.priority = service.demoPriority;
          service.userInfo.TaxName = cp.TaxName;
          service.userInfo.currency = cp.currencySymbol;
          service.userInfo.localTime = info.localTime;
          service.userInfo.logo = cp.companyLogo;
          service.setUserInfo(service.userInfo);
        }
        return info;
      });
    };

    service.setUserInfo = function (info) {
      if ($window.localStorage) {
        $window.localStorage.setItem('userInfo', angular.toJson(info));
      }
      service.userInfo = info;
    };

    service.getUserInfo = function () {
      if (!service.userInfo && $window.localStorage) {
        service.userInfo = angular.fromJson($window.localStorage.getItem('userInfo'));
      }
      return service.userInfo;
    };

    service.isAuthenticated = function () {
      // return http header for further api call for successful login
      // return null for non-authorized
      var info = this.getUserInfo ();
      if (info && info.sessionID) {
        return {
          "Content-Type": "application/json",
          "webuser-sessionid": info.sessionID,
          "webuser-id": info.email
        };
      } 
      return '';
    };

    service.getBaseURL = function () {
      var baseUrl = this.getUserInfo().catDenning[0].APIServer;
      return baseUrl;
    }

    service.logout = function () {
      service.setUserInfo({});
    };
    return service;
  });
