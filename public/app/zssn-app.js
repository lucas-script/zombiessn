var zssnApp = angular.module('zssnApp', 
    ['ui.router', 'ngMaterial', 'ngMessages', 'ngCookies', 'ui.mask', 'ui.validate',
     'angularMoment', 'datatables', 'ngMask', 'ngMap']);

zssnApp.run(function(DTDefaultOptions) {
    // DTDefaultOptions.setLanguageSource('/assets/libs/datatables/ptbr.json');
});

zssnApp.config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', '$mdDateLocaleProvider', 'moment',
    function ($stateProvider, $urlRouterProvider, $mdThemingProvider, $mdDateLocaleProvider, moment) {
   
    $mdThemingProvider.theme('default')
        .primaryPalette('teal')
        .accentPalette('orange');
    
    $mdThemingProvider.theme('modalTheme').primaryPalette('blue');

    // date config
    $mdDateLocaleProvider.formatDate = function(date) {
        return moment(date).format('DD/MM/YYYY');
    };

    $mdDateLocaleProvider.parseDate = function(dateString) {
        var m = moment(dateString, 'DD/MM/YYYY', true);
        return m.isValid() ? m.toDate() : new Date(NaN);
    };

    $urlRouterProvider.otherwise('/home/login/');
    $stateProvider
    .state('home', {
        url: '/home',
        templateUrl: 'app/views/homeView.ejs',
        controller: 'homeController'
    })
    .state('home.register', {
        url: '/register',
        templateUrl: 'app/views/pages/home/register.ejs',
        controller: 'registerController'
    })
    .state('home.login', {
        url: '/login/:id',
        templateUrl: 'app/views/pages/home/login.ejs',
        controller: 'loginController'
    })
    .state('home.forgot', {
        url: '/forgot',
        templateUrl: 'app/views/pages/home/forgot.ejs',
        controller: 'forgotController'
    })

    .state('account', {
        url: '/account/:id',
        templateUrl : 'app/views/accountView.ejs',
        controller: 'accountController'
    })
    .state('account.home', {
        url: '/home',
        templateUrl: 'app/views/pages/account/home.ejs',
        controller: 'accountHomeController'
    })
    .state('account.me', {
        url: '/me',
        templateUrl: 'app/views/pages/account/me.ejs',
        controller: 'meController'
    });
}]);

//
// SERVICES
//

zssnApp.service('messageService', ['$mdToast', function ($mdToast) {
    
    this.showMessage = function(message) {
        $mdToast.show($mdToast.simple().position('top right').textContent(message));
    };

}]);

zssnApp.service('utilService', ['$http', function ($http) {
    
    this.convertToDate = function (d) {
        return new Date(d);
    }
    
    this.messages = {
        technicalProblems: 'Sorry, technical problems'
    }

    // The md-select directive eats keydown events for some quick select
    // logic. Since we have a search input here, we don't need that logic.
    this.onSearchChange = function(ev) {
        ev.stopPropagation();
    }

    this.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBnkBVhKo6Gsuot71EjpxhTN0KCbZBCCog";
}]);

zssnApp.service('itemService', ['$http', function ($http) {
    
    this.list = function () {
        return $http.get('/api/items');
    }
}]);

zssnApp.service('userService', ['$http', function ($http) {

    this.list = function () {
        return $http.get('/api/users');
    };
    this.get = function (id) {
        return $http.get('/api/users/' + id);
    };
    this.save = function (user) {
        return $http.post('/api/users', user);
    };
    this.update = function (id, user) {
        return $http.put('/api/users/' + id, user);
    };
    this.delete = function (id) {
        return $http.delete('/api/users/' + id);
    };
}]);

zssnApp.service('sessionService', ['$http', function ($http) {
    
    this.token;
    this.userInfo;
    this.logout = function () {
        this.userInfo = {};
        this.token = '';
    }
}]);

//
// CONTROLLERS
//

zssnApp.controller('menuController', 
    ['$scope', '$state', '$location', function ($scope, $state, $location) {
    
    // verifica se o menu está ativo
    $scope.isActive = function(viewLocation) {
        return $location.path() === viewLocation;
    }

    $scope.logout = function () {
        $state.go('home.login');
    }
}]);

zssnApp.controller('homeController', 
    ['$scope','$window', 'messageService', 'utilService', 
    function ($scope, $window, messageService, utilService) {

}]);

