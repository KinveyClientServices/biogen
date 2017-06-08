angular.module('starter.controllers', ['kinvey', 'ngCordova'])

.controller('DashCtrl', function($scope) {

    $scope.myTest = function() {
        console.log('inside myTest');
        $ionicSideMenuDelegate.toggleLeft();
    };
})

.controller('MyVideoCtrl', function($scope, $kinvey, $stateParams) {
    console.log($stateParams.videoId);
    //$scope.chat = Chats.get($stateParams.chatId);
    var promise = $kinvey.Files.stream($stateParams.videoId, {
        tls: false
    });
    promise.then(function(file) {
        console.log(file);
        var url = file._downloadURL;
        file._downloadURL = 'https://docs.google.com/gview?embedded=true&url=' + file._downloadURL;
        console.log(url);
        $scope.file = file;
    });
})


.controller('SearchCtrl', function($scope, $kinvey, $sce) {

    // this grabs the Products names for the dropdown select
    //
    $scope.$on('$ionicView.beforeEnter', function() {
        console.log('load search view');

        var dataStore = $kinvey.DataStore.getInstance('products', $kinvey.DataStoreType.Network);

        dataStore.find().subscribe(function(result) {
            var products = result;
            console.log(products);
            $scope.products = products;
            $scope.$digest();
        });
    });

    // this grabs the entity in the Products collection that the user selects
    // from the dropdown
    //
    $scope.searchme = function() {
        console.log('inside searchctrl');

        var querySelect = document.getElementById("chosenProduct").value;
        console.log(querySelect);

        var dataStore = $kinvey.DataStore.getInstance('products', $kinvey.DataStoreType.Network);

        // TODO: LAB 4 - query against the product collection
        //
        var query = new $kinvey.Query();
        query.equalTo('title', querySelect);
        var stream = dataStore.find(query);
        stream.subscribe(function onNext(entities) {
            console.log(entities);
            $scope.thisproduct = entities;
            $scope.$digest();
        }, function onError(error) {
            console.log(error);
        }, function onComplete() {
            console.log('complete');
        });

        // end LAB 4
        //
    };
})

.controller('InsertTicketCtrl', function($scope, $kinvey, $ionicLoading, $cordovaFile) {

    $scope.taskInfo = {
        action: "",
        duedate: "",
        completed: false,
        Title: "Personal Task"
    }

    $scope.insertme = function() {
        console.log('inserting task');

        console.log($scope.taskInfo);

        var dataStore = $kinvey.DataStore.getInstance('tasks', $kinvey.DataStoreType.Network);


        // TODO: LAB 7 - insert tasks into tasks collection
        //
        var promise = dataStore.save($scope.taskInfo).then(function onSuccess(entity) {
            console.log(entity);
        }).catch(function onError(error) {
            console.log(error);
        });


        // end LAB 7
        //

        $ionicLoading.show({
            template: 'task inserted',
            noBackdrop: true,
            duration: 2000
        });
    }
})


.controller('ProductCtrl', function($scope, $kinvey) {

    var dataStore = $kinvey.DataStore.getInstance('products', $kinvey.DataStoreType.Network);

    // grab all products for display on the Products tab
    //
    $scope.$on('$ionicView.beforeEnter', function() {

        console.log('inside productctrl');

        // TODO: LAB 3 - pull all product data for display
        //
        var stream = dataStore.find();
        stream.subscribe(function onNext(entities) {
            console.log(entities);
            $scope.products = entities;
            $scope.$digest();
        }, function onError(error) {
            console.log(error);
        }, function onComplete() {
            console.log('complete');
        });

        //  end LAB 3
        //
    });

    $scope.doRefresh = function() {
        console.log('refresh');
        dataStore.find().subscribe(function(result) {
            var products = result;
            console.log(products);
            $scope.products = products;
            $scope.$digest();
        });
        $scope.$broadcast('scroll.refreshComplete');
    }
})



.controller('ProjectsCtrl', function($scope, $kinvey) {

    // refreshes the tasks list collection
    //
    $scope.doRefresh = function() {
        console.log('tasksrefresh');
        var dataStore = $kinvey.DataStore.getInstance('tasks', $kinvey.DataStoreType.Network);

        var stream = dataStore.find();
        stream.subscribe(function onNext(entities) {
            console.log(entities);
            $scope.tasks = entities;
            $scope.$digest();

        }, function onError(error) {
            console.log(error);
        }, function onComplete() {
            console.log('complete');
        });

    }

    $scope.$on('$ionicView.beforeEnter', function() {
        console.log('tasks load view2');
        var dataStore = $kinvey.DataStore.getInstance('tasks', $kinvey.DataStoreType.Network);

        // TODO: LAB 6 - GetAll from Tasks collection
        //

        var stream = dataStore.find();
        stream.subscribe(function onNext(entities) {
            console.log(entities);
            $scope.tasks = entities;
            $scope.$digest();

        }, function onError(error) {
            console.log(error);
        }, function onComplete() {
            console.log('complete');
        });

        // end LAB 6
        //

    })
})

