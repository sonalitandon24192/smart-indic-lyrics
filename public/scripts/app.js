angular.module('todoApp', ['ngRoute',  'ui.bootstrap', 'ngFileSaver'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'MainController',
                templateUrl: '/views/main.html'
            })
            .otherwise( { redirectTo: '/' } );
    }]);
