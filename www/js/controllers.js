angular.module('starter.controllers', ['kinvey', 'ngCordova'])

.controller('DashCtrl', function($scope) {

    $scope.myTest = function() {
        console.log('inside myTest');
        $ionicSideMenuDelegate.toggleLeft();
    };
})

.controller('PlacesCtrl', function($kinvey, $scope, $rootScope) {

    console.log('places ctrl');
    $scope.placesData = {
        range: "",
        interest: ""
    };

    $scope.doRefresh = function() {
        console.log('current_loc = ' + $rootScope.current_loc);
        console.log($scope.placesData.range);
        console.log($scope.placesData.interest);
        //console.log( 'range = ' + document.getElementById("myrange").value);
        //console.log( 'interest = ' + document.getElementById("myinterest").value);


        var distance = parseInt($scope.placesData.range);
        console.log('distance = ' + distance);
        var dataStore = $kinvey.DataStore.getInstance('places', $kinvey.DataStoreType.Network);

        var myzone = [$rootScope.current_loc[1], $rootScope.current_loc[0]];

        var query = new $kinvey.Query();
        query.equalTo('keyword', $scope.placesData.interest).near('_geoloc', myzone, distance);
        console.log(query);
        //query.near('_geoloc', $rootScope.current_loc, document.getElementById("myrange"));
        dataStore.find(query).subscribe(function(places) {
            console.log(places);
            $scope.places = places;
            $scope.$digest();
            return;
        });

    }

})


