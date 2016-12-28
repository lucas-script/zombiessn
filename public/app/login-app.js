var loginApp = angular.module('loginApp', 
    ['ngRoute', 'ngMaterial', 'ngMessages', 'ui.mask', 'ui.validate']);

loginApp.config(function ($routeProvider, $mdThemingProvider) {
   
    $mdThemingProvider.theme('default')
        .primaryPalette('light-blue')
        .accentPalette('orange');

    $routeProvider
    .when('/', {
        templateUrl: 'app/views/pages/login/login.ejs',
        controller: 'loginController' 
    })
    .otherwise({
        redirectTo: '/'
    });
});

loginApp.service('authTokenService', ['$window', function ($window) {
    
    this.getToken = function () {
        return $window.localStorage.getItem('token');
    }
    
    this.setToken = function (token) {
        
        if (token) {
            $window.localStorage.setItem('token', token);
        } else {
            $window.localStorage.removeItem('token');
        }
    }
    
}]);

loginApp.service('loginService', ['$http', function ($http) {
    
    this.autenticar = function (login) {
        return $http.post('/api/login', login);
    }
    
}]);

loginApp.service('messageService', ['$mdToast', function ($mdToast) {
    
    this.showMessage = function(message) {
        $mdToast.show($mdToast.simple().position('top right').textContent(message));
    };

}]);

loginApp.service('utilService', [function () {
    
    this.messages = {
        erroProbTec: 'Problemas técnicos ocorreram durante a autenticação, tente novamente mais tarde!'
    }

}]);

loginApp.controller('loginController', 
    ['$scope','$window', 'loginService', 'messageService', 'authTokenService', 'utilService', 
    function ($scope, $window, loginService, messageService, authTokenService, utilService) {
    
    $scope.loading = false;
    $scope.login = {
        email: '',
        senha: ''
    }
    
    $scope.autenticar = function() {
        $scope.loading = true;
        console.log('autenticar');
        loginService.autenticar($scope.login).then(function (res) {
            console.log(res.data);
            if (res.data.success) {
                // sucesso na autenticacao
                var token = res.data.token;
                authTokenService.setToken(token);
                $window.location.href = res.data.redirectTo + '?token=' + token;
                return;
            } else {
                // falha na autenticacao
                authTokenService.setToken();
                $scope.loading = false;
                messageService.showMessage(res.data.message);
                return;
            }
        }).catch(function (err) {
            // erro na solicitacao
            authTokenService.setToken();
            $scope.loading = false;
            messageService.showMessage(utilService.messages.erroProbTec);
            return;
        });
    }
    
}]);