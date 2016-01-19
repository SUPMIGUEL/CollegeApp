var app = angular.module("collegeApp", ['ngRoute', 'ngMessages','ui.bootstrap']);

app.config(function($routeProvider, $locationProvider, $httpProvider){
  $routeProvider
  .when('/signup',{
    templateUrl: "templates/users/signup.html",
    controller: "SignupController",
    preventWhenLoggedIn: true,
    signup: true
  })
  .when('/login',{
    templateUrl: "templates/users/login.html",
    controller: "LoginController",
    preventWhenLoggedIn: true
  })
  .when('/users',{
    templateUrl: "templates/users/index.html",
    controller: "UsersController",
    restricted: true,
    resolve: {
      currentUser : function(UserService) {
        return UserService.getCurrentUser();
      },
      users: function(UserService){
        return UserService.getAllUsers();
      }
    }
  })
  .when('/logout',{
    restricted: true,
    resolve: {
      app: function(UserService, $location){
        UserService.logout();
        $location.path("/");
      }
    }
  })
  .when('/users/:id',{
    templateUrl: "templates/users/show.html",
    controller: "UserController",
    resolve: {
      user: function(UserService,$route){
        return UserService.getSingleUser($route.current.params.id);
      }
    }
  })
  .when('/users/:id/edit',{
    templateUrl: "templates/users/edit.html",
    controller: "EditController",
    restricted: true,
    resolve: {
      user: function(UserService,$route){
        return UserService.getSingleUser($route.current.params.id);
      }
    }
  })
  .when('/groups', {
    controller: "GroupsController",
    templateUrl: "templates/groups/groups.html",
  })
  .when('/groups/new', {
    controller: "NewGroupController",
    templateUrl: "templates/groups/new.html",
    restricted: true
  })
  .when('/groups/:id', {
    controller: "GroupController",
    templateUrl: "templates/groups/show.html",
    restricted: true
  })
  .when('/groups/:id/edit', {
    controller: "EditGroupController",
    templateUrl: "templates/groups/edit.html",
    restricted: true
  })
  .when('/', {
    controller: "HomeController",
    templateUrl: "templates/statics/home.html",
  })
  .otherwise({
    redirectTo:'/'
  });
  $locationProvider.html5Mode(true);
  $httpProvider.interceptors.push("AuthInterceptor");
});

app.service("AuthInterceptor", function($window,$location,$q){
  return {
    request: function(config){
      // prevent browser bar tampering for /api routes
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      var token = $window.localStorage.getItem("token");
      if(token)
        config.headers.Authorization = "Bearer " + token;
      return $q.resolve(config);
    },
    responseError: function(err){
      // if you mess around with the token, log them out and destroy it
      if(err.data === "invalid token" || err.data === "invalid signature" || err.data === "jwt malformed"){
        $location.path("/logout");
        return $q.reject(err);
      }
      // if you try to access a user who is not yourself
      if(err.status === 401){
        $location.path('/users');
        return $q.reject(err);
      }
      return $q.reject(err);
    }
  };
});

app.run(function ($rootScope, $location, $window) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    // if you try access a restricted page without logging in
    if (next.restricted && !$window.localStorage.getItem("token")) {
      if(current && current.signup)
        $location.path('/signup');
      else
        $location.path('/login');
    }
    // if you try to log in or sign up once logged in
    if (next.preventWhenLoggedIn && $window.localStorage.getItem("token")) {
      $location.path('/users');
    }
  });
});

