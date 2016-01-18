app.controller("NavController", [ '$scope', '$window', '$rootScope', function($scope, $window, $rootScope){
  $rootScope.currentUser = JSON.parse($window.localStorage.getItem("user"));
}]);

app.controller("SignupController", function($scope, UserService, $location, $rootScope){
  $rootScope.url ="";
  $scope.add = function(){
    uploadcare.openDialog(null, {
      crop: "disabled",
      previewStep: true,
      imagesOnly: true
    }).done(function(file) {
      file.promise().done(function(fileInfo){
        $rootScope.url = fileInfo.cdnUrl;
        $scope.$apply();
      });
    });
  }; 

  $scope.signup = function(user){
    UserService.signup(user).then(function(data){
      UserService.setCurrentUser(data);
      $location.path('/');
    }).catch(function(data){
      $scope.errors = data.data;
    });
  };
});

app.controller("LoginController", function($scope, UserService, $location){
  $scope.login = function(user){
    UserService.login(user).then(function(data){
      UserService.setCurrentUser(data);
      $location.path('/');
    }).catch(function(data){
      $scope.errors = data.data;
      $scope.user = {};
      $scope.userForm.$setPristine();
      $scope.userForm.$setUntouched();
    });
  };
});

app.controller("UserController", function($scope, user, UserService, $routeParams, $location){
  /*$scope.user = user.data;*/
  UserService.getSingleUser($routeParams.id).then(function(res){
    $scope.user = res.data;
  }).catch(function(err){
    $location.path('/');
  });

  $scope.removeUser = function(user){
    if (confirm('Are you sure you want to delete your account?')) {
      if (confirm('Are you sure?')) {
        UserService.removeUser(user._id).then(function(user){
          UserService.logout();
          $location.path('/');
        }).catch(function(err){
          $scope.errors = err;
        });
      }
    }
  };
});

app.controller("EditController", function($scope, $location, UserService, user, $window, $rootScope){
  $scope.btnshow=true;
  $scope.add = function(){
    uploadcare.openDialog(null, {
      crop: "disabled",
      previewStep: true,
      imagesOnly: true
    }).done(function(file) {
      file.promise().done(function(fileInfo){
        $rootScope.url = fileInfo.cdnUrl;
        $scope.btnshow=false;
        $scope.$apply();
      });
    });
  }; 

  $scope.user = user.data;
  $scope.editUser = function(user){
    UserService.editUser(user).then(function(data){
      $window.localStorage.setItem("user",JSON.stringify(data.data));
      $location.path('/');
    }).catch(function(err){
      $scope.errors = "Looks like someone already has that username!";
    });
  };
});

app.controller("UsersController", function($scope,currentUser,users){
  $scope.users = users;
  $scope.currentUser = currentUser;
});

////////////////////////////////////////////////////////////////////////////

app.controller("GroupsController", ['$scope', '$location', 'GroupService', '$window', function($scope, $location, GroupService, $window){
  $scope.currentUser = JSON.parse($window.localStorage.getItem("user"));
  GroupService.getGroups().then(function(groups){
    $scope.groups = groups.data;
  });
}]);

app.controller("NewGroupController", ['$scope', '$location', 'GroupService', '$rootScope', function($scope, $location, GroupService, $rootScope){
  $rootScope.url ="";
  $scope.add = function(){
    uploadcare.openDialog(null, {
      crop: "disabled",
      previewStep: true,
      imagesOnly: true
    }).done(function(file) {
      file.promise().done(function(fileInfo){
        $rootScope.url = fileInfo.cdnUrl;
        $scope.$apply();
      });
    });
  }; 

  $scope.createGroup = function(group){
    GroupService.createGroup(group).then(function(){
      $location.path('/');
    }).catch(function(err){
      $location.path('/');
    });
  };
}]);