.controller('MapCtrl', function($scope, $kinvey, $rootScope) {
    console.log('mapctrl');
    var gmarkers = [];

    $scope.initialize = function() {

            console.log('initializing map');

            var myLatlng = new google.maps.LatLng(39.8282109, -98.5795706);
            //$scope.mybrand = mybrand;
            var mapOptions = {
                center: myLatlng,
                zoom: 3,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            $rootScope.map = new google.maps.Map(document.getElementById("mymap"),
                mapOptions);
        } // end initialize


    $scope.doRefresh = function() {
            //check to see if a range has been specified
            console.log('refresh');
            if (document.getElementById("myrange").value == "") {
                console.log('no range');
                var dataStore = $kinvey.DataStore.getInstance('Account', $kinvey.DataStoreType.Network);

                dataStore.find().subscribe(function(locations) {
                    console.log(locations);
                    locations = locations.cache;
                    for (var i = 0; i < locations.length; i++) {
                        var mylat = parseInt(locations[i]._geoloc[0]);
                        var mylong = parseInt(locations[i]._geoloc[1]);
                        console.log(mylat + ", " + mylong);
                        console.log(locations[i].company.name);
                        var info = new google.maps.InfoWindow({
                            content: '<b>Who:</b> ' + locations[i].name + '<br><b>Notes:</b> ' + locations[i].company.name
                        });


                        var mapOptions = {

                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };

                        var myLatlng = new google.maps.LatLng(mylat, mylong);
                        var marker = new google.maps.Marker({
                            position: myLatlng,
                            map: $rootScope.map,
                            title: locations[i].name
                        });
                        gmarkers.push(marker);
                        google.maps.event.addListener(marker, 'click', (function(info) {
                            return function() {
                                info.open($rootScope.map, this);
                            }
                        })(info));

                    }

                });
            } else {
                console.log('range specified');
                console.log('gmarker len = ' + gmarkers.length);
                console.log($rootScope.current_loc);

                var myrange = document.getElementById("myrange").value;
                console.log('myrange = ' + myrange);

                console.log('getting position');


                // Query for buildings close by.
                var query = new $kinvey.Query();
                var dataStore = $kinvey.DataStore.getInstance('Account', $kinvey.DataStoreType.Network);
                query.near('_geoloc', $rootScope.current_loc, myrange);
                //debugger;
                var promise = dataStore.find(query).subscribe(function(models) {
                    console.log(models);

                    console.log('num markers = ' + models.length);
                    for (i = 0; i < gmarkers.length; i++) {
                        console.log('clearing marker...');
                        gmarkers[i].setMap(null);
                    }


                    for (var i = 0; i < models.length; i++) {
                        var mylat = parseInt(models[i]._geoloc[0]);
                        var mylong = parseInt(models[i]._geoloc[1]);
                        console.log(mylat + ", " + mylong);
                        console.log(models[i].accountcompany);
                        var info = new google.maps.InfoWindow({
                            content: '<b>Who:</b> ' + models[i].accountname + '<br><b>Notes:</b> ' + models[i].accountcompany
                        });

                        var mapOptions = {
                            //center: myLatlng,
                            //zoom: 3,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };

                        var myLatlng = new google.maps.LatLng(mylat, mylong);
                        var marker = new google.maps.Marker({
                            position: myLatlng,
                            map: $rootScope.map,
                            title: models[i].name
                        });

                        gmarkers.push(marker);

                        google.maps.event.addListener(marker, 'click', (function(info) {
                            return function() {
                                info.open($rootScope.map, this);
                            }
                        })(info));

                    }
                    $scope.$digest();
                    return
                }, function(err) {
                    console.log(err);
                });

            }

        } // end doRefresh

    $scope.$on('$ionicView.beforeEnter', function() {

        console.log('before entering map view');
        var dataStore = $kinvey.DataStore.getInstance('Account');

        dataStore.find().subscribe(function(locations) {
            console.log(locations);
            locations = locations;
            console.log(locations.length);
            for (var i = 0; i < locations.length; i++) {
                var mylat = parseInt(locations[i]._geoloc[0]);
                var mylong = parseInt(locations[i]._geoloc[1]);
                console.log(mylat + ", " + mylong);

                var info = new google.maps.InfoWindow({
                    content: '<b>Who:</b> ' + locations[i].accountname + '<br><b>Company:</b> ' + locations[i].accountcompany
                });

                var mapOptions = {

                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                var myLatlng = new google.maps.LatLng(mylat, mylong);
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: $rootScope.map,
                    title: locations[i].name
                });
                gmarkers.push(marker);
                google.maps.event.addListener(marker, 'click', (function(info) {
                    return function() {
                        info.open($rootScope.map, this);
                    }
                })(info));

            }

        });
    });



})


.controller('SearchCtrl', function($scope, $kinvey, $sce) {

    $scope.$on('$ionicView.beforeEnter', function() {
        console.log('load search view');

        var dataStore = $kinvey.DataStore.getInstance('Products', $kinvey.DataStoreType.Network);

        dataStore.find().subscribe(function(result) {
            var products = result;
            console.log(products);
            $scope.products = products;
            $scope.$digest();
        });
    });


    $scope.searchme = function() {
        console.log('inside searchctrl');

        console.log(document.getElementById("chosenProduct").value);
        var dataStore = $kinvey.DataStore.getInstance('Products', $kinvey.DataStoreType.Network);

        var query = new $kinvey.Query();
        query.equalTo('title', document.getElementById("chosenProduct").value);
        dataStore.find(query).subscribe(function(result) {
            var thisproduct = result;
            console.log(thisproduct);
            $scope.thisproduct = thisproduct;
            $scope.$digest();
            return; //result.networkPromise;
        });
        /*.then(function(thisproduct) {
                    $scope.thisproduct = thisproduct;
                    $scope.$digest();

                    return;
                });*/
    };
})

.controller('InsertTicketCtrl', function($scope, $kinvey, $ionicLoading) {
    $scope.insertme = function() {
        var mytask = document.getElementById("task").value;
        document.getElementById("task").value = "";
        console.log(mytask);

        var myduedate = document.getElementById("duedate").value;
        console.log(duedate);
        document.getElementById("duedate").value = "";



        var mycomplete = document.getElementById("completed").checked;
        console.log(mycomplete);


        var complete = false;
        if (mycomplete == true) {
            complete = true;
        } else {
            complete = false;
        }


        var data = {};

        data.action = mytask;
        data.duedate = myduedate;
        data.completed = complete;
        data.class = "personal";
        data.Title = "Personal Task";
        console.log(JSON.stringify(data));

        var dataStore = $kinvey.DataStore.getInstance('todo', $kinvey.DataStoreType.Network);

        dataStore.save(data).then(function(result) {
            console.log(result);
        }).catch(function(error) {
            console.log(error);
        });

        $ionicLoading.show({
            template: 'task inserted',
            noBackdrop: true,
            duration: 2000
        });

    };
})





.controller('ProductCtrl', function($scope, $kinvey) {

    var dataStore = $kinvey.DataStore.getInstance('Products', $kinvey.DataStoreType.Network);

    $scope.$on('$ionicView.beforeEnter', function() {

        console.log('inside productctrl');

        dataStore.find().subscribe(function(result) {
            var products = result;
            console.log(products);
            $scope.products = products;
            $scope.$digest();
            //return result.networkPromise;
        });
    });
})

.controller('PatientCtrl', function($scope, $kinvey, $state, $rootScope) {

    console.log('inside patientctrl');

    $scope.patient = {
        _id: "",
        MaritalStatus: "",
        FirstName: "",
        LastName: "",
        DOB: "",
        Nickname: "",
        SSN: "",
        Sex: ""
    };

    var patientStore = $kinvey.DataStore.getInstance('Patient',$kinvey.DataStoreType.Network);
    var drugStore = $kinvey.DataStore.getInstance('ClinicalSummary', $kinvey.DataStoreType.Network);

    $scope.searchme = function() {
        console.log('inside searchme');

        console.log( $scope.patient.FirstName);
        console.log( $scope.patient.LastName);

        var query = new $kinvey.Query();
    query.equalTo('FirstName',$scope.patient.FirstName)
         .equalTo('LastName',$scope.patient.LastName);
         //.equalTo('DOB',$scope.patient.DOB);
    patientStore.find(query).subscribe(function(models) {
        console.log("subscribe fired "+JSON.stringify(models));
        if (models.length == 1) {
          console.log("updating view");
          $scope.patient = models[0];
          $scope.$digest();
        } else {
          alert("no results found, please specify First, Last, DOB")
        }
    }, function(err) {
      console.log("err "+JSON.stringify(err));
    }, function(res) {
      console.log("subscribe complete");
    });
    }

    $scope.admitme = function(patient) {
        console.log('inside admitme');
        console.log(patient);

        patientStore.save({
            eventType: "Arrival",
            _id: $scope.patient._id
        }).then(function(models) {
            console.log("success " + JSON.stringify(models));
            $scope.status = "Admitted (" + models[0].Message + ")";
            $scope.$digest();
            alert("Admission successful, confirmation# = " + models[0].Message)
        }, function(err) {
            console.log("err " + JSON.stringify(err));
        });
    }

    $scope.drugme = function(patient) {
        console.log('inside drugme');
        console.log(patient);

        var query = new $kinvey.Query();
        query.equalTo('FirstName', 'Matthew')
            .equalTo('LastName', 'DeLacey');

        drugStore.find(query).subscribe(function(models) {
            console.log(models);
            //set drug info in global scope
            $rootScope.mydrugs = models[0].Medications;

            $state.go('menu.drugs');
            console.log('should have moved');
        }, function(err) {
            console.log("err " + JSON.stringify(err));
        });
    }

})



.controller('ProjectsCtrl', function($scope, $kinvey) {

    $scope.doRefresh = function() {
        console.log('todorefresh');
        var dataStore = $kinvey.DataStore.getInstance('todo', $kinvey.DataStoreType.Sync);

        dataStore.sync(null, {
            useDeltaFetch: false
        }).then(function(result) {
            var tasks = result.pull;
            tasks.concat(result.push)
            console.log(tasks);
            $scope.tasks = tasks;
            $scope.$digest();

        }).catch(function(error) {
            console.log(error);
        });
    }

    $scope.$on('$ionicView.beforeEnter', function() {
        console.log('todo load view');
        var dataStore = $kinvey.DataStore.getInstance('todo', $kinvey.DataStoreType.Sync);

        // pass null and the useDeltaFetch option because some of the delta fetch options for
        // rapid connectors might not be there in SharePoint today
        //
        dataStore.sync(null, {
            useDeltaFetch: false
        }).then(function(result) {
            var tasks = result.pull;
            console.log(tasks);
            $scope.tasks = tasks;
            $scope.$digest();

        }).catch(function(error) {
            console.log(error);
        });

    })
})

.controller('RefCtrl', function($scope, $kinvey) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    $scope.doRefreshRef = function() {
        console.log('ref refresh view');
        //var fileStore = new $kinvey.Files();
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

        var query = new $kinvey.Query();
        query.greaterThan('size', 0);
        var promise = $kinvey.Files.find(query).then(function(files) {
            console.log(files);
            $scope.files = files;
            $scope.$digest();
        }).catch(function(error) {
            console.log(error);
        });
        
    });
})

