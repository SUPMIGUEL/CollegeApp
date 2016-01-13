app.service("GroupService",['$http', function($http){
  return {
    getGroups: function(){
      return $http.get("/api/groups");
    },
    createGroup: function(group){
      return $http.post("/api/groups", group);
    },
    getGroup: function(id){
      return $http.get("/api/groups/" + id);
    },
    editGroup: function(id,group){
      return $http.put("/api/groups/" + id, group);
    },
    deleteGroup: function(id){
      return $http.delete("/api/groups/" + id);
    },
    createComment: function(comment){
      return $http.post("/api/comments/", comment);
    },
    deleteComment: function(id){
      return $http.delete("/api/comments/" + id);
    }
  };
}]);

app.service("UserService", ["$http", "$window", "$rootScope", function($http, $window, $rootScope){
  return {
    signup: function(user){
      return $http.post('/api/users/signup', user);
    },
    login: function(user){
      return $http.post('/api/users/login', user);
    },
    setCurrentUser: function(data){
      $window.localStorage.setItem("token",data.data.token);
      $window.localStorage.setItem("user",JSON.stringify(data.data.user));
      $rootScope.currentUser = JSON.parse($window.localStorage.getItem("user"));
    },
    getCurrentUser: function(){
      return JSON.parse($window.localStorage.getItem("user"));
    },
    logout: function(){
      $rootScope.currentUser = null;
      $window.localStorage.clear();
    },
    getAllUsers: function(){
      return $http.get("/api/users/");
    },
    getSingleUser: function(id){
      return $http.get("/api/users/" + id);
    },
    editUser: function(user){
      return $http.put("/api/users/" + user.id, user);
    },
    removeUser: function(user){
      return $http.delete("/api/users/" + user.id);
    }
  };
}]);
