  // MyChat App - Ionic & Firebase Demo

      /**
        * Now we can use $firebase service to sync data with
        * Firebase and $firebaseAuth for Authentication helper functions.
      */
      angular.module('mychat', ['ionic', 'mychat.controllers', 'mychat.services', 'firebase'])
     .run(function ($ionicPlatform, $rootScope) {
     $ionicPlatform.ready(function () {
    /**
      * Hide the accessory bar by default (remove this to show the accessory bar
      * above the keyboard
      * for form inputs)
    */
    if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
             if(window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
             }

    $rootScope.logout = function () {
        console.log("Logging out from the app");
    }
}); }).config(function ($stateProvider, $urlRouterProvider) {

$stateProvider

.state('login', {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: 'LoginCtrl'
})

// setup an abstract state for the tabs directive
.state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
})

// Each tab has its own nav history stack:

.state('tab.rooms', {
    url: '/rooms',
    views: {
        'tab-rooms': {
            templateUrl: 'templates/tab-rooms.html',
            controller: 'RoomsCtrl'
        }
    }
})

.state('tab.chat', {
    url: '/chat',
    views: {
        'tab-chat': {
            templateUrl: 'templates/tab-chat.html',
            controller: 'ChatCtrl'
        }
    }
})

       // if none of the above states are matched, use this as the fallback
       $urlRouterProvider.otherwise('/login');

     });
