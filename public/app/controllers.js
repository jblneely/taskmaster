angular.module('TaskCtrls', ['TaskServices'])

.controller('HomeCtrl', ['$scope', 'Task', function($scope, Task) {
        $scope.tasks = [];

        Task.query(function success(data) {
            $scope.tasks = data;
        }, function error(data) {
            console.log(data);
        });

        $scope.deleteTask = function(id, tasksIdx) {
            Task.delete({ id: id }, function success(data) {
                $scope.tasks.splice(tasksIdx, 1);
            }, function error(data) {
                console.log(data);
            });
        };

    }])
    .controller('ShowCtrl', ['$scope', '$stateParams', 'Task', function($scope, $stateParams, Task) {
        $scope.task = {};

        Task.get({ id: $stateParams.id }, function success(data) {
            $scope.task = data;
        }, function error(data) {
            console.log(data);
        });
        $scope.deleteTask = function(id, tasksIdx) {
            Task.delete({ id: id }, function success(data) {
                $scope.tasks.splice(tasksIdx, 1);
            }, function error(data) {
                console.log(data);
            });
        };

    }])
    .controller('ShowAllCtrl', ['$scope', 'Task', '$location', 'Auth', function($scope, Task, $location, Auth) {
        $scope.tasks = [];
        var user = Auth.currentUser();

        Task.query(function success(data) {
            $scope.tasks = data;
        }, function error(data) {
            console.log(data);
        });

        $scope.completedTask = function(id, tasksIdx) {
            console.log('checking completed on task db');
            Task.put({ id: id, userId: user.id }, function(task) {
                // console.log('line 51 controllers, completed task');
                $location.path('/chart/' + user.id);
            }, function error(data) {
                console.log("error", data);
            });
        };

        $scope.deleteTask = function(id, tasksIdx) {
            Task.delete({ id: id }, function success(data) {
                $scope.tasks.splice(tasksIdx, 1);
            }, function error(data) {
                console.log(data);
            });
        };
    }])
    .controller('NewCtrl', ['$scope', '$location', 'Task', function($scope, $location, Task) {
        $scope.task = {
            title: '',
            description: '',
            image: ''
        };

        $scope.createTask = function() {
            Task.save($scope.task, function success(data) {
                $location.path('/tasks/');
            }, function error(data) {
                console.log(data);
            });
        };
    }])
    .controller('NavCtrl', ['$scope', 'Auth', '$location', function($scope, Auth, $location) {
        $scope.user = Auth.currentUser();

        $scope.isLoggedIn = function() {
            return Auth.isLoggedIn();
        };

        $scope.logout = function() {
            Auth.removeToken();
            $location.path('/');
        };
    }])

.controller('SignupCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
        $scope.user = {
            email: '',
            password: ''
        };
        $scope.userSignup = function() {
            $http.post('/api/users', $scope.user).then(function success(res) {
                console.log('successfully created a new user', res);
                $location.path('/'); //relocate to the home page
            }, function error(res) {
                console.log('Error while signing up', res);
            });
        };
    }])
    .controller('LoginCtrl', ['$scope', '$timeout', 'Auth', '$http', '$location', 'Alerts', function($scope, $timeout, Auth, $http, $location, Alerts) {
        $scope.user = {
            email: '',
            password: ''
        };
        var clearAlerts = function() {
            Alerts.clear();
        };

        $scope.userLogin = function() {
            $http.post('/api/auth', $scope.user).then(function success(res) {
                console.log('response from server when loggin in:', res);
                Auth.saveToken(res.data.token);
                Alerts.add('success', 'You are now logged in, congrats.');
                $timeout(clearAlerts, 1500);
                $location.path('/'); //redirect to home
            }, function error(res) {
                console.log('Something went wrong', res);
                Alerts.add('error', 'Bad Login Info, Please Try Again!!');
                $timeout(clearAlerts, 1500);
            });
        };
    }])

.controller('AlertsController', ['$scope', 'Alerts', function($scope, Alerts) {
    $scope.alerts = function() {
        return Alerts.get();
    };
}])

.controller("LineCtrl", ['$scope', 'Auth', 'Task', '$http', '$stateParams', function($scope, Auth, Task, $http, $stateParams) {
    $http.get('/api/tasks/usertasks/' + $stateParams.id).then(function success(res) {
        console.log('okay', res.data.user);
        //Stuff goes here
        //for loop to create taskDataFromDB object
        // var taskDataFromDB = [{ tasks: 5, date: '05/22/17' },
        //     { tasks: 8, date: '05/23/17' },
        //     { tasks: 11, date: '05/24/17' },
        //     { tasks: 7.75, date: '05/25/17' },
        //     { tasks: 5, date: '05/26/17' },
        //     { tasks: 6, date: '05/27/17' },
        //     { tasks: 8.5, date: '05/28/17' }
        // ];
        console.log('in the line controller');
        var dateArray = [];
        var numberArray = [];
        res.data.user.completedTask.forEach(function(dataPoint) {
            dateArray.push(formatDate(new Date(Date.parse(dataPoint.completedDate))));
            numberArray.push(dataPoint.title);
        });

        var tasks = [{
            label: 'task',
            data: [5, 8, 6, 9, 6, 10, 4],
            backgroundColor: [
                'rgba(54, 162, 235, 0.2)'
            ]
        }, {
            label: 'from database',
            data: numberArray,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)'
            ]
        }];

        var ctx = document.getElementById("line").getContext('2d');

        var line = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dateArray,
                datasets: tasks
            }
        });
    }, function err(res) {
        console.log('error', res);
    });

}]);

function formatDate(dateToFormat) {
    console.log('type of completed date', typeof dateToFormat);
    var dd = dateToFormat.getDate();
    var mm = dateToFormat.getMonth() + 1; //January is 0!
    var yyyy = dateToFormat.getFullYear();
    return mm + '/' + dd + '/' + yyyy;
}
