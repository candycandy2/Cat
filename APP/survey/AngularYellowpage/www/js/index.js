var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
    }
};

app.initialize();

/*********************************************** Angular *************************************************/
var yellowPageApp = angular.module('yellowPage', ['ngRoute']);

/*********************************************** Config *************************************************/
//配置变量
yellowPageApp.config(function($provide) {
    $provide.value('token', '5bdfcfa7413f1');
    $provide.value('pushToken', '140fe1da9e96bb6c81a');
    $provide.value('uuid', '140fe1da9e96bb6c81a');
    $provide.value('appKey', 'appyellowpagedev');
    $provide.value('appSercetKey', 'c103dd9568f8493187e02d4680e1bf2f');
});

//配置路由
yellowPageApp.config(function($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'view/home.html',
            controller: 'HomeController'
        })
        .when('/result', {
            templateUrl: 'view/result.html',
            controller: 'ResultController'
        })
        .when('/detail', {
            templateUrl: 'view/detail.html',
            controller: 'DetailController'
        })
        .otherwise({
            redirectTo:'/home'
        });
})

/*********************************************** Service *************************************************/
//获取当前时间戳以及sercetKey加密
yellowPageApp.service('encTimeStamp', function(appSercetKey) {
    this.getTimeStamp = function() {
        return Math.round(new Date().getTime() / 1000).toString();
    }

    this.getSercetKey = function() {
        var hash = CryptoJS.HmacSHA256(this.getTimeStamp(), appSercetKey);
        return CryptoJS.enc.Base64.stringify(hash);
    }
});


/*********************************************** Factory *************************************************/
yellowPageApp.factory('myPhonebook', function($rootScope, $http, appKey, uuid, token, encTimeStamp) {
    var factory = {};

    factory.getMyPhonebook = function() {
        var queryData = '<LayoutHeader><User_EmpID>1705055</User_EmpID></LayoutHeader>';

        //$http
        $http({
            method: 'POST',
            url: 'https://qplaydev.benq.com/qplayApi/public/v101/custom/'+appKey+'/QueryMyPhoneBook?lang=zh-cn&uuid='+uuid,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'App-Key': appKey,
                'Signature-Time': encTimeStamp.getTimeStamp(),
                'Signature': encTimeStamp.getSercetKey(),
                'token': token
            },
            dataType: "json",
            data: queryData,
            async: true,
            cache: false,
            timeout: 30000
        }).then(function success(data) {
            $rootScope.newPhonebook = data['data']['Content'];
            //console.log($rootScope.newPhonebook);
            window.sessionStorage.setItem('firstQueryPhonebook', 'Y');

        }, function error() {});

    }

    return factory;

});

yellowPageApp.factory('deleteMyPhonebook', function($http, appKey, uuid, token, encTimeStamp, myPhonebook) {
    var factory = {};

    factory.deletePhonebook = function(empId, empCompany) {
        var queryData = '<LayoutHeader><User_EmpID>1705055</User_EmpID><Delete_EmpID>' +
            empId + '</Delete_EmpID><Delete_Company>' + empCompany + '</Delete_Company></LayoutHeader>';

        //$http
        $http({
            method: 'POST',
            url: 'https://qplaydev.benq.com/qplayApi/public/v101/custom/'+appKey+'/DeleteMyPhoneBook?lang=zh-cn&uuid='+uuid,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'App-Key': appKey,
                'Signature-Time': encTimeStamp.getTimeStamp(),
                'Signature': encTimeStamp.getSercetKey(),
                'token': token
            },
            dataType: "json",
            data: queryData,
            async: true,
            cache: false,
            timeout: 30000
        }).then(function success(data) {
            //console.log(data);
            var resultCode = data['data']['ResultCode'];
            if(resultCode == '001904') {
                //update myPhonebook
                myPhonebook.getMyPhonebook();
            }

        }, function error() {});
    }

    return factory;
});

yellowPageApp.factory('ToDetail', function($http, $location, appKey, uuid, token, encTimeStamp) {
    var factory = {};

    factory.changeView = function(company, enName) {
        //query data
        var queryData = '<LayoutHeader><Company>' + company + '</Company><Name_EN>' + enName + '</Name_EN></LayoutHeader>';

        //$http
        $http({
            method: 'POST',
            url: 'https://qplaydev.benq.com/qplayApi/public/v101/custom/'+appKey+'/QueryEmployeeDataDetail?lang=zh-cn&uuid='+uuid,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'App-Key': appKey,
                'Signature-Time': encTimeStamp.getTimeStamp(),
                'Signature': encTimeStamp.getSercetKey(),
                'token': token
            },
            dataType: "json",
            data: queryData,
            async: true,
            cache: false,
            timeout: 30000
        }).then(function success(data) {
            //console.log(data);
            window.sessionStorage.setItem('empDetail', JSON.stringify(data['data']['Content'][0]));
            $location.path('/detail');

        }, function error() {});
    }

    return factory;

});