.controller('RefCtrl', function($scope, $kinvey) {

    $scope.doRefreshRef = function() {
        console.log('ref refresh view');

        var query = new $kinvey.Query();
        query.greaterThan('size', 0);

        var promise = $kinvey.Files.find(query).then(function(files) {
            console.log(files);
            $scope.files = files;
            $scope.$digest();
        }).catch(function(error) {
            console.log(error);
        });

    }

    $scope.$on('$ionicView.beforeEnter', function() {
        console.log('ref load view');

        // TODO: LAB 9 - pull files form the FileStore
        //
        var query = new $kinvey.Query();
        query.equalTo('mimeType', 'image/png');
        var promise = $kinvey.Files.find(null)
            .then(function(files) {
                console.log(files);
                $scope.files = files;
                $scope.$digest();
            })
            .catch(function(error) {
                console.log(error);
            });

        // end LAB 9
        //

    });
})


.controller('OfflineCtrl', function($scope, $kinvey, $ionicLoading) {
    console.log('inside offline ctrl');

    $scope.autoCreate = function(n) {
        var tasks = [];
        for (var i = 0; i < n; i++) {
            const task = {
                "accountname": "Account #" + i,
                "accountcompany": "Company #" + i,
                "autogen": true,
                "Title": "Sync Data"
            }
            tasks.push(task);
        }
        console.log(tasks);
        saveToStore(tasks);
    }

    var dataStore = $kinvey.DataStore.getInstance('doctors', $kinvey.DataStoreType.Sync);

    function saveToStore(data) {
        //save the task to the store
        dataStore.save(data).then(function(result) {
            console.log(result);
            //render(result);
            console.log(data);
            $scope.accounts = $scope.accounts.concat(result);
            $scope.$digest();
            $ionicLoading.show({
                template: '' + data.length + ' task(s) inserted',
                noBackdrop: true,
                duration: 2000
            });

        }).catch(function(error) {
            console.log(error);
        });
    }

    $scope.syncme = function() {
        console.log('syncme');

        // TODO: LAB 8 - sync offline data to the backend
        //
        var promise = dataStore.sync().then(function(entities) {

            console.log(entities.push);
            console.log(entities.pull);
            $scope.accounts = entities.pull;
            $scope.$digest();

        }).catch(function(error) {
            console.log(error);
        });


        // end LAB 8
        //
    }

    /*$scope.deltame = function() {
        console.log('deltame');
        
        dataStore.pull(null, { useDeltaFetch: true }).then(function(result) {
            console.log(result);
            
            $scope.accounts = result;
            $scope.$digest();
        }).catch(function(error) {
            console.log(error);
        });

    }*/

    $scope.$on('$ionicView.beforeEnter', function() {
        console.log('offline load view');
        var dataStore = $kinvey.DataStore.getInstance('doctors', $kinvey.DataStoreType.Sync);
        dataStore.pull().then(function(result) {
            console.log(result);
            $scope.accounts = result;
            $scope.$digest();
        });

    });

    function render(result) {
        const resultArr = [].concat(result);
        $ionicLoading.show({
            template: '' + resultArr.length + ' task(s) inserted',
            noBackdrop: true,
            duration: 2000
        });
        $scope.$digest();
    }

})



.controller('DoctorsCtrl', function($scope, $kinvey) {

    $scope.doRefresh = function() {
        console.log('refresh');

        var dataStore = $kinvey.DataStore.getInstance('doctors', $kinvey.DataStoreType.Network);

        // TODO: LAB 5 - Pull doctors
        //
        var stream = dataStore.find();
        stream.subscribe(function onNext(entities) {
            console.log(entities);
            $scope.accounts = entities;
            $scope.$digest();
        }, function onError(error) {
            console.log(error);
        }, function onComplete() {
            console.log('complete');
        });

        // end LAB 5
        //
    }

    $scope.$on('$ionicView.beforeEnter', function() {
        console.log('accounts load view');
        var dataStore = $kinvey.DataStore.getInstance('doctors', $kinvey.DataStoreType.Network);
        dataStore.find(null, {
            useDeltaFetch: false
        }).subscribe(function(result) {

            $scope.accounts = result;
            $scope.$digest();
        });

    })
})



/*.controller('BrandCtrl', function($scope, $kinvey) {

    $scope.doRefreshBrand = function() {
        console.log('refresh brand');
        $kinvey.DataStore.find('brand').then(function(mybrand) {
            console.log(mybrand);
            $scope.mybrand = mybrand;
        });
    }

    $scope.$on('$ionicView.beforeEnter', function() {
        console.log('brand load view');
        $kinvey.DataStore.find('brand').then(function(brand) {
            console.log(brand);
            $scope.mybrand = brand;
        });
    });

})*/



