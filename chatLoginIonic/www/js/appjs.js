angular.module('ionicApp', ['ionic', 'firebase'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "tabs.html"
    })
    .state('tabs.home', {
      url: "/home",
      views: {
        'home-tab': {
          templateUrl: "home.html",
          controller: 'HomeTabCtrl'
        }
      }
    })

   $urlRouterProvider.otherwise("/tab/home");

})

.controller('HomeTabCtrl', function($scope, $state, $firebase) {
   var ref = new Firebase("https://vaisabrina.firebaseio.com/");
        $scope.messages = $firebase(ref);
        $scope.addMessage = function(e) {
           $scope.sendMsg = function() {
                  $scope.messages.$add({from: $scope.name, body: $scope.msg});
                  $scope.msg = "";
                }
        }
        $scope.clear = function(){
          $scope.name = "";
        }
  console.log('HomeTabCtrl');

});
