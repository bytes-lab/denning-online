materialAdmin
    .run(function ($rootScope, Auth, $state){
    	$rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;


            if (toState.data && toState.data.access) {
                /*Cancel going to the authenticated state and go back to landing*/
                if (toState.data.access == '@' && !Auth.isAuthenticated()) {
                    event.preventDefault();
                    return $state.go('login');
                }

                if (toState.data.access == '?' && Auth.isAuthenticated()) {
                    event.preventDefault();
                    return $state.go('home');
                }
            }
        });
    });