.controller('MenuCtrl', function($scope, $kinvey, $ionicSideMenuDelegate, $ionicModal) {
    console.log('inside menuctrl');
    $scope.toggleLeft = function() {
        console.log('inside toggleleft');
        $ionicSideMenuDelegate.toggleLeft();
    };

    $ionicModal.fromTemplateUrl('templates/modal.html', function(modal) {
        $scope.modal = modal;
    }, {
        animation: 'slide-in-up'
    });
})



.controller('HomeCtrl', function($scope, $kinvey, $ionicSideMenuDelegate, $rootScope, $state) {
    console.log('home');

    $scope.$on('$ionicView.beforeEnter', function() {
        // we're authenticated, grab logo and color scheme
        console.log('home');
        var query = new $kinvey.Query();
        query.equalTo('ActiveBrand', true);
        var activeUser = $kinvey.User.getActiveUser();

        if (!activeUser) {
            // activeUser is null, go to account tab
            $state.go('menu.tabs.account');
            return;
        }
        console.log(activeUser);

        var dataStore = $kinvey.DataStore.getInstance('BiogenBrand', $kinvey.DataStoreType.Network);


        dataStore.find().subscribe(function(result) {
            console.log(result);
            var brand = result;
            console.log(brand);
            $rootScope.primarycolor = brand[0].PrimaryColor;

            if (brand[0].LogoFileName.indexOf('http') == -1) {
                console.log('local path');
                brand[0].LogoFileName = "img/" + brand[0].LogoFileName;
            }
            $rootScope.logo = brand[0].LogoFileName;
            $rootScope.screenText = brand[0].HomeScreenText;
            $rootScope.textColor = brand[0].PrimaryTextColor;
            $rootScope.customer = brand[0].CustomerName;
            $rootScope.accountsname = brand[0].AccountsName;
            $rootScope.tasksname = brand[0].TasksName;
            $rootScope.addtaskname = brand[0].AddTaskName;
            $rootScope.calcname = brand[0].CalculatorName;
            $rootScope.productsname = brand[0].ProductsName;
            $scope.$digest();
        });
    });
})



.controller('AccountCtrl', function($scope, $state, $kinvey, $cordovaPush, $http, $ionicLoading) {
    $scope.userData = {
        email: "",
        password: ""
    };

    $scope.validateUserKinvey = function() {

        console.log($scope.userData.email);

        // TODO: LAB 2 - authenticate against Kinvey
        // remember to replace username and password with user entered values
        //
        var promise = $kinvey.User.login($scope.userData.email, $scope.userData.password);
        promise.then(function(user) {
            $state.go('menu.tabs.home');
            return $kinvey.Push.register();
        }).catch(function(error) {
            console.log(error.description);
            $ionicLoading.show({
                template: error.message,
                noBackdrop: true,
                duration: 2000
            });
        });

        // End of LAB 2

    };



    $scope.validateUser = function() {
        console.log('login user');

        // TODO: LAB 10 - Optional Mobile Identity Connect lab
        //
        $kinvey.User.loginWithMIC('http://localhost:8100', $kinvey.AuthorizationGrant.AuthorizationCodeLoginPage, { version: "v2" }).then(function(user) {
            console.log(user);
            $kinvey.Push.register();
            $state.go('menu.tabs.home');
        }).catch(function(error) {
            console.log(error);
            $state.go('menu.tabs.account');
        });


        // end LAB 10
        //
    }

    $scope.signUp = function() {

        console.log($scope.userData.email);
        console.log($scope.userData.password);

        if ($scope.userData.email == "" || $scope.userData.password == '') {
            $ionicLoading.show({
                template: "Please fill out username and password",
                noBackdrop: true,
                duration: 2000
            });
            return;
        }

        var promise = $kinvey.User.signup({
            username: $scope.userData.email,
            password: $scope.userData.password,
            email: $scope.userData.email
        });
        console.log("signup promise");
        promise.then(
            function() {
                //Kinvey signup finished with success
                $scope.submittedError = false;
                console.log("signup success");
                $state.go('menu.tabs.home');
            },
            function(error) {
                //Kinvey signup finished with error
                $scope.submittedError = true;
                $scope.errorDescription = error.description;
                console.log(error);
                $ionicLoading.show({
                    template: error.message,
                    noBackdrop: true,
                    duration: 2000
                });
            }
        );
    };

    $scope.logout = function() {
        console.log('logout user2');
        //Kinvey logout starts
        var user = $kinvey.User.getActiveUser();
        if (user) {

            /*$kinvey.Push.unregister()
                .then(function(response) {
                    console.log(response);*/
            return $kinvey.User.logout();
            /*})
            .catch(function(error) {
                console.log(error);
            });*/
        } else {
            console.log('no user to log out');
        }
        //$kinvey.User.logout();
        $ionicLoading.show({
            template: "User logged out",
            noBackdrop: true,
            duration: 2000
        });
    }
});