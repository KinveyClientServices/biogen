// Ionic Training App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var onNotificationCallback = function(notification) {
    alert(notification.message);
};

var initialized = false;

angular.module('starter', ['ionic', 'kinvey', 'starter.controllers', 'ngIOS9UIWebViewPatch', 'ngCordova'])

.run(function($ionicPlatform, $kinvey, $rootScope, $state, $location) {

    $rootScope.primarycolor = "#2573ba";
    $rootScope.productsname = "Products";

    // TODO: LAB  1 - initialize Kinvey
    // be sure to specify apiHostname and micHostnme
    // add in determineBehavior routing and push regitration
    //
   $rootScope.$on('$locationChangeStart', function(event, newUrl) {
        if (initialized === false) {
            event.preventDefault(); // Stop the location change
            // Initialize Kinvey
            $kinvey.initialize({
                appKey: 'kid_HkQsI2HG-',
                appSecret: 'ea2eb7d8d45643fcaee883f1c04ab7a0',
                apiHostname: "https://bgn-us1-baas.kinvey.com",
                micHostname: "https://bgn-us1-auth.kinvey.com"
            }).then(function() {
                initialized = true;
                //$location..path($location.url(newUrl).hash); // Go to the page
                determineBehavior($kinvey, $rootScope, $state);


                if ($kinvey.User.getActiveUser()) {
                    $kinvey.Push.register();
                }

                $kinvey.Push.onNotification(onNotificationCallback);

            }).catch(function(error) {
                console.log(error);
            });
        }
    });

    // end LAB 1


    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
    });
})


.config(function($stateProvider, $urlRouterProvider, $kinveyProvider, $ionicConfigProvider, $sceDelegateProvider) {


    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        'http://storage.googleapis.com/**',
        'https://docs.google.com/**'
    ]);
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $ionicConfigProvider.tabs.position('bottom');

    $stateProvider
        .state('menu', {
            url: "/menu",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'MenuCtrl'
        })

    .state('menu.tabs', {
        url: "/tab",
        views: {
            'menuContent': {
                templateUrl: "templates/tabs.html"
            }
        }
    })

    // setup an abstract state for the tabs directive
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('menu.tabs.home', {
        url: '/home',
        views: {
            'tab-home': {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            }
        }
    })


    .state('menu.projects', {
        url: '/projects',
        views: {
            'menuContent': {
                templateUrl: 'templates/projects.html',
                controller: 'ProjectsCtrl'
            }
        }
    })

    .state('menu.doctors', {
        url: '/doctors',
        views: {
            'menuContent': {
                templateUrl: 'templates/doctors.html',
                controller: 'DoctorsCtrl'
            }
        }
    })

    .state('menu.ref', {
        url: '/ref',
        views: {
            'menuContent': {
                templateUrl: 'templates/ref.html',
                controller: 'RefCtrl'
            }
        }
    })


    .state('menu.brand', {
        url: '/brand',
        views: {
            'menuContent': {
                templateUrl: 'templates/brand.html',
                controller: 'BrandCtrl'
            }
        }
    })


    .state('menu.newticket', {
        url: "/newticket",
        views: {
            'menuContent': {
                templateUrl: "templates/newticket.html",
                controller: 'InsertTicketCtrl'
            }
        }
    })



    .state('menu.tabs.products', {
        url: '/products',
        views: {
            'tab-products': {
                templateUrl: 'templates/tab-products.html',
                controller: 'ProductCtrl'
            }
        }
    })

    .state('menu.offline', {
        url: '/offline',
        views: {
            'menuContent': {
                templateUrl: 'templates/offline.html',
                controller: 'OfflineCtrl'
            }
        }
    })

    .state('menu.tabs.search', {
        url: '/search',
        views: {
            'tab-search': {
                templateUrl: 'templates/tab-search.html',
                controller: 'SearchCtrl'
            }
        }
    })

    .state('menu.video', {
        url: '/video/:videoId',
        views: {
            'menuContent': {
                templateUrl: 'templates/myvideo.html',
                controller: 'MyVideoCtrl'
            }
        }
    })

    .state('menu.tabs.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('menu/tab/home');

});


//function selects the desired behavior depending on whether the user is logged or not
function determineBehavior($kinvey, $rootScope, $state, $scope) {
    //var activeUser = new $kinvey.User();
    //activeUser = activeUser.getActiveUser();
    console.log('INSIDE DETERMINEBEHAVIOR');
    //console.log( activeUser );
    console.log("$state.current.name: " + $state.current.name);
    var activeUser = $kinvey.User.getActiveUser();

    if (!activeUser) {
        console.log("activeUser null redirecting");
        if ($state.current.name != 'menu.tab.account') {
            $state.go('menu.tabs.account');
        }
        return;
    } else {
        //we have an active user
        console.log("activeUser not null");
        $state.go('menu.tabs.home', null, { reload: true });

    }
}