zssnApp.controller('registerController', 
    ['$scope', '$state', 'utilService', 'messageService', 'userService', 'itemService', 'NgMap', '$mdDialog', 
    function ($scope, $state, utilService, messageService, userService, itemService, NgMap, $mdDialog) {
    
    $scope.loading = false;
    $scope.closeDialog = function () { $mdDialog.hide(); };
    $scope.genders = ['Male', 'Female'];
    $scope.itemsList = [];
    $scope.googleMapsUrl = utilService.googleMapsUrl;
    
    // user model
    $scope.user = {
        name: '',
        birthday: '',
        gender: '',
        lastLocation : {
            lat: '',
            lng: ''
        },
        inventory: []
    }

    // map
    NgMap.getMap({ id: 'register-map' }).then( function (map) {
        $scope.map = map;
        $scope.user.lastLocation.lat = map.getCenter().lat();
        $scope.user.lastLocation.lng = map.getCenter().lng();
    });

    // add to invetory method
    $scope.addToInventory = function (item) {
        if (item.item && item.amount) {
            
            var result = $scope.user.inventory.filter( function (obj) {
                return obj.item == item.item;
            });
            
            if (result.length !== 0) {
                result[0].amount += item.amount; 
            } else {
                $scope.user.inventory.push(item);
            }
        }
        $scope.closeDialog();
    }

    // save register
    $scope.register = function () {
        $scope.loading = true;
        userService.save( $scope.user ).then(function (res) {
            $scope.loading = false;
            if (res.data.error) {
                messageService.showMessage(res.data.error);
                return;    
            }
            messageService.showMessage(res.data.message);
            $state.go('home.login', { id: res.data.id });
        }).catch(function (err) {
            $scope.loading = false;
            messageService.showMessage(utilService.messages.technicalProblems);
        });
    }

    // new item dialog
    $scope.addNewItem = function () {
        $mdDialog.show({
            controller: 'itemDialogController',
            templateUrl: 'app/views/pages/home/itemDialog.ejs',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            escapeToClose: false,
            fullscreen: true,
            locals: { itemsList: $scope.itemsList }
        }).then( function (item) {
            $scope.addToInventory(item);
        }).catch( function (error) {
            messageService.showMessage(error);
        });
    }

    $scope.getItemNameById = function (id) {
        var result = $scope.itemsList.filter( function (obj) {
            return obj._id == id;
        });
        
        return result[0].name;
    }

    // load items
    var loadItems = function () {
        itemService.list().then( function (res) {
            if (!res.data.error) {
                $scope.itemsList = res.data.items;
            } else {
                messageService.showMessage(res.data.error);
            }
        });
    }
    loadItems();
}]);


zssnApp.controller('itemDialogController', ['$scope', '$mdDialog', 'itemsList', function ($scope, $mdDialog, itemsList) {
    
    $scope.itemsList = itemsList;
    $scope.itemToAdd = {
        item: '',
        amount: ''
    }
    $scope.closeDialog = function () { $mdDialog.hide(); };
    $scope.answer = function() {
        $mdDialog.hide($scope.itemToAdd);
    };

}]);

zssnApp.controller('loginController', 
    ['$scope', '$state', '$stateParams', 
    function ($scope, $state, $stateParams) {
    
    $scope.id = $stateParams.id;
    $scope.logon = function () {
        $state.go('account', { id: $scope.id });
    }
}]);

zssnApp.controller('forgotController', 
    ['$scope', '$state', 'messageService', 'utilService', 'userService', 
    function ($scope, $state, messageService, utilService, userService) {
    
    $scope.users = []

    var loadUsers = function () {
        userService.list().then(function (res) {
            $scope.users = res.data.users;
        }).catch(function (error) {
            messageService.showMessage(utilService.messages.technicalProblems);
        });
    }
    loadUsers();
}]);

zssnApp.controller('accountController', 
    ['$scope', '$state', '$stateParams', 'messageService', 'utilService', 'userService', 'sessionService', 
    function ($scope, $state, $stateParams, messageService, utilService, userService, sessionService) {
    
    var id = $stateParams.id;
    
    // load user info
    userService.get(id).then( function (res) {
        sessionService.userInfo = res.data.user;
        sessionService.userInfo.birthday = utilService.convertToDate(sessionService.userInfo.birthday);
    });


    $scope.getUserInfo = function () {
        return sessionService.userInfo;
    }
}]);

zssnApp.controller('meController', 
    ['$scope', '$state', 'utilService', 'messageService', 'userService', 'itemService', 'NgMap', '$mdDialog', 'sessionService', 
    function ($scope, $state, utilService, messageService, userService, itemService, NgMap, $mdDialog, sessionService) {
    
    $scope.readonly = true;
    $scope.user = sessionService.userInfo;
    $scope.map;
    $scope.userNewLocation = {};
    $scope.genders = ['Male', 'Female'];
    $scope.itemsList = [];
    $scope.googleMapsUrl = utilService.googleMapsUrl;

    // map
    NgMap.getMap({id:'me-map'}).then( function (m) {
        $scope.map = m;
        $scope.userNewLocation.lat = m.getCenter().lat();
        $scope.userNewLocation.lng = m.getCenter().lng();
    });
    
    $scope.updateLocation = function () {
        
    }
}]);

zssnApp.controller('accountActionsController', 
    ['$scope', '$state',  '$mdDialog', 'userService', 'messageService', 'utilService', 'action', 'id',
    function ($scope, $state, $mdDialog, userService, messageService, utilService, action, id) {
    
}]);

zssnApp.controller('accountHomeController', ['$scope', function ($scope) {
}]);