/*********************************************** Filter *************************************************/
yellowPageApp.filter('telFilter', function() {
    return function(str) {
        var index = str.indexOf(';');
        if(index > 0) {
            return str.substring(0, index);
        } else {
            return str;
        }
    }
});

/************************************************ Controller ************************************************/
yellowPageApp.controller('HomeController', function($rootScope, $scope, $http, $location, encTimeStamp, appKey, uuid, token, myPhonebook, deleteMyPhonebook, ToDetail) {
    //初始值
    $scope.cnName = '';
    $scope.enName = '';
    $scope.dept = '';
    $scope.tel = '';
    $scope.type = 'search';
    $scope.tab1 = true;
    $scope.tab2 = false;
    $scope.toolbar1 = true;
    $scope.toolbar2 = false;
    $scope.selectCount = 0;
    $scope.deleteDisabled = true;
    $scope.msgCheck = false;
    
    //first get my phonebook
    var first = window.sessionStorage.getItem('firstQueryPhonebook');
    if(first == null) {
        myPhonebook.getMyPhonebook();
    }

    //change tab
    $scope.changeTab = function(type) {
        if(type !== $scope.type) {
            $scope.type = type;
            $scope.tab1 = !$scope.tab1;
            $scope.tab2 = !$scope.tab2;
        }
    }

    //click event
    $scope.checkEmp = function() {

        if($scope.cnName == '' && $scope.enName == '' && $scope.dept == '' && $scope.tel == '') {
            //alert
            $scope.msgCheck = true;
        } else {
            //query data
            var queryData = '<LayoutHeader><Company>' + $scope.company + '</Company><Name_CH>' + $scope.cnName + '</Name_CH><Name_EN>' +
            $scope.enName + '</Name_EN><DeptCode>' + $scope.dept + '</DeptCode><Ext_No>' + $scope.tel + '</Ext_No></LayoutHeader>';

            //$http
            $http({
                method: 'POST',
                url: 'https://qplaydev.benq.com/qplayApi/public/v101/custom/'+appKey+'/QueryEmployeeData?lang=zh-cn&uuid='+uuid,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'App-Key': appKey,
                    'Signature-Time': encTimeStamp.getTimeStamp(),
                    'Signature': encTimeStamp.getSercetKey(),
                    'token': token
                },
                dataType: "json",
                data: queryData,
                async: true,
                cache: false,
                timeout: 30000
            }).then(function success(data) {
                console.log(data);
                window.sessionStorage.setItem('recordList', JSON.stringify(data['data']['Content']));
                $location.path('/result');

            }, function error() {});

        }

    }

    //close msg popup
    $scope.closePopup = function() {
        $scope.msgCheck = false;
    }

    //edit or cancel edit
    $scope.editPhonebook = function () {
        $scope.toolbar1 = !$scope.toolbar1;
        $scope.toolbar2 = !$scope.toolbar2;
    }

    //select emp after edit
    $scope.empSelect = function(index) {
        var haveClass = angular.element(document.querySelector(".bookList" + index));
        if(!haveClass.hasClass('activeBackground')) {
            haveClass.addClass('activeBackground');
            $scope.selectCount++;
            $rootScope.newPhonebook[index].confirmDelete = true;
        } else {
            haveClass.removeClass('activeBackground');
            $scope.selectCount--;
            $rootScope.newPhonebook[index].confirmDelete = false;
        }

        //delete btn disabled
        if($scope.selectCount > 0) {
            $scope.deleteDisabled = false;
        } else {
            $scope.deleteDisabled = true;
        }
    }

    //confirm delete phonebook
    $scope.deletePhonebook = function() {
        angular.forEach($rootScope.newPhonebook, function(item, index) {
            if(item.confirmDelete) {
                deleteMyPhonebook.deletePhonebook(item.EmployeeID, item.Company);
            }
        });
        //hide delete btn
        $scope.toolbar1 = !$scope.toolbar1;
        $scope.toolbar2 = !$scope.toolbar2;
        $scope.deleteDisabled = true;
        $scope.selectCount = 0;
    }

    //change page to detail
    $scope.empDetail = function(company, enName) {
        window,sessionStorage.setItem('detailFrom', 'home');
        ToDetail.changeView(company, enName);
    }

});

