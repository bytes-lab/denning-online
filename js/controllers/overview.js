materialAdmin
  .controller('overviewCtrl', function($scope, $stateParams, fileMatterService, contactService, $state, matterFormService, Auth) {
    var vm = this;
    vm.widgets = [
      {
        "type": "widget1",
        "templateOptions": {
          "position": [2, 3], 
          "num_matters": 3,
        }
      }
    ]
  })
