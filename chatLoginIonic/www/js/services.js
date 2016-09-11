//http://codepen.io/anon/pen/RGWjrj referencia chat
angular.module('mychat.services', ['firebase'])
    .factory("Auth", ["$firebaseAuth", "$rootScope",
    function ($firebaseAuth, $rootScope) {
            var ref = new Firebase(firebaseUrl);
            return $firebaseAuth(ref);
}])
.factory('Auth', function($firebaseAuth){
  var usersRef= new Firebase(firebaseUrl);
  return $firebaseAuth(usersRef);
})
.factory('Message', ['$firebase',
function($firebase) {
  var ref = new Firebase('https://authioniccatolica.firebaseio.com/');
  var messages = $firebase(ref.child('messages')).$asArray();

  var Message = {
    all: messages,
    create: function (message) {
      return messages.$add(message);
    },
    get: function (messageId) {
      return $firebase(ref.child('messages').child(messageId)).$asObject();
    },
    delete: function (message) {
      return messages.$remove(message);
    }
  };

  return Message;

}
]);