yellowPageApp.controller('ResultController', function($scope, $location, ToDetail) {
    $scope.noData = false;
    //接收data
    $scope.list = JSON.parse(window.sessionStorage.getItem('recordList'));
    if($scope.list.length == 0) {
        $scope.noData = true;
    } else {
        $scope.noData = false;
    }

    //employee detail
    $scope.empDetail = function(company, enName) {
        window,sessionStorage.setItem('detailFrom', 'result');
        ToDetail.changeView(company, enName);
    }

    //back home
    $scope.backToHome = function() {
        $location.path('/home');
    }

});

yellowPageApp.controller('DetailController', function($rootScope, $scope, $location, $http, encTimeStamp, appKey, uuid, token, myPhonebook) {
    //get data
    $scope.info = JSON.parse(window.sessionStorage.getItem('empDetail'));
    //console.log($scope.info);
    var empId = $scope.info.EmployeeID;
    var empCompany = $scope.info.Company;
    
    //phonebook
    var phonebook = $rootScope.newPhonebook;
    var flag = false;
    for(var i in phonebook) {
        if(empId == phonebook[i].EmployeeID) {
            flag = true;
            break;
        }
    }
    if(!flag) {
        $scope.status = false;
    } else {
        $scope.status = true;
    }

    //init mask
    $scope.add = false;
    $scope.delete = false;
    //$scope.status = false;

    //add or delete
    $scope.toggle = function() {
        //status = false -- add, status = true -- delete
        if(!$scope.status) {
            $scope.add = !$scope.add;
        } else {
            $scope.delete = !$scope.delete;
        }
    }

    //cancel add or delete
    $scope.cancel = function(item) {
        if(item == 'a') {
            $scope.add = !$scope.add;
        } else {
            $scope.delete = !$scope.delete;
        }
    }

    //back to
    $scope.backToResult = function() {
        var detailFrom = window.sessionStorage.getItem('detailFrom');
        $location.path('/' + detailFrom);
    }

    //confirm add
    $scope.confirmAdd = function() {
        $scope.add = !$scope.add;
        //$scope.status = !$scope.status;
        var queryData = '<LayoutHeader><User_EmpID>1705055</User_EmpID><Add_EmpID>' +
            empId + '</Add_EmpID><Add_Company>' + empCompany + '</Add_Company></LayoutHeader>';

        //$http
        $http({
            method: 'POST',
            url: 'https://qplaydev.benq.com/qplayApi/public/v101/custom/'+appKey+'/AddMyPhoneBook?lang=zh-cn&uuid='+uuid,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'App-Key': appKey,
                'Signature-Time': encTimeStamp.getTimeStamp(),
                'Signature': encTimeStamp.getSercetKey(),
                'token': token
            },
            dataType: "json",
            data: queryData,
            async: true,
            cache: false,
            timeout: 30000
        }).then(function success(data) {
            //console.log(data);
            var resultCode = data['data']['ResultCode'];
            if(resultCode == '001902') {
                //change icon
                $scope.status = !$scope.status;
                //update myPhonebook
                myPhonebook.getMyPhonebook();
            }

        }, function error() {});
    }

    //confirm delete
    $scope.confirmDelete = function() {
        $scope.delete = !$scope.delete;
        //$scope.status = !$scope.status;

        var queryData = '<LayoutHeader><User_EmpID>1705055</User_EmpID><Delete_EmpID>' +
            empId + '</Delete_EmpID><Delete_Company>' + empCompany + '</Delete_Company></LayoutHeader>';

        //$http
        $http({
            method: 'POST',
            url: 'https://qplaydev.benq.com/qplayApi/public/v101/custom/'+appKey+'/DeleteMyPhoneBook?lang=zh-cn&uuid='+uuid,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'App-Key': appKey,
                'Signature-Time': encTimeStamp.getTimeStamp(),
                'Signature': encTimeStamp.getSercetKey(),
                'token': token
            },
            dataType: "json",
            data: queryData,
            async: true,
            cache: false,
            timeout: 30000
        }).then(function success(data) {
            //console.log(data);
            var resultCode = data['data']['ResultCode'];
            if(resultCode == '001904') {
                //change icon
                $scope.status = !$scope.status;
                //update myPhonebook
                myPhonebook.getMyPhonebook();
            }

        }, function error() {});
    }

});