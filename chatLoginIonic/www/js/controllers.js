angular.module('mychat.controllers', [])

.controller('LoginCtrl', function ($scope, $ionicModal, $state, $firebaseAuth, $ionicLoading, $rootScope) {
    //console.log('Login Controller Initialized');

    var ref = new Firebase($scope.firebaseUrl);
    var auth = $firebaseAuth(ref);

    $ionicModal.fromTemplateUrl('templates/signup.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.createUser = function (user) {
        console.log("Create User Function called");
        if (user && user.email && user.password && user.displayname) {
            $ionicLoading.show({
                template: 'Signing Up...'
            });

            auth.$createUser({
                email: user.email,
                password: user.password,
                image: user.image

            }).then(function (userData) {
                alert("User created successfully!");
                ref.child("users").child(userData.uid).set({
                    email: user.email,
                    displayName: user.displayname,
                    image: user.image
                });
                $ionicLoading.hide();
                $scope.modal.hide();
            }).catch(function (error) {
                alert("Error: " + error);
                $ionicLoading.hide();
            });
        } else
            alert("Please fill all details");
    }

    $scope.signIn = function (user) {

        if (user && user.email && user.pwdForLogin) {
            $ionicLoading.show({
                template: 'Signing In...'
            });
            auth.$authWithPassword({
                email: user.email,
                password: user.pwdForLogin
            }).then(function (authData) {
                console.log("Logged in as:" + authData.uid);
                ref.child("users").child(authData.uid).once('value', function (snapshot) {
                    var val = snapshot.val();
                    // To Update AngularJS $scope either use $apply or $timeout
                    $scope.$apply(function () {
                        $rootScope.displayName = val;
                    });
                });
                $ionicLoading.hide();
                $state.go('tab.rooms');
            }).catch(function (error) {
                alert("Authentication failed:" + error.message);
                $ionicLoading.hide();
            });
        } else
            alert("Please enter email and password both");
    }
})
.controller("AppCtrl", function($scope, Auth, $state){

  Auth.$onAuth(function(authData){
    if (authData === null) {
      console.log('usuario nao autenticado');
    }else {
      $state.go('tab.rooms');
    }

    $scope.authData = authData;

  })
  $scope.login = function(authMethod, $state){
    Auth.$authWithOAuthRedirect(authMethod).catch(function(error){
      console.log('');
      if (error.code === 'TRANSPORT_UNAVAILABLE'){
        Auth.$authWithOAuthPopup(authData).then(function(authData){

        });
      }else{
        console.log('Error.:');
        console.log(error);
      }
    })
  };
})

.controller('HomeTabCtrl', function($scope, $state, $firebase,$stateParams) {

   var ref = new Firebase('https://authioniccatolica.firebaseio.com/');

        $scope.messages = $firebase(ref);
        $scope.addMessage = function(e) {
           $scope.sendMsg = function() {
                  $scope.messages.add({'from': $scope.name, 'body': $scope.msg});
                  $scope.msg = "";
                }
        }
        $scope.clear = function(){
          $scope.name = "";
        }
})
.controller('chatController', ['$scope','Message', function($scope,Message){

    $scope.user="Guest";

    $scope.messages= Message.all;

    $scope.inserisci = function(message){
      Message.create(message);
    };
}])
.controller('ChatCtrl', ['$scope','Message', function($scope,Message){

    $scope.user="Guest";

    $scope.messages= Message.all;

    $scope.inserisci = function(message){
      Message.create(message);
    };
}])
.controller('buscarIdCtrl', ['$scope', function($scope){

}])

.controller('chatIndividualCtrl', ['$scope', function(){
  var ref = new Firebase("https://authioniccatolica.firebaseio.com/users");
  ref.once("value", function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key();
      var childData = childSnapshot.val();
      childData = childData.displayName;
      // Criando dom
      var para = document.createElement("div");
      para.setAttribute("id", childData);
      para.className = "list";
      var a = document.createElement("a");
      a.className = "item item-thumbnail-right";//item item-thumbnail-left
      var h2 = document.createElement("h2");
      var img = document.createElement("img");
      img.setAttribute("src", "http://www.dinamicamente.org/images/dinamicamente.png");
      var t = document.createTextNode(childData);
      h2.appendChild(t);
      var minhadiv = document.getElementById("myDIV").appendChild(para);

      // Montando DOM
      minhadiv.appendChild(a);
      a.appendChild(img);
      a.appendChild(h2);
  });
});
}])
.controller('RtcommVideoDemoCtrl', function($scope, RtcommService){

    /* Data model for the caller name */
    $scope.demoCallerID = "";

    /* Place a call to another user */
    $scope.placeCall = function(){

      /* Use the RtcommService to place a call to a user, enable video and audio using 'webrtc'*/
      RtcommService.placeCall($scope.demoCallerID, ['webrtc']);

    }

    /* Stop the active call */
    $scope.stopCall = function(){

      /* Get the active endpoint in the session */
      var activeEndpointUUID = RtcommService.getActiveEndpoint();
      var activeEndpoint = RtcommService.getEndpoint(activeEndpointUUID);

      /* Disconnect the endpoint from the session */
      activeEndpoint.disconnect();

    }
  })
  .controller('ModalCtrl', function($scope, $ionicModal) {
  $ionicModal.fromTemplateUrl('templates/call.html', {
  }).then(function(modal) {
    $scope.modal = modal;
  });
});