app.controller("GroupController", ['$scope', '$location', '$routeParams', 'GroupService', '$rootScope', function($scope, $location, $routeParams, GroupService, $rootScope){
  $scope.display=false;
  GroupService.getGroup($routeParams.id).then(function(res){
    $scope.res = res.data;
  }).catch(function(err){
    $location.path('/');
  });

  $scope.deleteGroup = function(group){
    if (confirm('Are you sure you want to delete this group?')) {
      if (confirm('Are you sure?')) {
        GroupService.deleteGroup(group._id).then(function(group){
          $location.path('/');
        }).catch(function(err) {
          console.log("Error", err);
        });
      }
    }
  };

  $scope.createComment = function(comment){ // REFACTOR TO UPDATE 
    GroupService.createComment(comment).then(function(){
      $scope.comment.content="";
      $scope.update();
      $location.path('/groups/'+$routeParams.id);
    }).catch(function(err){
      $location.path('/');
    });
  };

  $scope.deleteComment = function(comment){
    if (confirm('Are you sure you want to delete this comment?')) {
      GroupService.deleteComment(comment._id).then(function(comment){
        $scope.update();
        $location.path('/groups/'+$routeParams.id);
      }).catch(function(err) {
        $location.path('/');
      });
    }
  };

  $scope.createHomework = function(homework){
    GroupService.createHomework(homework).then(function(){
      $scope.homework.content="";
      $scope.hwdisplay=false;
      $scope.update();
      $location.path('/groups/'+$routeParams.id);
    }).catch(function(err){
      $location.path('/');
    });
  };

  $scope.deleteHomework = function(homework){
    if (confirm('Are you sure you want to delete this homework?')) {
      GroupService.deleteHomework(homework).then(function(){
        $scope.update();
        $location.path('/groups/'+$routeParams.id);
      }).catch(function(err){
        $location.path('/');
      });
    }
  };

  $scope.createNote = function(note){
    GroupService.createNote(note).then(function(){
      $scope.note.content="";
      $scope.notedisplay=false;
      $scope.update();
      $location.path('/groups/'+$routeParams.id);
    }).catch(function(err){
      $location.path('/');
    });
  };

  $scope.deleteNote = function(note){
    if (confirm('Are you sure you want to delete this note?')) {
      GroupService.deleteNote(note).then(function(){
        $scope.update();
        $location.path('/groups/'+$routeParams.id);
      }).catch(function(err){
        $location.path('/');
      });
    }
  };

  $scope.createProject = function(project){
    GroupService.createProject(project).then(function(){
      $scope.project.content="";
      $scope.pjdisplay=false;
      $scope.update();
      $location.path('/groups/'+$routeParams.id);
    }).catch(function(err){
      $location.path('/');
    });
  };

  $scope.deleteProject = function(project){
    if (confirm('Are you sure you want to delete this project?')) {
      GroupService.deleteProject(project).then(function(){
        $scope.update();
        $location.path('/groups/'+$routeParams.id);
      }).catch(function(err){
        $location.path('/');
      });
    }
  };

  $scope.update = function(){
    GroupService.getGroup($routeParams.id).then(function(res){
      $scope.display=false;
      $scope.res = res.data;
    }).catch(function(err){
      $location.path('/');
    });
  };
}]);

app.controller("EditGroupController", ['$scope', '$location', '$routeParams', 'GroupService', '$rootScope', function($scope, $location, $routeParams, GroupService, $rootScope){
  $scope.btnshow=true;
  $scope.add = function(){
    uploadcare.openDialog(null, {
      crop: "disabled",
      previewStep: true,
      imagesOnly: true
    }).done(function(file) {
      file.promise().done(function(fileInfo){
        $rootScope.url = fileInfo.cdnUrl;
        $scope.btnshow=false;
        $scope.$apply();
      });
    });
  }; 

  GroupService.getGroup($routeParams.id).then(function(res){
    $scope.group = res.data.group;
  }).catch(function(err){
    $location.path('/');
  }); 
  $scope.editGroup = function(group){
    GroupService.editGroup(group._id, group).then(function(){
      $location.path('/');
    }).catch(function(err) {
      console.log("Error", err);
    });
  };
}]);