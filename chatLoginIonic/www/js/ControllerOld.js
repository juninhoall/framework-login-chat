
.controller('LoginCtrl', function ($scope, $ionicModal, $state, $firebaseAuth, $ionicLoading, $rootScope) {
    //console.log('Login Controller Initialized');

            var items = [4];
    var ref = new Firebase($scope.firebaseUrl);
    var auth = $firebaseAuth(ref);

    $ionicModal.fromTemplateUrl('templates/signup.html', {
       id: '1',
        scope: $scope,
         backdropClickToClose: false,
         animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.oModal1 = modal;
    });
    // Modal 2
    $ionicModal.fromTemplateUrl('templates/interesses.html', {
      id: '2', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      backdropClickToClose: false,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.oModal2 = modal;
      console.log("Guardando Valores do Form");
      items[0] = [user.email];
      items[1] =[user.password];
      items[2] =[user.displayName];
      items[3] =[user.image];
    });

    $scope.openModal = function(index) {
      if (index == 1) $scope.oModal1.show();
      else $scope.oModal2.show();
    };

    $scope.closeModal = function(index) {
      if (index == 1) $scope.oModal1.hide();
      else $scope.oModal2.hide();
    };

    /* Listen for broadcasted messages */

    $scope.$on('modal.shown', function(event, modal) {
      console.log('Modal ' + modal.id + ' shown!');
    });

    $scope.$on('modal.hidden', function(event, modal) {
      console.log('Modal ' + modal.id + ' hiden!');
    });

    // Cleanup the modals when we're done with them (i.e: state change)
    // Angular will broadcast a $destroy event just before tearing down a scope


    $scope.createUser = function (user) {
        console.log("Deu Ruim!" + items[0].toString());


        if (user && user.email && user.password && user.displayname) {
            $ionicLoading.show({
                template: 'Signing Up...'
            });
            auth.$createUser({
              email: items[0],
              password: items[1],
              displayName: items[2],
              image: items[3],
              interesse: user.interesse

            }).then(function (userData) {
                alert("Deu Bom!");
                ref.child("users").child(userData.uid).set({
                  email: items[0],
                  password: items[1],
                  displayName: items[2],
                  image: items[3],
                  interesse: items[4]
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