.controller('PartnerDetailCtrl', function($scope, $kinvey, $stateParams) {
    console.log('inside partnerdetailctrl');
    console.log($stateParams.partnerId);

    var dataStore = $kinvey.DataStore.getInstance('Account', $kinvey.DataStoreType.Network);

    dataStore.findById($stateParams.partnerId).subscribe(function(result) {
        //var invoices = result;
        console.log(result);
        $scope.invoices = result.invoice;
        $scope.$digest();
        //$scope.$digest();
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

    var dataStore = $kinvey.DataStore.getInstance('Account', $kinvey.DataStoreType.Sync);

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
        dataStore.sync().then(function(result) {
            console.log(result);
            console.log('pull = ');
            console.log(result.pull);
            console.log('push=');
            console.log(result.push);
            $scope.servicetechs = result.pull;
            $scope.$digest();
        }).catch(function(error) {
            console.log(error);
        });
    }

    $scope.$on('$ionicView.beforeEnter', function() {
        console.log('offline load view');
        var dataStore = $kinvey.DataStore.getInstance('Account', $kinvey.DataStoreType.Sync);
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



.controller('PartnerCtrl', function($scope, $kinvey) {

    $scope.doRefresh = function() {
        console.log('refresh');

        var dataStore = $kinvey.DataStore.getInstance('Account', $kinvey.DataStoreType.Network);

        dataStore.find(null, {
            useDeltaFetch: false
        }).subscribe(function(result) {
            console.log(result);

            $scope.accounts = result;
            $scope.$digest();
        });
    }

    $scope.$on('$ionicView.beforeEnter', function() {
        console.log('account load view');
        var dataStore = $kinvey.DataStore.getInstance('Account', $kinvey.DataStoreType.Network);
        dataStore.find(null, {
            useDeltaFetch: false
        }).subscribe(function(result) {

            $scope.accounts = result;
            $scope.$digest();
        });

    })
})



.controller('BrandCtrl', function($scope, $kinvey) {

    $scope.doRefreshBrand = function() {
        console.log('refresh brand');
        $kinvey.DataStore.find('brand').then(function(mybrand) {
            console.log(mybrand);
            $scope.mybrand = mybrand;
        });
    }

    $scope.$on('$ionicView.beforeEnter', function() {
        console.log('partner load view');
        $kinvey.DataStore.find('brand').then(function(brand) {
            console.log(brand);
            $scope.mybrand = brand;
        });
    });

})

.controller('DrugCtrl', function($scope, $state, $kinvey, $rootScope) {
    console.log('inside DrugCtrl');
    console.log($rootScope.mydrugs);
    $scope.drugs = $rootScope.mydrugs;
})



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

    try {
        navigator.geolocation.getCurrentPosition(function(loc) {
            console.log('getting position');
            var coord = [loc.coords.latitude, loc.coords.longitude];
            console.log(coord);
            $rootScope.current_loc = coord;
        });
    } catch (evt) {
        alert('fail' + evt.message);
    }


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

        var dataStore = $kinvey.DataStore.getInstance('DemoBrandingData', $kinvey.DataStoreType.Network);


        dataStore.find(query).subscribe(function(result) {
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
            //return result.networkPromise;
        });
    });


})



.controller('AccountCtrl', function($scope, $state, $kinvey, $cordovaPush, $http) {
    $scope.userData = {
        email: "",
        password: ""
    };

    $scope.validateUserKinvey = function() {

        console.log($scope.userData.email);

        var promise = $kinvey.User.login({
            username: $scope.userData.email,
            password: $scope.userData.password
        });
        promise.then(
            function(response) {
                //debugger;
                //Kinvey login finished with success
                $scope.submittedError = false;
                console.log('logged in with KinveyAuth2');
                $state.go('menu.tabs.home');
                return $kinvey.Push.register();
            }).catch(
            function(error) {
                //Kinvey login finished with error
                $scope.submittedError = true;
                $scope.errorDescription = error.description;
                console.log("Error login " + error.description); //
            });
    };



    $scope.validateUser = function() {
        console.log('login user');

        var user = new $kinvey.User();
        user.loginWithMIC('http://localhost:8100', $kinvey.AuthorizationGrant.AuthorizationCodeLoginPage, {
            version: 2
        }).then(function(user) {
            console.log('logged in');
            $scope.submittedError = false;
            console.log(user);

            
            return $kinvey.Push.register();

        }).catch(function(error) {
            console.log(error);
            return null;
        }).then(function() {
            $state.go('menu.tabs.home');
        }, function(err) {
            console.log("error logging in");
            $scope.submittedError = true;
            $scope.errorDescription = err.description;
            console.log(err);
            console.log("Error login " + err.description);
            $state.go('menu.tabs.account');
        });
    }

    $scope.signUp = function() {
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
                console.log("signup error: " + error.description);
            }
        );
    };

    $scope.logout = function() {
        console.log('logout user');
        //Kinvey logout starts
        var user = $kinvey.User.getActiveUser();
        if (user) {
            return user.logout().catch(function(error) {
                //Kinvey logout finished with error
                alert("Error logout: " + JSON.stringify(error));
            });
        }

    }

});